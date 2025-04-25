
-- Fix RLS policy for tenders table by removing the function call and directly checking admin role
DROP POLICY IF EXISTS "Admins can do everything with tenders" ON public.tenders;

-- Create a new policy that properly checks admin role
CREATE POLICY "Admins can do everything with tenders" 
ON public.tenders
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Add policy for tenderers to see their own drafts
CREATE POLICY "Users can manage their own tenders" 
ON public.tenders
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);
