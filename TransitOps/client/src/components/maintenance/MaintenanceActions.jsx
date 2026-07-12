import { Button, Box } from '@mui/material'

export const MaintenanceActions = ({
  record,
  onEdit,
  onDelete,
  onStatusChange,
  loading,
}) => {
  const { status, id } = record

  const handleStart = () => {
    onStatusChange(id, 'in_progress')
  }

  const handleComplete = () => {
    onStatusChange(id, 'completed')
  }

  const showEditDelete = status !== 'completed'
  const showStart = status === 'scheduled'
  const showComplete = status === 'in_progress'

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {showEditDelete && (
        <Button
          variant="outlined"
          size="small"
          onClick={() => onEdit(record)}
          disabled={loading}
        >
          Edit
        </Button>
      )}
      {showEditDelete && (
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => onDelete(id)}
          disabled={loading}
        >
          Delete
        </Button>
      )}
      {showStart && (
        <Button
          variant="contained"
          size="small"
          onClick={handleStart}
          disabled={loading}
        >
          Start
        </Button>
      )}
      {showComplete && (
        <Button
          variant="contained"
          size="small"
          color="success"
          onClick={handleComplete}
          disabled={loading}
        >
          Complete
        </Button>
      )}
    </Box>
  )
}