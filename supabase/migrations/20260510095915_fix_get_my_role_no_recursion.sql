/*
  # Fix get_my_role() infinite recursion and product delete

  ## Problem
  - get_my_role() queries profiles table
  - profiles has an RLS policy "Admins can view all profiles" that calls get_my_role()
  - This creates infinite recursion → get_my_role() returns NULL → admin delete blocked

  ## Fix
  1. Rewrite get_my_role() as SECURITY DEFINER with search_path='' so it
     executes as the function owner (bypassing RLS on profiles entirely)
  2. Replace the recursive profiles admin policy with a direct auth.uid() check
     against a security-definer helper that cannot recurse
*/

-- Step 1: Recreate get_my_role() so it bypasses RLS (SECURITY DEFINER + explicit schema)
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Step 2: Drop the recursive admin profiles policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Step 3: Create a separate security-definer function to check admin without touching RLS
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Step 4: Recreate the admin profiles policy using is_admin() 
-- (is_admin() is also SECURITY DEFINER so it won't trigger RLS on profiles)
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR is_admin());
