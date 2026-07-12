import { Router } from 'express'
import { login, me } from './auth.controller.js'
import { loginValidation } from './auth.validation.js'
import { validateRequest } from '../../middlewares/validate.middleware.js'
import { authenticateJWT } from '../../middlewares/auth.middleware.js'

const router = Router()

router.post('/login', loginValidation, validateRequest, login)
router.get('/me', authenticateJWT, me)

export default router