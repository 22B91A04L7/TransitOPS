import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import healthRouter from './routes/health.routes.js'
import maintenanceRouter from './routes/maintenance.routes.js'
import { sendFailure } from './utils/apiResponse.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/v1', healthRouter)
app.use('/api/v1/maintenance', maintenanceRouter)

app.use((req, res) => {
    return sendFailure(res, 'Route not found', 404)
})

export default app
