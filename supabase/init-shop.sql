-- ============================================
-- Initialize Default Shop
-- Run this ONCE in Supabase SQL Editor to create default shop
-- ============================================

-- First, temporarily allow shop creation
DROP POLICY IF EXISTS "Allow shop creation" ON shops;
CREATE POLICY "Allow shop creation" ON shops
  FOR INSERT 
  WITH CHECK (true);

-- Create default shop if it doesn't exist
INSERT INTO shops (
  name_ko,
  name_ja,
  description_ko,
  description_ja,
  email,
  phone,
  is_verified,
  is_active
) 
SELECT 
  '오션 브릿지',
  'Ocean Bridge',
  '이시가키 최고의 투어 전문 업체',
  '石垣島最高のツアー専門会社',
  'admin@oceanbridge.kr',
  '080-1234-5678',
  true,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM shops WHERE email = 'admin@oceanbridge.kr'
);

-- Allow products to be created (temporarily for testing)
DROP POLICY IF EXISTS "Allow product creation" ON products;
CREATE POLICY "Allow product creation" ON products
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow product updates" ON products;
CREATE POLICY "Allow product updates" ON products
  FOR UPDATE 
  USING (true);

DROP POLICY IF EXISTS "Allow product deletion" ON products;
CREATE POLICY "Allow product deletion" ON products
  FOR DELETE 
  USING (true);

-- Show the shop ID for reference
SELECT id, name_ko, email FROM shops WHERE email = 'admin@oceanbridge.kr';