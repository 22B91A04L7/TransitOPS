import { env } from '../config/env.js'
import { sendFailure } from '../utils/apiResponse.js'
import { verifyAccessToken } from '../utils/jwt.js'

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || ''
    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer' || !token) {
        return sendFailure(res, 'Unauthorized', 401)
    }

    try {
        const decoded = verifyAccessToken(token)
        req.user = decoded
        next()
    } catch (error) {
        return sendFailure(res, 'Invalid or expired token', 401)
    }
}