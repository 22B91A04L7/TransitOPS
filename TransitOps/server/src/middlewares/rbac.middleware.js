import { sendFailure } from '../utils/apiResponse.js'

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.roleName?.trim().toLowerCase()

        if (!userRole) {
            return sendFailure(res, 'Forbidden', 403)
        }

        const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase())

        if (!normalizedAllowedRoles.includes(userRole)) {
            return sendFailure(res, 'Forbidden', 403)
        }

        next()
    }
}
