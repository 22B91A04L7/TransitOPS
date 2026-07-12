import express from 'express'
import {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
} from '../controllers/maintenance.controller.js'
import { validateBody, validateParams } from '../middleware/validation.middleware.js'
import { createMaintenanceSchema, updateMaintenanceSchema, maintenanceIdParamSchema } from '../validators/maintenance.validators.js'

const router = express.Router()

router.get('/', getAllMaintenance)

router.get('/:id', validateParams(maintenanceIdParamSchema), getMaintenanceById)

router.post('/', validateBody(createMaintenanceSchema), createMaintenance)

router.patch('/:id', validateParams(maintenanceIdParamSchema), validateBody(updateMaintenanceSchema), updateMaintenance)

router.delete('/:id', validateParams(maintenanceIdParamSchema), deleteMaintenance)

export default router