-- ============================================
-- Admin Policies Fix
-- Run this in Supabase SQL Editor to fix admin permissions
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins can create shops" ON shops;
DROP POLICY IF EXISTS "Admins can update shops" ON shops;
DROP POLICY IF EXISTS "Admins can view all shops" ON shops;
DROP POLICY IF EXISTS "Admins can create products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

-- Shops policies for admins
CREATE POLICY "Admins can view all shops" ON shops
  FOR SELECT TO authenticated
  USING (
    exists (
      select 1 from admin_users 
      where admin_users.id = auth.uid() and admin_users.is_active = true
    ) OR is_active = true
  );

CREATE POLICY "Admins can create shops" ON shops
  FOR INSERT TO authenticated
  WITH CHECK (
    exists (
      select 1 from admin_users 
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can update shops" ON shops
  FOR UPDATE TO authenticated
  USING (
    exists (
      select 1 from admin_users 
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

-- Products policies for admins  
CREATE POLICY "Admins can create products" ON products
  FOR INSERT TO authenticated
  WITH CHECK (
    exists (
      select 1 from admin_users 
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE TO authenticated
  USING (
    exists (
      select 1 from admin_users 
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE TO authenticated
  USING (
    exists (
      select 1 from admin_users 
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

-- Create a test admin user if not exists
-- Replace 'your-user-id' with your actual Supabase auth user ID
-- You can find this in Supabase Dashboard > Authentication > Users
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()) THEN
        INSERT INTO admin_users (id, role, is_active)
        VALUES (auth.uid(), 'super_admin', true)
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;