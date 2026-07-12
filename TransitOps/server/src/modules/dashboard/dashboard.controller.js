import { sendFailure, sendSuccess } from '../../utils/apiResponse.js'
import { getDashboardSummary } from './dashboard.service.js'

export const getDashboard = async (req, res, next) => {
    try {
        const summary = await getDashboardSummary()
        return sendSuccess(res, { summary })
    } catch (error) {
        return next(error)
    }
}