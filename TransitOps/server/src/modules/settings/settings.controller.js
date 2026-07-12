import { sendFailure, sendSuccess } from '../../utils/apiResponse.js'
import { getProfile, updateProfile } from './settings.service.js'

export const getMyProfile = async (req, res, next) => {
    try {
        const profile = await getProfile(req.user.sub)
        if (!profile) return sendFailure(res, 'Profile not found', 404)
        return sendSuccess(res, { profile })
    } catch (error) {
        return next(error)
    }
}

export const updateMyProfile = async (req, res, next) => {
    try {
        const profile = await updateProfile(req.user.sub, req.body)
        if (!profile) return sendFailure(res, 'Profile not found', 404)
        return sendSuccess(res, { profile })
    } catch (error) {
        return next(error)
    }
}
