import api from './api.js'

export const dashboardApi = {
    getSummary: () => api.get('/v1/dashboard'),
}
