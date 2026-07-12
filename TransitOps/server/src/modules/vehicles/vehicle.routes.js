import { Router } from 'express'
import { ROLE_NAMES } from '../../constants/roles.js'
import { authenticateJWT } from '../../middlewares/auth.middleware.js'
import { authorizeRoles } from '../../middlewares/rbac.middleware.js'
import { validateRequest } from '../../middlewares/validate.middleware.js'
import {
    createVehicle,
    deleteVehicle,
    getVehicle,
    getVehicles,
    updateVehicle,
} from './vehicle.controller.js'
import {
    createVehicleValidation,
    updateVehicleValidation,
    vehicleIdValidation,
} from './vehicle.validation.js'

const router = Router()

const writeRoles = [
    ROLE_NAMES.ADMIN,
    ROLE_NAMES.FLEET_MANAGER,
    ROLE_NAMES.SAFETY_OFFICER,
]

router.get('/', authenticateJWT, getVehicles)
router.get('/:id', authenticateJWT, vehicleIdValidation, validateRequest, getVehicle)

router.post(
    '/',
    authenticateJWT,
    authorizeRoles(...writeRoles),
    createVehicleValidation,
    validateRequest,
    createVehicle,
)

router.patch(
    '/:id',
    authenticateJWT,
    authorizeRoles(...writeRoles),
    updateVehicleValidation,
    validateRequest,
    updateVehicle,
)

router.delete(
    '/:id',
    authenticateJWT,
    authorizeRoles(ROLE_NAMES.ADMIN, ROLE_NAMES.FLEET_MANAGER),
    vehicleIdValidation,
    validateRequest,
    deleteVehicle,
)

export default router
