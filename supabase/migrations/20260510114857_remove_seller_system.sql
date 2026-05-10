/*
  # Remove seller system

  The platform is admin-only for product management. No separate seller role exists.

  1. Tables removed
    - `seller_bank_details` - seller payout bank info, no longer needed
    - `seller_profiles`     - seller business profiles, no longer needed

  2. Profiles table
    - Update any profiles with role = 'seller' to role = 'customer'

  3. Products table
    - seller_id, seller_name, seller_avatar, seller_rating columns remain
      (admin uses them to store store branding info — no structural change needed)

  4. Notes
    - RLS policies on dropped tables are automatically removed with the tables
*/

-- Reassign any lingering seller-role profiles to customer
UPDATE profiles SET role = 'customer' WHERE role = 'seller';

-- Drop seller tables (cascade drops their RLS policies and indexes)
DROP TABLE IF EXISTS seller_bank_details CASCADE;
DROP TABLE IF EXISTS seller_profiles CASCADE;
