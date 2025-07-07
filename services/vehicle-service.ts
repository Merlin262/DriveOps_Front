import { API_BASE_URL } from "@/lib/config"
import type { IVehicle, IVehicleInput, IVehicleService } from "@/types/vehicle"
import { getPassengerCount, formatChassisId } from "@/types/vehicle"

export class VehicleService implements IVehicleService {
  private vehicles: IVehicle[] = []

  constructor() {
  }

  vehicleTypeMap = {
    0: "Bus",
    1: "Truck",
    2: "Car",
  }

  async addVehicle(vehicleInput: IVehicleInput): Promise<IVehicle> {
    const vehicleTypeEnum: Record<string, number> = { Bus: 0, Truck: 1, Car: 2 }
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const payload = {
      type: vehicleTypeEnum[vehicleInput.type],
      chassisSeries: vehicleInput.chassisId.chassisSeries,
      chassisNumber: Number(vehicleInput.chassisId.chassisNumber),
      color: vehicleInput.color,
    }
    const response = await fetch(`${baseUrl}/api/Vehicles`, {
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
    const vehicle = await response.json()
    return {
      ...vehicle,
      type: this.vehicleTypeMap[vehicle.type as keyof typeof this.vehicleTypeMap] ?? "Car",
      chassisId: {
        chassisSeries: vehicle.chassisSeries,
        chassisNumber: vehicle.chassisNumber,
      }
    }
  }

  async editVehicleColor(chassisSeries: string, chassisNumber: number, color: string): Promise<IVehicle> {
    const vehicle = this.vehicles.find(
      (v) => v.chassisId.chassisSeries === chassisSeries && v.chassisId.chassisNumber === chassisNumber,
    )

    if (!vehicle) {
      throw new Error(`Vehicle with chassis ID ${chassisSeries}-${chassisNumber} not found`)
    }

    vehicle.color = color
    return vehicle
  }

  async updateVehicleColor(chassisSeries: string, chassisNumber: number, newColor: string): Promise<void> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const response = await fetch(`${baseUrl}/api/Vehicles/${chassisSeries}/${chassisNumber}/color`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newColor.trim()),
    })
    if (!response.ok) {
      throw new Error("Failed to update vehicle color")
    }
  }

  async getAllVehicles(): Promise<IVehicle[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
      const apiUrl = `${baseUrl}/api/Vehicles`
      const response = await fetch(apiUrl)
      if (!response.ok) throw new Error("Failed to fetch vehicles")
      const vehicles = await response.json()
      return vehicles.map((v: any) => ({
        ...v,
        type: this.vehicleTypeMap[v.type as keyof typeof this.vehicleTypeMap] ?? "Car",
        chassisId: {
          chassisSeries: v.chassisSeries,
          chassisNumber: v.chassisNumber,
        },
        createdAt: v.createdAt ? new Date(v.createdAt) : new Date(),
        updatedAt: v.updatedAt ? new Date(v.updatedAt) : new Date(),
      }))
    } catch (error) {
      console.error("Error fetching vehicles:", error)
      return []
    }
  }

  async findVehicleByChassisId(chassisSeries: string, chassisNumber: number): Promise<IVehicle | null> {
    try {
      const apiUrl = `${API_BASE_URL}/api/Vehicles/${chassisSeries}/${chassisNumber}`
      const response = await fetch(apiUrl)
      if (!response.ok) return null
      const vehicle = await response.json()

      const mappedVehicle: IVehicle = {
        ...vehicle,
        type: this.vehicleTypeMap[vehicle.type as keyof typeof this.vehicleTypeMap] ?? "Car",
        chassisId: {
          chassisSeries: vehicle.chassisSeries,
          chassisNumber: vehicle.chassisNumber,
        }
      }
      return mappedVehicle
    } catch {
      return null
    }
  }
}
