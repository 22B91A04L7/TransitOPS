import { Router } from 'express'
import { sendSuccess } from '../utils/apiResponse.js'

const healthRouter = Router()

healthRouter.get('/health', (req, res) => {
    return sendSuccess(res, {
        service: 'TransitOps API',
        timestamp: new Date().toISOString(),
    })
})

export default healthRouter
