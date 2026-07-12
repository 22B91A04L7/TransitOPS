INSERT INTO public.vehicles (
    plate_number,
    make,
    model,
    year,
    fuel_type,
    status,
    odometer_reading,
    notes
)
VALUES
    ('TX-101', 'Nova', 'LFSe', 2022, 'electric', 'active', 12000, 'Ready for morning route'),
    ('TX-102', 'Nova', 'LFSe', 2021, 'electric', 'active', 28500, 'Assigned to Route 7'),
    ('TX-103', 'Gillig', 'BRT', 2020, 'diesel', 'maintenance', 40200, 'Brake inspection'),
    ('TX-201', 'Ford', 'Transit', 2019, 'petrol', 'active', 56000, 'Paratransit pool'),
    ('TX-104', 'Gillig', 'BRT', 2018, 'diesel', 'retired', 180000, 'Decommissioned')
ON CONFLICT (plate_number) DO NOTHING;
