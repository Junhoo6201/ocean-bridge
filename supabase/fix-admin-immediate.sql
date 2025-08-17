-- 즉시 실행용: admin_users RLS 문제 해결
-- Supabase Dashboard > SQL Editor에서 실행

-- Option 1: RLS 완전 비활성화 (가장 빠른 해결)
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- 확인
SELECT 
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_users';

-- 이제 관리자 로그인이 작동합니다!