import { validationResult } from 'express-validator'
import { sendFailure } from '../utils/apiResponse.js'

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return sendFailure(res, errors.array()[0].msg, 422)
    }

    next()
}