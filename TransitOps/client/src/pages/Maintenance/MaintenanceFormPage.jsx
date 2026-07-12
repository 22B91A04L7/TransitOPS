import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Alert, Typography, Button } from '@mui/material'
import { useMaintenance } from '../../hooks/useMaintenance'
import { MaintenanceForm } from '../../components/maintenance/MaintenanceForm'

export const MaintenanceFormPage = () => {
  const { id } = useParams()
  const { createMaintenance, updateMaintenance, fetchMaintenanceById, loading: hookLoading } = useMaintenance()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [initialData, setInitialData] = useState(null)

  const initializedRef = useRef(false)

  useEffect(() => {
    if (id && !initializedRef.current) {
      initializedRef.current = true
      setIsEditing(true)
      const loadData = async () => {
        try {
          const data = await fetchMaintenanceById(id)
          setInitialData(data)
        } catch (err) {
          setError(err.message || 'Failed to load maintenance record')
        }
      }
      loadData()
    } else if (!id) {
      initializedRef.current = false
    }
  }, [id, fetchMaintenanceById])

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    try {
      if (isEditing && initialData?.id) {
        await updateMaintenance(initialData.id, formData)
      } else {
        await createMaintenance(formData)
      }
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to save maintenance record')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSuccess(false)
    setError(null)
  }

  const loading = hookLoading || submitting

  if (success) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Maintenance record {isEditing ? 'updated' : 'created'} successfully!
        </Alert>
        <Button variant="outlined" onClick={handleCancel}>
          Create Another
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom component="h1">
        {isEditing ? 'Edit Maintenance Record' : 'Create Maintenance Record'}
      </Typography>
      <MaintenanceForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        error={error}
      />
    </Box>
  )
}