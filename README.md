# Vehicle Management System

A modern React-based frontend application for managing vehicle inventory with simplified vehicle attributes, built with Bootstrap 5 for responsive design.

## Vehicle Specifications

Based on the provided specifications, each vehicle contains only the following attributes:

### Chassis ID
- **Chassis Series**: String (e.g., "TOY", "HON", "MER")
- **Chassis Number**: Unsigned integer (e.g., 123456)

### Vehicle Type
Can be one of:
- **Bus** - Always has 42 passengers
- **Truck** - Always has 1 passenger  
- **Car** - Always has 4 passengers

### Color
- **Type**: String (e.g., "Silver", "Blue", "White")

### Number of Passengers
Automatically determined by vehicle type:
- Trucks: 1 passenger
- Buses: 42 passengers
- Cars: 4 passengers

## Features

- **Add New Vehicle**: Insert vehicles with chassis ID, type, and color
- **Edit Vehicle Color**: Update vehicle color by chassis ID lookup
- **List All Vehicles**: Display all vehicles with type-specific icons and statistics
- **Find Vehicle**: Search and display detailed vehicle information by chassis ID
- **Input Validation**: Comprehensive form validation with Bootstrap styling
- **Responsive Design**: Mobile-friendly interface using Bootstrap 5
- **TypeScript**: Full type safety with interfaces and proper typing

## Technology Stack

- **Frontend**: React 18 with Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Bootstrap 5.3.2 (via CDN)
- **Icons**: Lucide React (Car, Truck, Bus icons)
- **State Management**: React Context API
- **Architecture**: Service layer pattern with interfaces

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                 # Main application page
│   ├── layout.tsx              # Root layout with Bootstrap CDN
│   └── globals.css             # Custom CSS overrides
├── components/
│   ├── add-vehicle-form.tsx    # Add vehicle component
│   ├── edit-vehicle-form.tsx   # Edit vehicle component
│   ├── vehicle-list.tsx        # List vehicles component
│   └── find-vehicle-form.tsx   # Find vehicle component
├── contexts/
│   └── vehicle-context.tsx     # Global state management
├── services/
│   └── vehicle-service.ts      # Business logic service
├── types/
│   └── vehicle.ts              # TypeScript interfaces and utilities
└── README.md
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

1. **Clone or download the project**
2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser** and navigate to \`http://localhost:3000\`

## Usage Guide

### Adding a Vehicle
1. Navigate to the "Add Vehicle" tab
2. Fill in the required fields:
   - **Chassis Series**: 3-letter code (automatically uppercase)
   - **Chassis Number**: Positive integer
   - **Vehicle Type**: Select from Car, Truck, or Bus
   - **Color**: Vehicle color
3. Number of passengers is automatically set based on vehicle type
4. Preview shows the complete vehicle information
5. Click "Add Vehicle" to save

### Editing a Vehicle
1. Go to the "Edit Vehicle" tab
2. Enter the chassis ID in format: SERIES-NUMBER (e.g., TOY-123456)
3. Click search to find the vehicle
4. If found, vehicle details will display
5. Enter a new color (must be different from current)
6. Click "Update Color" to save changes

### Viewing All Vehicles
1. Click the "List All" tab
2. All vehicles display in a responsive card grid
3. Each card shows:
   - Vehicle type with appropriate icon (Car/Truck/Bus)
   - Chassis ID in readable format
   - Color with visual representation
   - Number of passengers
   - Creation and update dates
4. Header shows statistics breakdown by vehicle type

### Finding a Vehicle
1. Select the "Find Vehicle" tab
2. Enter chassis ID in format: SERIES-NUMBER
3. Click search or press Enter
4. If found, detailed information displays including:
   - Chassis information breakdown
   - Vehicle details with type-specific icon
   - Color visualization
   - Record timestamps
   - Summary description

## Data Model

### Vehicle Interface
\`\`\`typescript
interface IVehicle {
  chassisId: {
    chassisSeries: string    // e.g., "TOY"
    chassisNumber: number    // e.g., 123456
  }
  type: "Bus" | "Truck" | "Car"
  numberOfPassengers: number  // Auto-calculated: Bus=42, Truck=1, Car=4
  color: string
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Validation Rules
- **Chassis Series**: Required, automatically converted to uppercase
- **Chassis Number**: Required, must be positive integer
- **Vehicle Type**: Required, must be Bus, Truck, or Car
- **Color**: Required string
- **Chassis ID Format**: Must follow SERIES-NUMBER pattern (e.g., TOY-123456)

### Business Rules
- No duplicate chassis IDs allowed (same series + number combination)
- Number of passengers automatically determined by vehicle type
- Color updates must be different from current color
- Chassis ID format enforced in search and edit operations

## Architecture & Design Patterns

### Service Layer Pattern
- **VehicleService**: Implements business logic and data operations
- **IVehicleService**: Interface defining service contract
- Separation of concerns between UI and business logic

### Interface-Based Design
- **IVehicle**: Main vehicle data structure
- **IVehicleInput**: Input validation structure
- **IVehicleService**: Service contract interface
- **VehicleType**: Union type for vehicle types

### Utility Functions
- **getPassengerCount()**: Returns passenger count based on vehicle type
- **formatChassisId()**: Formats chassis ID for display (SERIES-NUMBER)
- **parseChassisId()**: Parses chassis ID string into components

### Component Architecture
- **Context Provider**: Global state management
- **Form Components**: Bootstrap-styled form handling
- **Validation**: Client-side input validation with Bootstrap classes
- **Error Handling**: Bootstrap alert components for status messages

## Testing Considerations

The application is structured for easy testing:

### Unit Testing Areas
- **VehicleService**: All CRUD operations with chassis ID handling
- **Utility Functions**: Chassis ID parsing and formatting
- **Form Validation**: Input validation logic with Bootstrap classes
- **Component Logic**: State management and user interactions
- **Context Provider**: Global state operations

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Bootstrap Support**: All browsers supported by Bootstrap 5
- **Responsive Design**: Mobile and desktop compatibility

## Contributing

1. Follow TypeScript strict mode guidelines
2. Maintain interface-based architecture
3. Use Bootstrap classes for styling consistency
4. Follow chassis ID format requirements (SERIES-NUMBER)
5. Ensure passenger count logic matches vehicle type rules
6. Add proper validation for new features
7. Update tests for new functionality

## License

This project is available for educational and commercial use.
\`\`\`
