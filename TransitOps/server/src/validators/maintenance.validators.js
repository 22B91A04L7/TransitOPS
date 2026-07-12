import { z } from 'zod'

export const createMaintenanceSchema = z.object({
  vehicle_id: z.string().uuid('Invalid vehicle ID'),
  type: z.enum(['preventive', 'corrective', 'inspection', 'emergency']),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).default('scheduled'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  scheduled_date: z.string().datetime('Invalid scheduled date (ISO 8601)'),
  started_at: z.string().datetime('Invalid start date (ISO 8601)').optional().nullable(),
  completed_at: z.string().datetime('Invalid completion date (ISO 8601)').optional().nullable(),
  odometer_reading: z.number().int().min(0, 'Odometer must be non-negative').optional().nullable(),
  cost: z.number().min(0, 'Cost must be non-negative').default(0),
})

export const updateMaintenanceSchema = createMaintenanceSchema.partial().extend({
  id: z.string().uuid('Invalid maintenance ID'),
}).omit({ vehicle_id: true })

export const maintenanceIdParamSchema = z.object({
  id: z.string().uuid('Invalid maintenance ID'),
})

export const validate = (schema) => (data) => {
  const result = schema.safeParse(data)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    const messages = Object.entries(errors).flatMap(([field, msgs]) =>
      msgs.map((msg) => `${field}: ${msg}`)
    )
    const error = new Error('Validation failed')
    error.name = 'ZodError'
    error.errors = messages
    throw error
  }
  return result.data
}
