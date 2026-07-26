-- Grant execute permissions on RLS helper functions to authenticated users and service_role
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO authenticated, service_role;
