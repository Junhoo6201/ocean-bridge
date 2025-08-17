-- ============================================
-- Temporarily Disable RLS for Testing
-- Run this in Supabase SQL Editor to allow product creation
-- WARNING: This disables security - use only for testing!
-- ============================================

-- Disable RLS temporarily for testing
ALTER TABLE shops DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- OR, if you want to keep RLS enabled but allow all operations:

-- Allow anyone to do anything with shops (TEMPORARY - REMOVE IN PRODUCTION!)
DROP POLICY IF EXISTS "Temporary allow all for shops" ON shops;
CREATE POLICY "Temporary allow all for shops" ON shops
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Allow anyone to do anything with products (TEMPORARY - REMOVE IN PRODUCTION!)  
DROP POLICY IF EXISTS "Temporary allow all for products" ON products;
CREATE POLICY "Temporary allow all for products" ON products
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- To re-enable proper security later:
-- ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;