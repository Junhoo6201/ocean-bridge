-- Fix admin_users RLS policies
-- 500 에러 해결을 위한 RLS 정책 수정

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Super admins manage admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can view own profile" ON admin_users;

-- 새로운 정책 추가

-- 1. 인증된 사용자는 자신의 admin 프로필을 조회 가능
CREATE POLICY "Users can check their own admin status" ON admin_users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- 2. Super admin은 모든 admin_users 관리 가능
CREATE POLICY "Super admins can manage all admin users" ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'super_admin'
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'super_admin'
      AND admin_users.is_active = true
    )
  );

-- 3. 인증된 사용자는 admin_users 테이블 존재 여부 확인 가능 (로그인 체크용)
CREATE POLICY "Authenticated users can check admin existence" ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'admin_users'
ORDER BY policyname;