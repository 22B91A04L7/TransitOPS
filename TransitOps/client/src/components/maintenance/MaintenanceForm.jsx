import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Grid,
} from '@mui/material'

const TYPE_OPTIONS = [
  { value: 'preventive', label: 'Preventive' },
  { value: 'corrective', label: 'Corrective' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'emergency', label: 'Emergency' },
]

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

export const MaintenanceForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading,
  error,
}) => {
  const [formData, setFormData] = useState({
    vehicle_id: '',
    title: '',
    type: 'preventive',
    priority: 'medium',
    scheduled_date: '',
    description: '',
    odometer_reading: '',
    cost: '',
  })

  const initializedRef = useRef(false)

  useEffect(() => {
    if (initialData && !initializedRef.current) {
      initializedRef.current = true
      setFormData({
        vehicle_id: initialData.vehicle_id || '',
        title: initialData.title || '',
        type: initialData.type || 'preventive',
        priority: initialData.priority || 'medium',
        scheduled_date: initialData.scheduled_date
          ? new Date(initialData.scheduled_date).toISOString().split('T')[0]
          : '',
        description: initialData.description || '',
        odometer_reading: initialData.odometer_reading || '',
        cost: initialData.cost || '',
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      scheduled_date: formData.scheduled_date
        ? new Date(formData.scheduled_date).toISOString()
        : '',
    }
    onSubmit(submitData)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Vehicle ID"
            name="vehicle_id"
            value={formData.vehicle_id}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={loading}>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Type"
            >
              {TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={loading}>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              label="Priority"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Scheduled Date"
            name="scheduled_date"
            type="date"
            value={formData.scheduled_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Odometer Reading"
            name="odometer_reading"
            type="number"
            value={formData.odometer_reading}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cost"
            name="cost"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sx={{ pt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}