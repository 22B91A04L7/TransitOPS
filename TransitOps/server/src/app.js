import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import healthRouter from './routes/health.routes.js'
import { sendFailure } from './utils/apiResponse.js'
import authRoutes from './modules/auth/auth.routes.js'
import vehicleRoutes from './modules/vehicles/vehicle.routes.js'
import dashboardRoutes from './modules/dashboard/dashboard.routes.js'
import settingsRoutes from './modules/settings/settings.routes.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/v1', healthRouter)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/vehicles', vehicleRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/settings', settingsRoutes)

app.use((req, res) => {
    return sendFailure(res, 'Route not found', 404)
})

app.use((error, req, res, next) => {
    return sendFailure(res, error.message || 'Internal server error', error.statusCode || 500)
})


export default app
