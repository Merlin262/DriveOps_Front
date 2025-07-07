"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"
import type { IVehicle } from "@/types/vehicle"
import { VehicleService } from "@/services/vehicle-service"

interface VehicleContextType {
  vehicles: IVehicle[]
  vehicleService: VehicleService
  refreshVehicles: () => Promise<void>
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined)

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<IVehicle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [vehicleService] = useState(() => new VehicleService())

  const refreshVehicles = async () => {
    try {
      setIsLoading(true)
      const allVehicles = await vehicleService.getAllVehicles()
      setVehicles(allVehicles)
    } catch (error) {
      console.error("Error refreshing vehicles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    refreshVehicles()
  }, [])

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        vehicleService,
        refreshVehicles,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </VehicleContext.Provider>
  )
}

export function useVehicleContext() {
  const context = useContext(VehicleContext)
  if (context === undefined) {
    throw new Error("useVehicleContext must be used within a VehicleProvider")
  }
  return context
}
