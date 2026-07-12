BEGIN;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ROLES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE CHECK (name IN ('admin', 'manager', 'driver', 'viewer')),
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);

-- ============================================================================
-- 2. USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL UNIQUE,
    full_name text,
    role_id uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    phone text,
    avatar_url text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- ============================================================================
-- 3. VEHICLES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plate_number text NOT NULL UNIQUE,
    vin text UNIQUE,
    make text NOT NULL,
    model text NOT NULL,
    year integer NOT NULL CHECK (year >= 1990 AND year <= EXTRACT(YEAR FROM now()) + 1),
    color text,
    fuel_type text NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg')),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired', 'sold')),
    odometer_reading integer NOT NULL DEFAULT 0 CHECK (odometer_reading >= 0),
    fuel_capacity_liters numeric(6,2),
    fuel_efficiency_kmpl numeric(5,2),
    purchase_date date,
    purchase_price numeric(12,2),
    insurance_expiry date,
    registration_expiry date,
    notes text,
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vehicles_plate_number ON vehicles(plate_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_by ON vehicles(created_by);

-- ============================================================================
-- 4. DRIVERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS drivers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    employee_id text UNIQUE,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text,
    email text,
    license_number text NOT NULL UNIQUE,
    license_class text NOT NULL,
    license_expiry date NOT NULL,
    license_issuing_country text DEFAULT 'India',
    date_of_birth date,
    hire_date date,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'terminated')),
    emergency_contact_name text,
    emergency_contact_phone text,
    address text,
    notes text,
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_drivers_user_id ON drivers(user_id);
CREATE INDEX IF NOT EXISTS idx_drivers_license_number ON drivers(license_number);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_employee_id ON drivers(employee_id);
CREATE INDEX IF NOT EXISTS idx_drivers_license_expiry ON drivers(license_expiry);

-- ============================================================================
-- 5. TRIPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS trips (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    driver_id uuid NOT NULL REFERENCES drivers(id) ON DELETE RESTRICT,
    start_location text NOT NULL,
    end_location text NOT NULL,
    start_latitude numeric(10,7),
    start_longitude numeric(10,7),
    end_latitude numeric(10,7),
    end_longitude numeric(10,7),
    distance_km numeric(8,2) CHECK (distance_km >= 0),
    start_odometer integer NOT NULL CHECK (start_odometer >= 0),
    end_odometer integer CHECK (end_odometer >= start_odometer),
    started_at timestamptz NOT NULL,
    ended_at timestamptz,
    status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    purpose text,
    notes text,
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    CONSTRAINT chk_trip_times CHECK (ended_at IS NULL OR ended_at >= started_at)
);

CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_driver_id ON trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_started_at ON trips(started_at);
CREATE INDEX IF NOT EXISTS idx_trips_created_by ON trips(created_by);

-- ============================================================================
-- 6. MAINTENANCE_LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    type text NOT NULL CHECK (type IN ('preventive', 'corrective', 'inspection', 'emergency')),
    status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    title text NOT NULL,
    description text,
    scheduled_date timestamptz NOT NULL,
    started_at timestamptz,
    completed_at timestamptz,
    odometer_reading integer CHECK (odometer_reading >= 0),
    cost numeric(12,2) DEFAULT 0 CHECK (cost >= 0),
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    CONSTRAINT chk_maintenance_completed_after_started CHECK (
        completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at
    )
);

CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle_id ON maintenance_logs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_logs(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_type ON maintenance_logs(type);
CREATE INDEX IF NOT EXISTS idx_maintenance_priority ON maintenance_logs(priority);
CREATE INDEX IF NOT EXISTS idx_maintenance_scheduled_date ON maintenance_logs(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_created_by ON maintenance_logs(created_by);

-- ============================================================================
-- 7. FUEL_LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS fuel_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    trip_id uuid REFERENCES trips(id) ON DELETE SET NULL,
    driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
    fuel_type text NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'cng', 'lpg')),
    quantity_liters numeric(8,2) NOT NULL CHECK (quantity_liters > 0),
    price_per_liter numeric(8,2) NOT NULL CHECK (price_per_liter > 0),
    total_cost numeric(12,2) GENERATED ALWAYS AS (quantity_liters * price_per_liter) STORED,
    odometer_reading integer NOT NULL CHECK (odometer_reading >= 0),
    fuel_station_name text,
    fuel_station_location text,
    notes text,
    logged_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fuel_logs_vehicle_id ON fuel_logs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fuel_logs_trip_id ON fuel_logs(trip_id);
CREATE INDEX IF NOT EXISTS idx_fuel_logs_driver_id ON fuel_logs(driver_id);
CREATE INDEX IF NOT EXISTS idx_fuel_logs_logged_at ON fuel_logs(logged_at);
CREATE INDEX IF NOT EXISTS idx_fuel_logs_created_by ON fuel_logs(created_by);

-- ============================================================================
-- 8. EXPENSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    trip_id uuid REFERENCES trips(id) ON DELETE SET NULL,
    driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
    category text NOT NULL CHECK (category IN (
        'toll', 'parking', 'repair', 'maintenance', 'insurance',
        'registration', 'permit', 'washing', 'accessories', 'other'
    )),
    amount numeric(12,2) NOT NULL CHECK (amount >= 0),
    currency text NOT NULL DEFAULT 'INR' CHECK (currency IN ('INR', 'USD', 'EUR')),
    expense_date date NOT NULL DEFAULT CURRENT_DATE,
    vendor_name text,
    description text,
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expenses_vehicle_id ON expenses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_driver_id ON expenses(driver_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_created_by ON expenses(created_by);

-- ============================================================================
-- DEFAULT ROLES SEED DATA
-- ============================================================================
INSERT INTO roles (name, description) VALUES
    ('admin', 'Full system access including user management'),
    ('manager', 'Fleet operations management, reports, analytics'),
    ('driver', 'Trip logging, fuel logs, expense submission'),
    ('viewer', 'Read-only access to dashboards and reports')
ON CONFLICT (name) DO NOTHING;

COMMIT;