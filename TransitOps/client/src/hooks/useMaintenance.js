import { useState, useCallback } from 'react'
import {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from '../services/maintenance.api'

export const useMaintenance = () => {
  const [maintenance, setMaintenance] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMaintenance = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllMaintenance()
      setMaintenance(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch maintenance records')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMaintenanceById = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMaintenanceById(id)
      return data
    } catch (err) {
      setError(err.message || 'Failed to fetch maintenance record')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const handleCreateMaintenance = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      const newRecord = await createMaintenance(data)
      setMaintenance((prev) => [...prev, newRecord])
      return newRecord
    } catch (err) {
      setError(err.message || 'Failed to create maintenance record')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const handleUpdateMaintenance = useCallback(async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      const updatedRecord = await updateMaintenance(id, data)
      setMaintenance((prev) =>
        prev.map((record) => (record.id === id ? updatedRecord : record))
      )
      return updatedRecord
    } catch (err) {
      setError(err.message || 'Failed to update maintenance record')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDeleteMaintenance = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      await deleteMaintenance(id)
      setMaintenance((prev) => prev.filter((record) => record.id !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete maintenance record')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    maintenance,
    loading,
    error,
    fetchMaintenance,
    fetchMaintenanceById,
    createMaintenance: handleCreateMaintenance,
    updateMaintenance: handleUpdateMaintenance,
    deleteMaintenance: handleDeleteMaintenance,
  }
}