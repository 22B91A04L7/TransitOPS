-- TransitOps vehicles schema (matches the shared Supabase project)
-- Skip this file if the vehicles table already exists in your project.

CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plate_number TEXT NOT NULL UNIQUE,
    vin TEXT,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
    color TEXT,
    fuel_type TEXT NOT NULL
        CHECK (fuel_type IN ('diesel', 'electric', 'petrol', 'cng', 'hybrid', 'lpg')),
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'maintenance', 'retired')),
    odometer_reading INTEGER NOT NULL DEFAULT 0 CHECK (odometer_reading >= 0),
    fuel_capacity_liters NUMERIC,
    fuel_efficiency_kmpl NUMERIC,
    purchase_date DATE,
    purchase_price NUMERIC,
    insurance_expiry DATE,
    registration_expiry DATE,
    notes TEXT,
    created_by UUID REFERENCES public.users (id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles (status);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate_number ON public.vehicles (plate_number);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY vehicles_service_role_all ON public.vehicles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
