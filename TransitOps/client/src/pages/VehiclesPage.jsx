import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import api from "../lib/api.js";
import { vehiclesApi } from "../lib/vehiclesApi.js";
import "../App.css";

const FUEL_TYPES = ["diesel", "electric", "petrol", "cng", "hybrid", "lpg"];
const VEHICLE_STATUSES = ["active", "maintenance", "retired"];

function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deletingVehicle, setDeletingVehicle] = useState(null);
  const [formData, setFormData] = useState(initialFormState());
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [canManageVehicles, setCanManageVehicles] = useState(false);

  function initialFormState() {
    return {
      plateNumber: "",
      vin: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      fuelType: "diesel",
      status: "active",
      odometerReading: 0,
      fuelCapacityLiters: "",
      fuelEfficiencyKmpl: "",
      purchaseDate: "",
      purchasePrice: "",
      insuranceExpiry: "",
      registrationExpiry: "",
      notes: "",
    };
  }

  function resetForm() {
    setFormData(initialFormState());
    setFormErrors({});
    setEditingVehicle(null);
    setShowCreateDialog(false);
  }

  async function fetchVehicles() {
    try {
      const response = await vehiclesApi.list();
      setVehicles(response.data.data.vehicles || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        const [vehiclesResponse, profileResponse] = await Promise.all([
          vehiclesApi.list(),
          api.get("/v1/auth/me"),
        ]);
        const role = profileResponse.data.data.user.roleName?.toLowerCase();
        if (active) {
          setVehicles(vehiclesResponse.data.data.vehicles || []);
          setCanManageVehicles(
            ["admin", "fleet manager", "safety officer"].includes(role),
          );
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to load vehicles");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadInitialData();
    return () => {
      active = false;
    };
  }, []);

  function validateForm(data) {
    const errors = {};
    if (!data.plateNumber?.trim())
      errors.plateNumber = "Plate number is required";
    if (!data.make?.trim()) errors.make = "Make is required";
    if (!data.model?.trim()) errors.model = "Model is required";
    if (!data.year || data.year < 1900 || data.year > 2100)
      errors.year = "Year must be between 1900 and 2100";
    if (!data.fuelType) errors.fuelType = "Fuel type is required";
    if (data.odometerReading !== undefined && data.odometerReading < 0)
      errors.odometerReading = "Odometer must be zero or greater";
    if (data.fuelCapacityLiters !== "" && data.fuelCapacityLiters < 0)
      errors.fuelCapacityLiters = "Fuel capacity must be zero or greater";
    if (data.fuelEfficiencyKmpl !== "" && data.fuelEfficiencyKmpl < 0)
      errors.fuelEfficiencyKmpl = "Fuel efficiency must be zero or greater";
    return errors;
  }

  function handleChange(e) {
    const { name, value, type } = e.target;
    const parsedValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...formData };
      if (payload.fuelCapacityLiters === "") payload.fuelCapacityLiters = null;
      if (payload.fuelEfficiencyKmpl === "") payload.fuelEfficiencyKmpl = null;
      if (payload.purchasePrice === "") payload.purchasePrice = null;
      if (payload.purchaseDate === "") payload.purchaseDate = null;
      if (payload.insuranceExpiry === "") payload.insuranceExpiry = null;
      if (payload.registrationExpiry === "") payload.registrationExpiry = null;
      if (payload.vin === "") payload.vin = null;
      if (payload.color === "") payload.color = null;
      if (payload.notes === "") payload.notes = null;

      if (editingVehicle) {
        await vehiclesApi.update(editingVehicle.id, payload);
      } else {
        await vehiclesApi.create(payload);
      }
      resetForm();
      fetchVehicles();
    } catch (err) {
      setFormErrors({
        submit: err.response?.data?.message || "Failed to save vehicle",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(vehicle) {
    setEditingVehicle(vehicle);
    setFormData({
      plateNumber: vehicle.plateNumber,
      vin: vehicle.vin || "",
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color || "",
      fuelType: vehicle.fuelType,
      status: vehicle.status,
      odometerReading: vehicle.odometerReading,
      fuelCapacityLiters: vehicle.fuelCapacityLiters || "",
      fuelEfficiencyKmpl: vehicle.fuelEfficiencyKmpl || "",
      purchaseDate: vehicle.purchaseDate
        ? vehicle.purchaseDate.split("T")[0]
        : "",
      purchasePrice: vehicle.purchasePrice || "",
      insuranceExpiry: vehicle.insuranceExpiry
        ? vehicle.insuranceExpiry.split("T")[0]
        : "",
      registrationExpiry: vehicle.registrationExpiry
        ? vehicle.registrationExpiry.split("T")[0]
        : "",
      notes: vehicle.notes || "",
    });
    setShowCreateDialog(true);
  }

  function handleDeleteClick(vehicle) {
    setDeletingVehicle(vehicle);
  }

  async function confirmDelete() {
    if (!deletingVehicle) return;
    try {
      await vehiclesApi.delete(deletingVehicle.id);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete vehicle");
    } finally {
      setDeletingVehicle(null);
    }
  }

  function openCreateDialog() {
    setEditingVehicle(null);
    setFormData(initialFormState());
    setFormErrors({});
    setShowCreateDialog(true);
  }

  if (loading && vehicles.length === 0) {
    return <div className="loading">Loading vehicles...</div>;
  }

  return (
    <AppLayout>
        <header className="dashboard-header">
          <div>
            <p className="card-kicker">Vehicle Management</p>
            <h1>Fleet Vehicles</h1>
            <p>
              Manage your fleet vehicles, track status, and maintain records.
            </p>
          </div>
          {canManageVehicles ? (
            <button
              type="button"
              className="primary-button"
              onClick={openCreateDialog}
            >
              Add Vehicle
            </button>
          ) : null}
        </header>

        {error && <div className="error-message">{error}</div>}

        <section className="dashboard-panel">
          <div className="table-container">
            <table className="vehicles-table">
              <thead>
                <tr>
                  <th>Plate Number</th>
                  <th>Make / Model</th>
                  <th>Year</th>
                  <th>Fuel Type</th>
                  <th>Status</th>
                  <th>Odometer</th>
                  {canManageVehicles ? <th>Actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={canManageVehicles ? 7 : 6} className="empty-state">
                      No vehicles found.
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>{vehicle.plateNumber}</td>
                      <td>
                        <strong>{vehicle.make}</strong> {vehicle.model}
                      </td>
                      <td>{vehicle.year}</td>
                      <td>
                        <span
                          className={`status-badge status-${vehicle.fuelType}`}
                        >
                          {vehicle.fuelType}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${vehicle.status}`}
                        >
                          {vehicle.status}
                        </span>
                      </td>
                      <td>{vehicle.odometerReading?.toLocaleString()} km</td>
                      {canManageVehicles ? <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="icon-button"
                            onClick={() => handleEdit(vehicle)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="icon-button danger"
                            onClick={() => handleDeleteClick(vehicle)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td> : null}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {showCreateDialog && (
          <div className="dialog-overlay" onClick={() => resetForm()}>
            <div className="dialog" onClick={(e) => e.stopPropagation()}>
              <h2>{editingVehicle ? "Edit Vehicle" : "Add Vehicle"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="plateNumber">Plate Number *</label>
                    <input
                      type="text"
                      id="plateNumber"
                      name="plateNumber"
                      value={formData.plateNumber}
                      onChange={handleChange}
                      maxLength={20}
                      required
                    />
                    {formErrors.plateNumber && (
                      <span className="field-error">
                        {formErrors.plateNumber}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="vin">VIN</label>
                    <input
                      type="text"
                      id="vin"
                      name="vin"
                      value={formData.vin}
                      onChange={handleChange}
                      maxLength={50}
                    />
                    {formErrors.vin && (
                      <span className="field-error">{formErrors.vin}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="make">Make *</label>
                    <input
                      type="text"
                      id="make"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      maxLength={100}
                      required
                    />
                    {formErrors.make && (
                      <span className="field-error">{formErrors.make}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="model">Model *</label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      maxLength={100}
                      required
                    />
                    {formErrors.model && (
                      <span className="field-error">{formErrors.model}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="year">Year *</label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      min={1900}
                      max={2100}
                      required
                    />
                    {formErrors.year && (
                      <span className="field-error">{formErrors.year}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="color">Color</label>
                    <input
                      type="text"
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      maxLength={50}
                    />
                    {formErrors.color && (
                      <span className="field-error">{formErrors.color}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="fuelType">Fuel Type *</label>
                    <select
                      id="fuelType"
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      required
                    >
                      {FUEL_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                    {formErrors.fuelType && (
                      <span className="field-error">{formErrors.fuelType}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      {VEHICLE_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="odometerReading">
                      Odometer Reading (km)
                    </label>
                    <input
                      type="number"
                      id="odometerReading"
                      name="odometerReading"
                      value={formData.odometerReading}
                      onChange={handleChange}
                      min={0}
                    />
                    {formErrors.odometerReading && (
                      <span className="field-error">
                        {formErrors.odometerReading}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="fuelCapacityLiters">
                      Fuel Capacity (L)
                    </label>
                    <input
                      type="number"
                      id="fuelCapacityLiters"
                      name="fuelCapacityLiters"
                      value={formData.fuelCapacityLiters}
                      onChange={handleChange}
                      min={0}
                      step="0.1"
                    />
                    {formErrors.fuelCapacityLiters && (
                      <span className="field-error">
                        {formErrors.fuelCapacityLiters}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="fuelEfficiencyKmpl">
                      Fuel Efficiency (km/L)
                    </label>
                    <input
                      type="number"
                      id="fuelEfficiencyKmpl"
                      name="fuelEfficiencyKmpl"
                      value={formData.fuelEfficiencyKmpl}
                      onChange={handleChange}
                      min={0}
                      step="0.1"
                    />
                    {formErrors.fuelEfficiencyKmpl && (
                      <span className="field-error">
                        {formErrors.fuelEfficiencyKmpl}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="purchaseDate">Purchase Date</label>
                    <input
                      type="date"
                      id="purchaseDate"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="purchasePrice">Purchase Price</label>
                    <input
                      type="number"
                      id="purchasePrice"
                      name="purchasePrice"
                      value={formData.purchasePrice}
                      onChange={handleChange}
                      min={0}
                      step="0.01"
                    />
                    {formErrors.purchasePrice && (
                      <span className="field-error">
                        {formErrors.purchasePrice}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="insuranceExpiry">Insurance Expiry</label>
                    <input
                      type="date"
                      id="insuranceExpiry"
                      name="insuranceExpiry"
                      value={formData.insuranceExpiry}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="registrationExpiry">
                      Registration Expiry
                    </label>
                    <input
                      type="date"
                      id="registrationExpiry"
                      name="registrationExpiry"
                      value={formData.registrationExpiry}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-field full-width">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      maxLength={1000}
                      rows={3}
                    />
                    {formErrors.notes && (
                      <span className="field-error">{formErrors.notes}</span>
                    )}
                  </div>
                </div>

                {formErrors.submit && (
                  <div className="form-error">{formErrors.submit}</div>
                )}

                <div className="dialog-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Saving..."
                      : editingVehicle
                        ? "Update"
                        : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deletingVehicle && (
          <div
            className="dialog-overlay"
            onClick={() => setDeletingVehicle(null)}
          >
            <div
              className="dialog dialog--confirm"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Delete Vehicle</h2>
              <p>
                Are you sure you want to delete{" "}
                <strong>{deletingVehicle.plateNumber}</strong>? This action
                cannot be undone.
              </p>
              <div className="dialog-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setDeletingVehicle(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary-button danger"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
    </AppLayout>
  );
}

export default VehiclesPage;
