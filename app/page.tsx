"use client"
import { Car, Plus, Edit, List, Search } from "lucide-react"
import { VehicleProvider } from "@/contexts/vehicle-context"
import { AddVehicleForm } from "@/components/add-vehicle-form"
import { EditVehicleForm } from "@/components/edit-vehicle-form"
import { VehicleList } from "@/components/vehicle-list"
import { FindVehicleForm } from "@/components/find-vehicle-form"

export default function VehicleManagementApp() {
  return (
    <VehicleProvider>
      <div className="container-fluid py-4">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="d-flex align-items-center justify-content-center mb-3">
              <h1 className="display-4 fw-bold text-dark mb-0">Vehicle Management System</h1>
            </div>
          </div>

          {/* Main Card */}
          <div className="card main-card">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title h4 mb-1">Vehicle Operations</h2>
            </div>
            <div className="card-body p-4">
              {/* Bootstrap Tabs */}
              <ul className="nav nav-pills nav-fill mb-4" id="vehicleTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active d-flex align-items-center justify-content-center"
                    id="add-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#add"
                    type="button"
                    role="tab"
                    aria-controls="add"
                    aria-selected="true"
                  >
                    <Plus size={16} className="me-2" />
                    Add Vehicle
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link d-flex align-items-center justify-content-center"
                    id="edit-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#edit"
                    type="button"
                    role="tab"
                    aria-controls="edit"
                    aria-selected="false"
                  >
                    <Edit size={16} className="me-2" />
                    Edit Vehicle
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link d-flex align-items-center justify-content-center"
                    id="list-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#list"
                    type="button"
                    role="tab"
                    aria-controls="list"
                    aria-selected="false"
                  >
                    <List size={16} className="me-2" />
                    List All
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link d-flex align-items-center justify-content-center"
                    id="find-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#find"
                    type="button"
                    role="tab"
                    aria-controls="find"
                    aria-selected="false"
                  >
                    <Search size={16} className="me-2" />
                    Find Vehicle
                  </button>
                </li>
              </ul>

              {/* Tab Content */}
              <div className="tab-content" id="vehicleTabsContent">
                <div
                  className="tab-pane fade show active"
                  id="add"
                  role="tabpanel"
                  aria-labelledby="add-tab"
                  tabIndex={0}
                >
                  <AddVehicleForm />
                </div>
                <div className="tab-pane fade" id="edit" role="tabpanel" aria-labelledby="edit-tab" tabIndex={0}>
                  <EditVehicleForm />
                </div>
                <div className="tab-pane fade" id="list" role="tabpanel" aria-labelledby="list-tab" tabIndex={0}>
                  <VehicleList />
                </div>
                <div className="tab-pane fade" id="find" role="tabpanel" aria-labelledby="find-tab" tabIndex={0}>
                  <FindVehicleForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VehicleProvider>
  )
}
