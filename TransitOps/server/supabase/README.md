# Supabase schema

TransitOps uses your friend's existing Supabase project. Express authenticates users and enforces RBAC; the server uses the **service role key** for database operations.

## Existing tables

- `public.roles` — `id`, `name`, `description`
- `public.users` — `id`, `email`, `full_name`, `role_id`, `is_active`
- `public.vehicles` — fleet records (already created in Supabase)

## Vehicle fields

| DB column | API field | Notes |
|-----------|-----------|-------|
| `plate_number` | `plateNumber` | Required, unique |
| `make` | `make` | Required |
| `model` | `model` | Required |
| `year` | `year` | Required |
| `fuel_type` | `fuelType` | `diesel`, `electric`, `petrol`, `cng`, `hybrid`, `lpg` |
| `status` | `status` | `active`, `maintenance`, `retired` |
| `odometer_reading` | `odometerReading` | Defaults to `0` |

## Environment

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Optional seed data

Run `migrations/002_seed_vehicles.sql` in the Supabase SQL editor if the vehicles table is empty.
