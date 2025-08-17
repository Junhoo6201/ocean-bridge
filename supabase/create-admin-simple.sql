-- 간단한 관리자 생성 SQL
-- 1. 먼저 회원가입을 완료하세요
-- 2. 아래 이메일을 수정하고 실행하세요

-- 관리자로 만들 이메일 주소 (수정 필요!)
INSERT INTO admin_users (id, role, is_active)
SELECT id, 'super_admin', true
FROM auth.users 
WHERE email = 'admin@example.com' -- 여기에 가입한 이메일 입력
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'super_admin',
  is_active = true,
  updated_at = now();

-- 확인
SELECT 
  au.id,
  au.role,
  au.is_active,
  u.email,
  u.created_at
FROM admin_users au
JOIN auth.users u ON au.id = u.id
WHERE au.is_active = true;