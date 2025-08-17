// 임시 관리자 설정 API (개발 환경에서만 사용)
// 프로덕션에서는 반드시 제거하세요!

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Service role key 필요 (Supabase Dashboard > Settings > API에서 확인)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // 임시로 anon key 사용
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    // 1. 사용자 생성 또는 확인
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError && !authError.message.includes('already registered')) {
      throw authError;
    }

    // 2. 사용자 ID 가져오기
    const { data: users } = await supabaseAdmin
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();

    if (!users) {
      throw new Error('User not found');
    }

    // 3. admin_users 테이블에 추가
    const { error: adminError } = await supabaseAdmin
      .from('admin_users')
      .upsert({
        id: users.id,
        role: 'super_admin',
        email: email,
        name: 'Administrator',
        is_active: true
      });

    if (adminError) throw adminError;

    res.status(200).json({ 
      message: '관리자 계정이 생성되었습니다',
      email,
      instructions: '이제 /auth/admin-login 에서 로그인하세요'
    });
  } catch (error: any) {
    console.error('Admin setup error:', error);
    res.status(500).json({ error: error.message });
  }
}