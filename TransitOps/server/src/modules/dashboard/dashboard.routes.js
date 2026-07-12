import { Router } from 'express'
import { authenticateJWT } from '../../middlewares/auth.middleware.js'
import { getDashboard } from './dashboard.controller.js'

const router = Router()

router.get('/', authenticateJWT, getDashboard)

export default router
