export type VehicleType = "Bus" | "Truck" | "Car"

export interface IChassisId {
  chassisSeries: string
  chassisNumber: number
}

export interface IVehicle {
  chassisId: IChassisId
  type: VehicleType
  numberOfPassengers: number
  color: string
}

export interface IVehicleInput {
  chassisId: IChassisId
  type: VehicleType
  color: string
}

export interface IVehicleService {
  addVehicle(vehicle: IVehicleInput): Promise<IVehicle>
  editVehicleColor(chassisSeries: string, chassisNumber: number, color: string): Promise<IVehicle>
  getAllVehicles(): Promise<IVehicle[]>
  findVehicleByChassisId(chassisSeries: string, chassisNumber: number): Promise<IVehicle | null>
}

// Helper function to get number of passengers based on vehicle type
export function getPassengerCount(type: VehicleType): number {
  switch (type) {
    case "Truck":
      return 1
    case "Bus":
      return 42
    case "Car":
      return 4
    default:
      return 0
  }
}

// Helper function to format chassis ID for display
export function formatChassisId(chassisId: IChassisId): string {
  return `${chassisId.chassisSeries}-${chassisId.chassisNumber}`
}

// Helper function to parse chassis ID from string
// export function parseChassisId(chassisIdString: string): IChassisId | null {
//   console.log(chassisIdString)
//   const parts = chassisIdString.split("-")
//   if (parts.length !== 2) return null

//   const chassisNumber = Number.parseInt(parts[1])
//   console.log(chassisNumber)
//   if (isNaN(chassisNumber) || chassisNumber < 0) return null

//   console.log(parts[0].trim())
//   console.log(chassisNumber)

//   return {
//     chassisSeries: parts[0].trim(),
//     chassisNumber: chassisNumber,
//   }
// }

export function parseChassisId(input: string) {
  // Aceita exatamente 2 letras e 6 números, sem hífen
  const match = input.match(/^([A-Z]{2})([0-9]{6})$/)
  if (!match) return null
  return {
    chassisSeries: match[1],
    chassisNumber: parseInt(match[2], 10),
  }
}
