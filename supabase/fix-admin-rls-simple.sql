-- 임시 해결책: admin_users 테이블 RLS 비활성화
-- 개발 환경에서만 사용! 프로덕션에서는 적절한 RLS 정책 필요

-- RLS 비활성화 (임시)
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- 또는 더 안전한 옵션: 모든 인증된 사용자가 읽기 가능
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- 
-- DROP POLICY IF EXISTS "Anyone authenticated can read admin_users" ON admin_users;
-- CREATE POLICY "Anyone authenticated can read admin_users" ON admin_users
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- 확인
SELECT 
  relname as table_name,
  relrowsecurity as rls_enabled
FROM pg_class
WHERE relname = 'admin_users';