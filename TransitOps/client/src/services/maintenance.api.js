import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getAllMaintenance = async () => {
  const response = await api.get('/maintenance')
  return response.data.data
}

export const getMaintenanceById = async (id) => {
  const response = await api.get(`/maintenance/${id}`)
  return response.data.data
}

export const createMaintenance = async (data) => {
  const response = await api.post('/maintenance', data)
  return response.data.data
}

export const updateMaintenance = async (id, data) => {
  const response = await api.patch(`/maintenance/${id}`, data)
  return response.data.data
}

export const deleteMaintenance = async (id) => {
  const response = await api.delete(`/maintenance/${id}`)
  return response.data.data
}
