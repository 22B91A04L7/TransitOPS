import { maintenanceService } from '../services/maintenance.service.js'
import { sendSuccess, sendFailure } from '../utils/apiResponse.js'

export const createMaintenance = async (req, res) => {
  try {
    const userId = req.user?.id
    const record = await maintenanceService.createMaintenance(req.validated, userId)
    return sendSuccess(res, record, 201)
  } catch (error) {
    return sendFailure(res, error.message, 400)
  }
}

export const getAllMaintenance = async (req, res) => {
  try {
    const records = await maintenanceService.getAllMaintenance()
    return sendSuccess(res, records)
  } catch (error) {
    return sendFailure(res, error.message, 400)
  }
}

export const getMaintenanceById = async (req, res) => {
  try {
    const record = await maintenanceService.getMaintenanceById(req.validated.id)
    if (!record) {
      return sendFailure(res, 'Maintenance record not found', 404)
    }
    return sendSuccess(res, record)
  } catch (error) {
    return sendFailure(res, error.message, 400)
  }
}

export const updateMaintenance = async (req, res) => {
  try {
    const userId = req.user?.id
    const { id, ...data } = req.validated
    const record = await maintenanceService.updateMaintenance(id, data, userId)
    if (!record) {
      return sendFailure(res, 'Maintenance record not found', 404)
    }
    return sendSuccess(res, record)
  } catch (error) {
    return sendFailure(res, error.message, 400)
  }
}

export const deleteMaintenance = async (req, res) => {
  try {
    await maintenanceService.deleteMaintenance(req.validated.id)
    return sendSuccess(res, null, 204)
  } catch (error) {
    return sendFailure(res, error.message, 400)
  }
}