/*
  # Fix is_admin() and get_my_role() to truly bypass RLS

  ## Problem
  SECURITY DEFINER functions in Supabase still respect RLS unless
  explicitly disabled with SET row_security = off inside the function.

  ## Fix
  Recreate both functions with SET row_security = off so they can
  always read from profiles regardless of RLS policies.
*/

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
DECLARE
  v_role text;
BEGIN
  SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid();
  RETURN v_role;
END;
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
DECLARE
  v_role text;
BEGIN
  SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid();
  RETURN v_role = 'admin';
END;
$$;
