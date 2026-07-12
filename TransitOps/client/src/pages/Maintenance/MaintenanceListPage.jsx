import { useEffect } from 'react'
import { Box, CircularProgress, Alert, Typography } from '@mui/material'
import { useMaintenance } from '../../hooks/useMaintenance'
import { MaintenanceTable } from '../../components/maintenance/MaintenanceTable'

export const MaintenanceListPage = () => {
  const { maintenance, loading, error, fetchMaintenance } = useMaintenance()

  useEffect(() => {
    fetchMaintenance()
  }, [fetchMaintenance])

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
      <MaintenanceTable maintenance={maintenance} />
    </Box>
  )
}