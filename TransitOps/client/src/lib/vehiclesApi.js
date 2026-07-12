import api from './api.js'

export const vehiclesApi = {
    list: () => api.get('/v1/vehicles'),
    get: (id) => api.get(`/v1/vehicles/${id}`),
    create: (data) => api.post('/v1/vehicles', data),
    update: (id, data) => api.patch(`/v1/vehicles/${id}`, data),
    delete: (id) => api.delete(`/v1/vehicles/${id}`),
}