CREATE TABLE IF NOT EXISTS public.site_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    stack_trace TEXT,
    url TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_errors ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a log (anon or authenticated)
CREATE POLICY "Anyone can insert logs"
ON public.site_errors
FOR INSERT
TO public
WITH CHECK (true);

-- Only admins can read logs
CREATE POLICY "Admins can view logs"
ON public.site_errors
FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
));

-- Only admins can delete logs (for the cleanup)
CREATE POLICY "Admins can delete logs"
ON public.site_errors
FOR DELETE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
));

-- Function to auto-cleanup logs older than 30 days
CREATE OR REPLACE FUNCTION public.cleanup_site_errors()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow admins to run this
  IF EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
  ) THEN
    DELETE FROM public.site_errors WHERE created_at < NOW() - INTERVAL '30 days';
  END IF;
END;
$$;
