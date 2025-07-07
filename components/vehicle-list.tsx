"use client"

import { useEffect } from "react"
import { RefreshCw, Car, Truck, Bus } from "lucide-react"
import { useVehicleContext } from "@/contexts/vehicle-context"
import type { IVehicle, VehicleType } from "@/types/vehicle"
import { formatChassisId } from "@/types/vehicle"

function getVehicleIcon(type: VehicleType) {
  switch (type) {
    case "Car":
      return <Car size={20} />
    case "Truck":
      return <Truck size={20} />
    case "Bus":
      return <Bus size={20} />
    default:
      return <Car size={20} />
  }
}

function getVehicleColor(type: VehicleType) {
  switch (type) {
    case "Car":
      return "text-primary"
    case "Truck":
      return "text-warning"
    case "Bus":
      return "text-success"
    default:
      return "text-primary"
  }
}

function VehicleCard({ vehicle }: { vehicle: IVehicle }) {
  return (
    <div className="col">
      <div className="card h-100">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className={`me-2 ${getVehicleColor(vehicle.type)}`}>{getVehicleIcon(vehicle.type)}</span>
            <h5 className="card-title mb-0">{vehicle.type}</h5>
          </div>
          <span className="badge bg-secondary">{vehicle.numberOfPassengers} passengers</span>
        </div>
        <div className="card-body">
          <p className="card-text font-monospace text-muted small mb-3">{formatChassisId(vehicle.chassisId)}</p>

          <div className="row g-2 small">
            <div className="col-6">
              <strong>Chassis Series:</strong>
            </div>
            <div className="col-6">{vehicle.chassisId.chassisSeries}</div>

            <div className="col-6">
              <strong>Chassis Number:</strong>
            </div>
            <div className="col-6">{vehicle.chassisId.chassisNumber}</div>

            <div className="col-6">
              <strong>Color:</strong>
            </div>
            <div className="col-6">
              <span className="fw-bold" style={{ color: vehicle.color.toLowerCase() }}>
                {vehicle.color}
              </span>
            </div>

            <div className="col-6">
              <strong>Passengers:</strong>
            </div>
            <div className="col-6">{vehicle.numberOfPassengers}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function VehicleList() {
  const { vehicles, refreshVehicles, isLoading } = useVehicleContext()

  useEffect(() => {
    refreshVehicles()
  }, [])

  const vehicleStats = {
    total: vehicles.length,
    cars: vehicles.filter((v) => v.type === "Car").length,
    trucks: vehicles.filter((v) => v.type === "Truck").length,
    buses: vehicles.filter((v) => v.type === "Bus").length,
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <h3 className="card-title h5 mb-1 d-flex align-items-center">
            <Car size={20} className="me-2" />
            All Vehicles
          </h3>
          <p className="card-text text-muted mb-0">
            {vehicleStats.total} vehicle{vehicleStats.total !== 1 ? "s" : ""} in inventory
            {vehicleStats.total > 0 && (
              <span className="ms-2">
                ({vehicleStats.cars} cars, {vehicleStats.trucks} trucks, {vehicleStats.buses} buses)
              </span>
            )}
          </p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={refreshVehicles} disabled={isLoading}>
          <RefreshCw size={16} className={`me-2 ${isLoading ? "spinner-border spinner-border-sm" : ""}`} />
          Refresh
        </button>
      </div>
      <div className="card-body">
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary me-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span>Loading vehicles...</span>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <Car size={48} className="mb-3 opacity-50" />
            <p className="mb-1">No vehicles found in inventory</p>
            <small>Add a vehicle to get started</small>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={`${vehicle.chassisId.chassisSeries}-${vehicle.chassisId.chassisNumber}`}
                vehicle={vehicle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
