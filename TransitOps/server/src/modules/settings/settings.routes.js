import { Router } from 'express'
import { authenticateJWT } from '../../middlewares/auth.middleware.js'
import { validateRequest } from '../../middlewares/validate.middleware.js'
import { getMyProfile, updateMyProfile } from './settings.controller.js'
import { updateProfileValidation } from './settings.validation.js'

const router = Router()

router.get('/profile', authenticateJWT, getMyProfile)
router.patch('/profile', authenticateJWT, updateProfileValidation, validateRequest, updateMyProfile)

export default router
