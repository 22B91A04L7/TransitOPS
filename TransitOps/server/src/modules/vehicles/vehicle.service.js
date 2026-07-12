import { VEHICLE_STATUSES } from '../../constants/vehicleStatus.js'
import { supabaseAdmin } from '../../config/supabase.js'

const mapVehicle = (row) => ({
    id: row.id,
    plateNumber: row.plate_number,
    vin: row.vin,
    make: row.make,
    model: row.model,
    year: row.year,
    color: row.color,
    fuelType: row.fuel_type,
    status: row.status,
    odometerReading: row.odometer_reading,
    fuelCapacityLiters: row.fuel_capacity_liters,
    fuelEfficiencyKmpl: row.fuel_efficiency_kmpl,
    purchaseDate: row.purchase_date,
    purchasePrice: row.purchase_price,
    insuranceExpiry: row.insurance_expiry,
    registrationExpiry: row.registration_expiry,
    notes: row.notes,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
})

const mapVehicleInput = (input) => {
    const payload = {}

    if (input.plateNumber !== undefined) payload.plate_number = input.plateNumber.trim()
    if (input.vin !== undefined) payload.vin = input.vin === null ? null : input.vin.trim()
    if (input.make !== undefined) payload.make = input.make.trim()
    if (input.model !== undefined) payload.model = input.model.trim()
    if (input.year !== undefined) payload.year = input.year
    if (input.color !== undefined) payload.color = input.color === null ? null : input.color.trim()
    if (input.fuelType !== undefined) payload.fuel_type = input.fuelType
    if (input.status !== undefined) payload.status = input.status
    if (input.odometerReading !== undefined) payload.odometer_reading = input.odometerReading
    if (input.fuelCapacityLiters !== undefined) payload.fuel_capacity_liters = input.fuelCapacityLiters
    if (input.fuelEfficiencyKmpl !== undefined) payload.fuel_efficiency_kmpl = input.fuelEfficiencyKmpl
    if (input.purchaseDate !== undefined) payload.purchase_date = input.purchaseDate
    if (input.purchasePrice !== undefined) payload.purchase_price = input.purchasePrice
    if (input.insuranceExpiry !== undefined) payload.insurance_expiry = input.insuranceExpiry
    if (input.registrationExpiry !== undefined) payload.registration_expiry = input.registrationExpiry
    if (input.notes !== undefined) payload.notes = input.notes === null ? null : input.notes.trim()

    return payload
}

const handleDatabaseError = (error) => {
    if (error?.code === '23505') {
        const conflict = new Error('A vehicle with this plate number already exists')
        conflict.statusCode = 409
        throw conflict
    }

    if (error?.code === '23514') {
        const validationError = new Error(error.message || 'Invalid vehicle data')
        validationError.statusCode = 400
        throw validationError
    }

    throw new Error(error?.message || 'Database error')
}

export const listVehicles = async () => {
    const { data, error } = await supabaseAdmin
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) handleDatabaseError(error)

    return (data || []).map(mapVehicle)
}

export const getVehicleById = async (id) => {
    const { data, error } = await supabaseAdmin
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (error) handleDatabaseError(error)

    return data ? mapVehicle(data) : null
}

export const createVehicle = async (input, createdBy) => {
    const payload = {
        ...mapVehicleInput(input),
        status: input.status || VEHICLE_STATUSES.ACTIVE,
        odometer_reading: input.odometerReading ?? 0,
        created_by: createdBy,
    }

    const { data, error } = await supabaseAdmin
        .from('vehicles')
        .insert(payload)
        .select('*')
        .single()

    if (error) handleDatabaseError(error)

    return mapVehicle(data)
}

export const updateVehicle = async (id, input) => {
    const payload = mapVehicleInput(input)

    if (Object.keys(payload).length === 0) {
        const error = new Error('At least one field is required to update a vehicle')
        error.statusCode = 400
        throw error
    }

    const { data, error } = await supabaseAdmin
        .from('vehicles')
        .update(payload)
        .eq('id', id)
        .select('*')
        .maybeSingle()

    if (error) handleDatabaseError(error)

    return data ? mapVehicle(data) : null
}

export const deleteVehicle = async (id) => {
    const { data, error } = await supabaseAdmin
        .from('vehicles')
        .delete()
        .eq('id', id)
        .select('id')
        .maybeSingle()

    if (error) handleDatabaseError(error)

    return Boolean(data)
}
