"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle, Search } from "lucide-react"
import { useVehicleContext } from "@/contexts/vehicle-context"
import type { IVehicle } from "@/types/vehicle"
import { formatChassisId, parseChassisId } from "@/types/vehicle"
import { API_BASE_URL } from "@/lib/config"

export function EditVehicleForm() {
  const { vehicleService, refreshVehicles } = useVehicleContext()
  const [chassisIdInput, setChassisIdInput] = useState("")
  const [newColor, setNewColor] = useState("")
  const [foundVehicle, setFoundVehicle] = useState<IVehicle | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error" | "not-found">("idle")
  const [message, setMessage] = useState("")

  const handleSearch = async () => {
    if (!chassisIdInput.trim()) {
      setStatus("error")
      setMessage("Please enter a chassis ID (format: AB-123456)")
      return
    }

    console.log(chassisIdInput)

    // Remove o hífen antes de passar para o parse
    const parsedChassisId = parseChassisId(chassisIdInput.replace("-", "").trim())
    console.log(parsedChassisId)
    if (!parsedChassisId) {
      setStatus("error")
      setMessage("Invalid chassis ID format. Use format: AB-123456")
      return
    }

    setIsSearching(true)
    setStatus("idle")
    setFoundVehicle(null)

    try {
      const vehicle = await vehicleService.findVehicleByChassisId(
        parsedChassisId.chassisSeries,
        parsedChassisId.chassisNumber,
      )
      if (vehicle) {
        setFoundVehicle(vehicle)
        setNewColor(vehicle.color)
        setStatus("idle")
      } else {
        setStatus("not-found")
        setMessage(`Vehicle with chassis ID "${chassisIdInput}" not found`)
      }
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "An error occurred while searching")
    } finally {
      setIsSearching(false)
    }
  }

  const handleUpdate = async () => {
    if (!foundVehicle || !newColor.trim()) {
      setStatus("error")
      setMessage("Please enter a new color")
      return
    }

    if (newColor.trim() === foundVehicle.color) {
      setStatus("error")
      setMessage("New color must be different from current color")
      return
    }

    setIsUpdating(true)
    setStatus("idle")

    
    try {
      const raw = chassisIdInput.replace(/-/g, "")
      const series = raw.slice(0, 2)
      const number = parseInt(raw.slice(2), 10)
      const response = await fetch(`${API_BASE_URL}/api/Vehicles/${series}/${number}/color`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newColor.trim()),
      })
      if (!response.ok) throw new Error("Failed to update vehicle color")
      await refreshVehicles()
      setStatus("success")
      setMessage("Vehicle color updated successfully!")
      setFoundVehicle((prev) => (prev ? { ...prev, color: newColor.trim(), updatedAt: new Date() } : null))
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "An error occurred while updating")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReset = () => {
    setChassisIdInput("")
    setNewColor("")
    setFoundVehicle(null)
    setStatus("idle")
    setMessage("")
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title h5 mb-1">Edit Vehicle Color</h3>
        <p className="card-text text-muted mb-0">Find a vehicle by chassis ID and update its color</p>
      </div>
      <div className="card-body">
        {/* Search Section */}
        <div className="mb-4">
          <label htmlFor="search-chassis" className="form-label">
            Chassis ID
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="search-chassis"
              value={chassisIdInput}
              onChange={(e) => {
                let raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                if (raw.length > 8) raw = raw.slice(0, 8)
                let letters = raw.slice(0, 2).replace(/[^A-Z]/g, "")
                let numbers = raw.slice(2).replace(/[^0-9]/g, "")
                let formatted = letters
                if (letters.length === 2 && numbers.length > 0) {
                  formatted += "-" + numbers
                } else if (letters.length > 0) {
                  formatted += numbers
                } else {
                  formatted = numbers
                }
                setChassisIdInput(formatted)
                setStatus("idle")
                setFoundVehicle(null)
              }}
              placeholder="Ex: AB-123456"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{ textTransform: "uppercase" }}
              pattern="[A-Z]{2}-[0-9]{1,6}"
            />
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={handleSearch}
              disabled={isSearching || !chassisIdInput.trim()}
            >
              {isSearching ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <Search size={16} />
              )}
            </button>
          </div>
          <div className="form-text">Format: SERIES-NUMBER (e.g., TOY-123456)</div>
        </div>

        {/* Vehicle Details Section */}
        {foundVehicle && (
          <div className="card bg-light mb-4">
            <div className="card-header">
              <h4 className="card-title h6 mb-0">Vehicle Found</h4>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <strong>Chassis ID:</strong>{" "}
                  <span className="font-monospace">{formatChassisId(foundVehicle.chassisId)}</span>
                </div>
                <div className="col-md-6">
                  <strong>Type:</strong> {foundVehicle.type}
                </div>
                <div className="col-md-6">
                  <strong>Number of Passengers:</strong> {foundVehicle.numberOfPassengers}
                </div>
                <div className="col-md-6">
                  <strong>Current Color:</strong> <span className="fw-bold">{foundVehicle.color}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Color Section */}
        {foundVehicle && (
          <div className="mb-4">
            <label htmlFor="new-color" className="form-label">
              New Color
            </label>
            <input
              type="text"
              className="form-control"
              id="new-color"
              value={newColor}
              onChange={(e) => {
                setNewColor(e.target.value)
                setStatus("idle")
              }}
              placeholder="Enter new color"
            />

            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-success"
                onClick={handleUpdate}
                disabled={isUpdating || !newColor.trim() || newColor.trim() === foundVehicle.color}
              >
                {isUpdating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : (
                  "Update Color"
                )}
              </button>
              <button className="btn btn-outline-secondary" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {status !== "idle" && (
          <div
            className={`alert ${
              status === "success" ? "alert-success" : status === "not-found" ? "alert-warning" : "alert-danger"
            }`}
            role="alert"
          >
            <div className="d-flex align-items-center">
              {status === "success" ? (
                <CheckCircle size={16} className="me-2" />
              ) : (
                <AlertCircle size={16} className="me-2" />
              )}
              {message}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
