/*
  # Fix profiles RLS — remove recursive admin policy

  The previous admin policy caused infinite recursion by querying profiles
  while reading from profiles. Replace all policies with simple non-recursive ones.
  Users can always read/update their own row. Role is stored in auth.jwt() app_metadata
  for admin checks to avoid recursion.
*/

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Simple: authenticated users can read their own profile row
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Simple: authenticated users can insert their own profile row
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Simple: authenticated users can update their own profile row
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
