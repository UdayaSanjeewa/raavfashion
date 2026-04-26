/*
  # Create security definer function for role lookup

  This function bypasses RLS to check the current user's role from the profiles table.
  Using SECURITY DEFINER means it runs as the function owner (postgres), not the calling user,
  so it can always read the profiles table regardless of RLS policies.

  This is used in RLS policies to avoid recursive/blocked subqueries.
*/

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;
