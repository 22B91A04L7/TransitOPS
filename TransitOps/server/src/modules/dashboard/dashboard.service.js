import { supabaseAdmin } from '../../config/supabase.js'

export const getDashboardSummary = async () => {
    // Get total vehicles count
    const { count: totalVehicles, error: vehiclesError } = await supabaseAdmin
        .from('vehicles')
        .select('*', { count: 'exact', head: true })

    if (vehiclesError) {
        throw new Error(vehiclesError.message || 'Failed to fetch vehicle count')
    }

    // Get vehicles by status
    const { data: statusData, error: statusError } = await supabaseAdmin
        .from('vehicles')
        .select('status')

    if (statusError) {
        throw new Error(statusError.message || 'Failed to fetch vehicle statuses')
    }

    const statusCounts = {
        active: 0,
        maintenance: 0,
        retired: 0,
    }

    if (statusData) {
        statusData.forEach((vehicle) => {
            if (statusCounts.hasOwnProperty(vehicle.status)) {
                statusCounts[vehicle.status]++
            }
        })
    }

    // Get vehicles by fuel type
    const { data: fuelData, error: fuelError } = await supabaseAdmin
        .from('vehicles')
        .select('fuel_type')

    if (fuelError) {
        throw new Error(fuelError.message || 'Failed to fetch fuel types')
    }

    const fuelTypeCounts = {}
    if (fuelData) {
        fuelData.forEach((vehicle) => {
            fuelTypeCounts[vehicle.fuel_type] = (fuelTypeCounts[vehicle.fuel_type] || 0) + 1
        })
    }

    return {
        totalVehicles: totalVehicles || 0,
        statusCounts,
        fuelTypeCounts,
    }
}