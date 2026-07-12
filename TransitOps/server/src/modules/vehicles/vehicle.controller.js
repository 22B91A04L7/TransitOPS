import { sendFailure, sendSuccess } from '../../utils/apiResponse.js'
import {
    createVehicle as createVehicleService,
    deleteVehicle as deleteVehicleService,
    getVehicleById,
    listVehicles,
    updateVehicle as updateVehicleService,
} from './vehicle.service.js'

export const getVehicles = async (req, res, next) => {
    try {
        const vehicles = await listVehicles()
        return sendSuccess(res, { vehicles })
    } catch (error) {
        return next(error)
    }
}

export const getVehicle = async (req, res, next) => {
    try {
        const vehicle = await getVehicleById(req.params.id)

        if (!vehicle) {
            return sendFailure(res, 'Vehicle not found', 404)
        }

        return sendSuccess(res, { vehicle })
    } catch (error) {
        return next(error)
    }
}

export const createVehicle = async (req, res, next) => {
    try {
        const vehicle = await createVehicleService(req.body, req.user.sub)
        return sendSuccess(res, { vehicle }, 201)
    } catch (error) {
        return next(error)
    }
}

export const updateVehicle = async (req, res, next) => {
    try {
        const vehicle = await updateVehicleService(req.params.id, req.body)

        if (!vehicle) {
            return sendFailure(res, 'Vehicle not found', 404)
        }

        return sendSuccess(res, { vehicle })
    } catch (error) {
        return next(error)
    }
}

export const deleteVehicle = async (req, res, next) => {
    try {
        const deleted = await deleteVehicleService(req.params.id)

        if (!deleted) {
            return sendFailure(res, 'Vehicle not found', 404)
        }

        return sendSuccess(res, { message: 'Vehicle deleted' })
    } catch (error) {
        return next(error)
    }
}
