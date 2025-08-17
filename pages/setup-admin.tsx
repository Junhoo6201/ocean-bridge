import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { supabase } from '@/lib/supabase/client';
import IshigakiButton from '@/components/ishigaki/IshigakiButton';
import { ishigakiTheme } from '@/styles/ishigaki-theme';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
  color: ${ishigakiTheme.colors.text.primary};
`;

const Warning = styled.div`
  background: rgba(255, 135, 135, 0.1);
  border: 1px solid ${ishigakiTheme.colors.semantic.coral};
  border-radius: 8px;
  padding: 12px;
  margin: 20px 0;
  color: ${ishigakiTheme.colors.semantic.coral};
  font-size: 14px;
`;

const Success = styled.div`
  background: rgba(78, 205, 196, 0.1);
  border: 1px solid ${ishigakiTheme.colors.semantic.tropical};
  border-radius: 8px;
  padding: 12px;
  margin: 20px 0;
  color: ${ishigakiTheme.colors.semantic.tropical};
  font-size: 14px;
`;

const Info = styled.div`
  background: rgba(127, 219, 255, 0.1);
  border: 1px solid ${ishigakiTheme.colors.brand.accent};
  border-radius: 8px;
  padding: 16px;
  margin: 20px 0;
  font-size: 14px;
  line-height: 1.6;
`;

const Step = styled.div`
  margin: 10px 0;
  padding-left: 20px;
  position: relative;
  
  &:before {
    content: '→';
    position: absolute;
    left: 0;
    color: ${ishigakiTheme.colors.brand.primary};
  }
`;

export default function SetupAdminPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSetupAdmin = async () => {
    if (!email) {
      setError('이메일을 입력하세요');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // 사용자 찾기
      const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
      
      if (fetchError) {
        // admin 권한이 없으면 다른 방법 시도
        setError('Service Role Key가 필요합니다. 수동으로 설정하세요.');
        setMessage('아래 설명을 따라 수동으로 관리자를 설정하세요.');
        return;
      }

      const user = users?.find(u => u.email === email);
      
      if (!user) {
        setError('해당 이메일로 가입된 사용자가 없습니다. 먼저 회원가입을 완료하세요.');
        return;
      }

      // admin_users 테이블에 추가
      const { error: adminError } = await supabase
        .from('admin_users')
        .upsert({
          id: user.id,
          role: 'super_admin',
          is_active: true
        });

      if (adminError) {
        setError(`관리자 설정 실패: ${adminError.message}`);
        return;
      }

      setMessage('✅ 관리자 권한이 부여되었습니다! /auth/admin-login 에서 로그인하세요.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>관리자 설정 - Ishigaki Connect</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Container>
        <Card>
          <Title>🔧 관리자 계정 설정</Title>
          
          <Warning>
            ⚠️ 이 페이지는 개발 환경에서만 사용하세요!
            프로덕션에서는 반드시 제거해야 합니다.
          </Warning>

          <Info>
            <strong>관리자 설정 방법:</strong>
            <Step>1. 먼저 /auth/signup 에서 회원가입</Step>
            <Step>2. 가입한 이메일을 아래에 입력</Step>
            <Step>3. "관리자 권한 부여" 클릭</Step>
            <Step>4. /auth/admin-login 에서 로그인</Step>
          </Info>

          {error && <Warning>{error}</Warning>}
          {message && <Success>{message}</Success>}

          <div style={{ marginTop: '20px' }}>
            <input
              type="email"
              placeholder="가입한 이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '16px'
              }}
            />
            
            <IshigakiButton
              variant="coral"
              size="large"
              onClick={handleSetupAdmin}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? '처리 중...' : '관리자 권한 부여'}
            </IshigakiButton>
          </div>

          <Info style={{ marginTop: '30px' }}>
            <strong>수동 설정 (SQL):</strong>
            <div style={{ 
              background: '#f5f5f5', 
              padding: '12px', 
              borderRadius: '4px',
              marginTop: '10px',
              fontFamily: 'monospace',
              fontSize: '12px',
              overflowX: 'auto'
            }}>
              {`INSERT INTO admin_users (id, role, is_active)
SELECT id, 'super_admin', true
FROM auth.users WHERE email = '${email || 'your-email@example.com'}';`}
            </div>
            <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
              Supabase Dashboard → SQL Editor에서 실행
            </small>
          </Info>
        </Card>
      </Container>
    </>
  );
}