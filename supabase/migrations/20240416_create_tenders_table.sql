
-- Create an enum for tender categories
CREATE TYPE public.tender_category AS ENUM ('construction', 'services', 'goods', 'consulting', 'other');

-- Create an enum for tender statuses
CREATE TYPE public.tender_status AS ENUM ('draft', 'published', 'under_evaluation', 'awarded', 'closed');

-- Create the tenders table
CREATE TABLE public.tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category tender_category NOT NULL,
  budget INTEGER NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status tender_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on tenders
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  current_role TEXT;
BEGIN
  SELECT role INTO current_role FROM public.profiles 
  WHERE id = auth.uid();
  
  RETURN current_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin users can read/write all tenders
CREATE POLICY "Admins can do everything with tenders" ON public.tenders
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- All authenticated users can read published tenders
CREATE POLICY "All authenticated users can read published tenders" ON public.tenders
  FOR SELECT
  USING (status = 'published');
