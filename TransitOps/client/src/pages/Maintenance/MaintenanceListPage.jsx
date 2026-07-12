import { useEffect } from 'react'
import { Box, CircularProgress, Alert, Typography } from '@mui/material'
import { useMaintenance } from '../../hooks/useMaintenance'
import { MaintenanceTable } from '../../components/maintenance/MaintenanceTable'

export const MaintenanceListPage = () => {
  const { maintenance, loading, error, fetchMaintenance, updateMaintenance, deleteMaintenance } = useMaintenance()

  useEffect(() => {
    fetchMaintenance()
  }, [fetchMaintenance])

  const handleEdit = (record) => {
    // Edit handler - can be extended for navigation or modal
    console.log('Edit record:', record)
  }

  const handleDelete = async (id) => {
    try {
      await deleteMaintenance(id)
    } catch {
      // Error handled by hook
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateMaintenance(id, { status })
    } catch {
      // Error handled by hook
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Maintenance Records
      </Typography>
      <MaintenanceTable
        maintenance={maintenance}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        loading={loading}
      />
    </Box>
  )
}
