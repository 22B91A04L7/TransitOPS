import api from './api.js'

export const settingsApi = {
    getProfile: () => api.get('/v1/settings/profile'),
    updateProfile: (data) => api.patch('/v1/settings/profile', data),
}
