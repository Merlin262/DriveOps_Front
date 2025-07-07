"use client"

import type React from "react"
import { useState } from "react"
import { Search, AlertCircle, Car, Truck, Bus } from "lucide-react"
import { useVehicleContext } from "@/contexts/vehicle-context"
import type { IVehicle, VehicleType } from "@/types/vehicle"
import { formatChassisId, parseChassisId } from "@/types/vehicle"

function getVehicleIcon(type: VehicleType, size = 24) {
  switch (type) {
    case "Car":
      return <Car size={size} className="text-primary" />
    case "Truck":
      return <Truck size={size} className="text-warning" />
    case "Bus":
      return <Bus size={size} className="text-success" />
    default:
      return <Car size={size} className="text-primary" />
  }
}

export function FindVehicleForm() {
  const { vehicleService } = useVehicleContext()
  const [chassisIdInput, setChassisIdInput] = useState("")
  const [foundVehicle, setFoundVehicle] = useState<IVehicle | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchStatus, setSearchStatus] = useState<"idle" | "not-found" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSearch = async () => {
    if (!chassisIdInput.trim()) {
      setSearchStatus("error")
      setErrorMessage("Please enter a chassis ID (format: SERIES-NUMBER)")
      return
    }

    const parsedChassisId = parseChassisId(chassisIdInput.trim())
    if (!parsedChassisId) {
      setSearchStatus("error")
      setErrorMessage("Invalid chassis ID format. Use format: SERIES-NUMBER (e.g., TOY-123456)")
      return
    }

    setIsSearching(true)
    setSearchStatus("idle")
    setFoundVehicle(null)
    setErrorMessage("")

    try {
      const vehicle = await vehicleService.findVehicleByChassisId(
        parsedChassisId.chassisSeries,
        parsedChassisId.chassisNumber,
      )
      if (vehicle) {
        setFoundVehicle(vehicle)
      } else {
        setSearchStatus("not-found")
        setErrorMessage(`Vehicle with chassis ID "${chassisIdInput}" not found`)
      }
    } catch (error) {
      setSearchStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An error occurred while searching")
    } finally {
      setIsSearching(false)
    }
  }

  const handleReset = () => {
    setChassisIdInput("")
    setFoundVehicle(null)
    setSearchStatus("idle")
    setErrorMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title h5 mb-1 d-flex align-items-center">
          <Search size={20} className="me-2" />
          Find Vehicle
        </h3>
        <p className="card-text text-muted mb-0">Search for a vehicle using its chassis ID</p>
      </div>
      <div className="card-body">
        {/* Search Section */}
        <div className="mb-4">
          <label htmlFor="chassis-search" className="form-label">
            Chassis ID
          </label>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              id="chassis-search"
              value={
                // Exibe o '-' após as duas letras, mas não salva no estado
                chassisIdInput.length > 2
                  ? `${chassisIdInput.slice(0, 2)}-${chassisIdInput.slice(2)}`
                  : chassisIdInput
              }
              onChange={(e) => {
                // Remove o '-' para processar apenas letras e números
                let rawValue = e.target.value.replace(/-/g, "").toUpperCase().replace(/[^A-Z0-9]/g, "")
                // Permite apenas 2 letras e até 6 números após as letras
                if (rawValue.length > 2) {
                  rawValue = rawValue.slice(0, 2) + rawValue.slice(2).replace(/[^0-9]/g, "")
                }
                rawValue = rawValue.slice(0, 8) // Limita a 8 caracteres (2 letras + 6 números)
                setChassisIdInput(rawValue)
                setSearchStatus("idle")
                setFoundVehicle(null)
              }}
              placeholder="Ex: AB-123456"
              pattern="[A-Z]{2}-[0-9]{6}"
              onKeyDown={handleKeyDown}
              style={{ textTransform: "uppercase" }}
            />
            <button
              className="btn btn-primary"
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
          <div className="form-text">Format: SERIES-NUMBER (e.g., TOY-123456, HON-987654)</div>

          <button className="btn btn-outline-secondary btn-sm" onClick={handleReset}>
            Clear Search
          </button>
        </div>

        {/* Error/Not Found Messages */}
        {searchStatus !== "idle" && (
          <div className={`alert ${searchStatus === "not-found" ? "alert-warning" : "alert-danger"}`} role="alert">
            <div className="d-flex align-items-center">
              <AlertCircle size={16} className="me-2" />
              {errorMessage}
            </div>
          </div>
        )}

        {/* Vehicle Details Section */}
        {foundVehicle && (
          <div className="card border-primary">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="card-title h5 mb-0 d-flex align-items-center">
                <span className="me-2 text-white">{getVehicleIcon(foundVehicle.type, 24)}</span>
                {foundVehicle.type}
              </h4>
              <span className="badge bg-light text-dark fs-6">{foundVehicle.numberOfPassengers} passengers</span>
            </div>
            <div className="card-body">
              <p className="font-monospace text-muted mb-4 h5">{formatChassisId(foundVehicle.chassisId)}</p>

              <div className="row g-4">
                {/* Chassis Information */}
                <div className="col-md-6">
                  <h5 className="border-bottom pb-2 mb-3">Chassis Information</h5>
                  <div className="row g-2">
                    <div className="col-6">
                      <strong>Chassis Series:</strong>
                    </div>
                    <div className="col-6 font-monospace">{foundVehicle.chassisId.chassisSeries}</div>

                    <div className="col-6">
                      <strong>Chassis Number:</strong>
                    </div>
                    <div className="col-6 font-monospace">{foundVehicle.chassisId.chassisNumber}</div>

                    <div className="col-6">
                      <strong>Full Chassis ID:</strong>
                    </div>
                    <div className="col-6 font-monospace fw-bold">{formatChassisId(foundVehicle.chassisId)}</div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="col-md-6">
                  <h5 className="border-bottom pb-2 mb-3">Vehicle Details</h5>
                  <div className="row g-2">
                    <div className="col-6">
                      <strong>Type:</strong>
                    </div>
                    <div className="col-6">
                      <span className="d-flex align-items-center">
                        <span className="me-2">{getVehicleIcon(foundVehicle.type, 16)}</span>
                        {foundVehicle.type}
                      </span>
                    </div>

                    <div className="col-6">
                      <strong>Color:</strong>
                    </div>
                    <div className="col-6">
                      <span className="fw-bold" style={{ color: foundVehicle.color.toLowerCase() }}>
                        {foundVehicle.color}
                      </span>
                    </div>

                    <div className="col-6">
                      <strong>Passengers:</strong>
                    </div>
                    <div className="col-6">
                      <span className="badge bg-secondary">{foundVehicle.numberOfPassengers}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="alert alert-info mt-4" role="alert">
                <h6 className="alert-heading">Vehicle Summary</h6>
                <p className="mb-0">
                  This is a <strong>{foundVehicle.type.toLowerCase()}</strong> with chassis ID{" "}
                  <code>{formatChassisId(foundVehicle.chassisId)}</code> in{" "}
                  <strong>{foundVehicle.color.toLowerCase()}</strong> color, designed to carry{" "}
                  <strong>{foundVehicle.numberOfPassengers}</strong> passenger
                  {foundVehicle.numberOfPassengers !== 1 ? "s" : ""}.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
