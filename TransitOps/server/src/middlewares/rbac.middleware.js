import { sendFailure } from '../utils/apiResponse.js'

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.roleName

        if (!userRole) {
            return sendFailure(res, 'Forbidden', 403)
        }

        if (!allowedRoles.includes(userRole)) {
            return sendFailure(res, 'Forbidden', 403)
        }

        next()
    }
}