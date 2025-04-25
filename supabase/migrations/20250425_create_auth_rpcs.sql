
-- Create RPC functions for secure supplier registration

-- Function to create a supplier securely
CREATE OR REPLACE FUNCTION public.create_supplier(
  supplier_id UUID,
  company_type_id_input INTEGER,
  company_name_input TEXT,
  location_input TEXT,
  country_input TEXT,
  phone_number_input TEXT,
  kra_pin_input TEXT,
  physical_address_input TEXT,
  website_url_input TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.suppliers (
    id,
    company_type_id,
    company_name,
    location,
    country,
    phone_number,
    kra_pin,
    physical_address,
    website_url
  ) VALUES (
    supplier_id,
    company_type_id_input,
    company_name_input,
    location_input,
    country_input,
    phone_number_input,
    kra_pin_input,
    physical_address_input,
    website_url_input
  );
END;
$$;

-- Function to add supplier category securely
CREATE OR REPLACE FUNCTION public.add_supplier_category(
  supplier_id_input UUID,
  category_id_input INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.supplier_categories (supplier_id, category_id)
  VALUES (supplier_id_input, category_id_input)
  ON CONFLICT (supplier_id, category_id) DO NOTHING;
END;
$$;

-- Function to add supplier location securely
CREATE OR REPLACE FUNCTION public.add_supplier_location(
  supplier_id_input UUID,
  location_id_input INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.supplier_locations (supplier_id, location_id)
  VALUES (supplier_id_input, location_id_input)
  ON CONFLICT (supplier_id, location_id) DO NOTHING;
END;
$$;

-- Add composite primary keys to junction tables if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'supplier_categories_pkey'
  ) THEN
    ALTER TABLE public.supplier_categories 
    ADD PRIMARY KEY (supplier_id, category_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'supplier_locations_pkey'
  ) THEN
    ALTER TABLE public.supplier_locations 
    ADD PRIMARY KEY (supplier_id, location_id);
  END IF;
END $$;
