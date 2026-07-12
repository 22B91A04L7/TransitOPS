import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material'

export const MaintenanceTable = ({ maintenance }) => {
  if (!maintenance || maintenance.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No maintenance records found.</Typography>
      </Paper>
    )
  }

  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Vehicle ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Scheduled Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {maintenance.map((record) => (
            <TableRow key={record.id} hover>
              <TableCell>{record.title}</TableCell>
              <TableCell>{record.vehicle_id}</TableCell>
              <TableCell>{record.type}</TableCell>
              <TableCell>{record.priority}</TableCell>
              <TableCell>{record.status}</TableCell>
              <TableCell>{record.scheduled_date ? new Date(record.scheduled_date).toLocaleDateString() : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}