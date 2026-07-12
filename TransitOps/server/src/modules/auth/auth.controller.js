import { sendFailure, sendSuccess } from '../../utils/apiResponse.js'
import { signAccessToken } from '../../utils/jwt.js'
import { getUserById, loginUser } from './auth.service.js'

export const login = async (req, res, next) => {
    try {
        const user = await loginUser(req.body)

        if (!user) {
            return sendFailure(res, 'Invalid email or password', 401)
        }

        const token = signAccessToken({
            sub: user.id,
            email: user.email,
            roleName: user.roleName,
        })

        return sendSuccess(res, {
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                roleId: user.roleId,
                roleName: user.roleName,
            },
        })
    } catch (error) {
        return next(error)
    }
}

export const me = async (req, res, next) => {
    try {
        const user = await getUserById(req.user.sub)

        if (!user || !user.isActive) {
            return sendFailure(res, 'Account is unavailable', 403)
        }

        return sendSuccess(res, { user })
    } catch (error) {
        return next(error)
    }
}
