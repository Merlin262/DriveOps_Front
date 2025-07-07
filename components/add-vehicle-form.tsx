"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useVehicleContext } from "@/contexts/vehicle-context"
import type { IVehicleInput, VehicleType } from "@/types/vehicle"
import { getPassengerCount } from "@/types/vehicle"
import { API_BASE_URL } from "@/lib/config"

export function AddVehicleForm() {
  const { vehicleService, refreshVehicles } = useVehicleContext()
  const [formData, setFormData] = useState<IVehicleInput>({
    chassisId: {
      chassisSeries: "",
      chassisNumber: 0,
    },
    type: "Car",
    color: "",
  })
  const [errors, setErrors] = useState<{
    chassisSeries?: string
    chassisNumber?: string
    type?: string
    color?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!formData.chassisId.chassisSeries.trim()) {
      newErrors.chassisSeries = "Chassis Series is required"
    }
    if (!formData.chassisId.chassisNumber || formData.chassisId.chassisNumber <= 0) {
      newErrors.chassisNumber = "Chassis Number must be a positive integer"
    }
    if (!formData.type) {
      newErrors.type = "Vehicle type is required"
    }
    if (!formData.color.trim()) {
      newErrors.color = "Color is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const vehicleTypeEnum: Record<string, number> = { Bus: 0, Truck: 1, Car: 2 }
      const payload = {
        type: vehicleTypeEnum[formData.type],
        chassisSeries: formData.chassisId.chassisSeries,
        chassisNumber: Number(formData.chassisId.chassisNumber),
        color: formData.color,
      }
      const response = await fetch(`${API_BASE_URL}/api/Vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        let errorText = await response.text()
        let userMessage = "Erro ao adicionar veículo"
        if (errorText) {
          const match = errorText.match(/System\.InvalidOperationException: (.+?)\r?\n/)
          if (match && match[1]) {
            userMessage = match[1]
          }
        }
        throw new Error(userMessage)
      }
      setSubmitStatus("success")
      setSubmitMessage("Vehicle added successfully!")
      setFormData({
        chassisId: {
          chassisSeries: "",
          chassisNumber: 0,
        },
        type: "Car",
        color: "",
      })
      setErrors({})
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | number | VehicleType) => {
    if (field === "chassisSeries") {
      setFormData((prev) => ({
        ...prev,
        chassisId: { ...prev.chassisId, chassisSeries: value as string },
      }))
    } else if (field === "chassisNumber") {
      setFormData((prev) => ({
        ...prev,
        chassisId: { ...prev.chassisId, chassisNumber: value as number },
      }))
    } else if (field === "type") {
      setFormData((prev) => ({ ...prev, type: value as VehicleType }))
    } else if (field === "color") {
      setFormData((prev) => ({ ...prev, color: value as string }))
    }

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    setSubmitStatus("idle")
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title h5 mb-1">Add New Vehicle</h3>
        <p className="card-text text-muted mb-0">Enter vehicle details to add it to the inventory</p>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Chassis Series */}
            <div className="col-md-6">
              <label htmlFor="chassisSeries" className="form-label">
                Chassis Series <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.chassisSeries ? "is-invalid" : ""}`}
                id="chassisSeries"
                value={formData.chassisId.chassisSeries}
                maxLength={2}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 2)
                  handleInputChange("chassisSeries", value)
                }}
                placeholder="e.g., TO"
                style={{ textTransform: "uppercase" }}
              />
              {errors.chassisSeries && <div className="invalid-feedback">{errors.chassisSeries}</div>}
            </div>

            {/* Chassis Number */}
            <div className="col-md-6">
              <label htmlFor="chassisNumber" className="form-label">
                Chassis Number <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                className={`form-control ${errors.chassisNumber ? "is-invalid" : ""}`}
                id="chassisNumber"
                value={formData.chassisId.chassisNumber || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                  handleInputChange("chassisNumber", value ? Number(value) : 0)
                }}
                placeholder="e.g., 123456"
                min="1"
              />
              {errors.chassisNumber && <div className="invalid-feedback">{errors.chassisNumber}</div>}
            </div>

            {/* Vehicle Type */}
            <div className="col-md-6">
              <label htmlFor="type" className="form-label">
                Vehicle Type <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${errors.type ? "is-invalid" : ""}`}
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value as VehicleType)}
              >
                <option value="Car">Car</option>
                <option value="Truck">Truck</option>
                <option value="Bus">Bus</option>
              </select>
              {errors.type && <div className="invalid-feedback">{errors.type}</div>}
              <div className="form-text">Passengers: {getPassengerCount(formData.type)}</div>
            </div>

            {/* Color */}
            <div className="col-md-6">
              <label htmlFor="color" className="form-label">
                Color <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.color ? "is-invalid" : ""}`}
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                placeholder="Enter color"
              />
              {errors.color && <div className="invalid-feedback">{errors.color}</div>}
            </div>
          </div>

          {/* Vehicle Preview */}
          {formData.chassisId.chassisSeries && formData.chassisId.chassisNumber > 0 && (
            <div className="alert alert-info mt-3" role="alert">
              <h6 className="alert-heading">Vehicle Preview</h6>
              <p className="mb-0">
                <strong>Chassis ID:</strong> {formData.chassisId.chassisSeries}-{formData.chassisId.chassisNumber} |{" "}
                <strong>Type:</strong> {formData.type} | <strong>Passengers:</strong> {getPassengerCount(formData.type)}{" "}
                | <strong>Color:</strong> {formData.color || "Not specified"}
              </p>
            </div>
          )}

          {/* Status Alert */}
          {submitStatus !== "idle" && (
            <div className={`alert ${submitStatus === "success" ? "alert-success" : "alert-danger"} mt-3`} role="alert">
              <div className="d-flex align-items-center">
                {submitStatus === "success" ? (
                  <CheckCircle size={16} className="me-2" />
                ) : (
                  <AlertCircle size={16} className="me-2" />
                )}
                {submitMessage}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Adding Vehicle...
                </>
              ) : (
                "Add Vehicle"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
