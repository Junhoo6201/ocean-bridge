-- Create Admin User Script
-- 먼저 Supabase Dashboard에서 회원가입을 통해 사용자를 생성한 후 이 스크립트를 실행하세요

-- 1. 먼저 일반 회원가입으로 계정을 만드세요:
-- Email: admin@ishigaki-connect.com (원하는 이메일)
-- Password: 강력한 비밀번호

-- 2. 그 다음 이 스크립트를 실행하여 관리자 권한을 부여합니다
-- Supabase Dashboard > SQL Editor에서 실행

-- 관리자로 만들 사용자의 이메일을 여기에 입력하세요
DO $$
DECLARE
  admin_email text := 'admin@ishigaki-connect.com'; -- 여기에 관리자 이메일 입력
  user_id uuid;
BEGIN
  -- auth.users 테이블에서 사용자 ID 찾기
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = admin_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION '사용자를 찾을 수 없습니다. 먼저 회원가입을 완료하세요.';
  END IF;
  
  -- admin_users 테이블에 관리자 추가
  INSERT INTO public.admin_users (id, role, is_active)
  VALUES (
    user_id,
    'super_admin', -- super_admin, admin, manager 중 선택
    true
  )
  ON CONFLICT (id) 
  DO UPDATE SET 
    role = 'super_admin',
    is_active = true,
    updated_at = now();
  
  RAISE NOTICE '관리자 권한이 성공적으로 부여되었습니다: %', admin_email;
END $$;

-- 생성된 관리자 확인
SELECT 
  au.id,
  au.role,
  au.is_active,
  u.email as auth_email,
  u.created_at
FROM admin_users au
JOIN auth.users u ON au.id = u.id
WHERE au.is_active = true;