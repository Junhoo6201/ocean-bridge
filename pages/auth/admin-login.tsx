import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import IshigakiButton from '@/components/ishigaki/IshigakiButton';
import { ishigakiTheme } from '@/styles/ishigaki-theme';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    #1a1a2e 0%, 
    #16213e 100%);
  padding: 24px;
`;

const LoginCard = styled.div`
  background: ${ishigakiTheme.colors.background.primary};
  border-radius: 24px;
  padding: 48px;
  width: 100%;
  max-width: 440px;
  box-shadow: ${ishigakiTheme.shadows.xl};
  border: 2px solid ${ishigakiTheme.colors.semantic.sunset};
`;

const Logo = styled.h1`
  font-size: 28px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 8px;
  color: ${ishigakiTheme.colors.text.primary};
`;

const AdminBadge = styled.div`
  display: inline-block;
  background: ${ishigakiTheme.colors.semantic.sunset};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 auto 24px;
  display: flex;
  width: fit-content;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${ishigakiTheme.colors.text.primary};
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s;
  background: ${ishigakiTheme.colors.background.primary};

  &:focus {
    outline: none;
    border-color: ${ishigakiTheme.colors.semantic.sunset};
    box-shadow: 0 0 0 3px rgba(255, 179, 71, 0.1);
  }

  &::placeholder {
    color: ${ishigakiTheme.colors.text.muted};
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 135, 135, 0.1);
  border: 1px solid ${ishigakiTheme.colors.semantic.coral};
  border-radius: 8px;
  padding: 12px;
  color: ${ishigakiTheme.colors.semantic.coral};
  font-size: 14px;
`;

const WarningMessage = styled.div`
  background: rgba(255, 179, 71, 0.1);
  border: 1px solid ${ishigakiTheme.colors.semantic.sunset};
  border-radius: 8px;
  padding: 12px;
  color: ${ishigakiTheme.colors.semantic.sunset};
  font-size: 13px;
  margin-bottom: 20px;
  text-align: center;
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.secondary};

  a {
    color: ${ishigakiTheme.colors.brand.primary};
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setError('로그인 정보가 올바르지 않습니다.');
      } else if (data.user) {
        // Check if user is admin
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (adminUser) {
          router.push('/admin/products');
        } else {
          setError('관리자 권한이 없습니다.');
          await supabase.auth.signOut();
        }
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>관리자 로그인 - Ishigaki Connect</title>
        <meta name="description" content="Ishigaki Connect 관리자 로그인" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <PageContainer>
        <LoginCard>
          <Logo>Ishigaki Connect</Logo>
          <AdminBadge>관리자 전용</AdminBadge>

          <WarningMessage>
            ⚠️ 이 페이지는 관리자 전용입니다.
            <br />무단 접근 시 법적 조치가 취해질 수 있습니다.
          </WarningMessage>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>관리자 이메일</Label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </InputGroup>

            <InputGroup>
              <Label>비밀번호</Label>
              <Input
                type="password"
                placeholder="관리자 비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </InputGroup>

            <IshigakiButton
              variant="coral"
              size="large"
              disabled={loading}
            >
              {loading ? '인증 중...' : '관리자 로그인'}
            </IshigakiButton>
          </Form>

          <LinkText>
            <Link href="/auth/login">← 일반 로그인으로 돌아가기</Link>
          </LinkText>
        </LoginCard>
      </PageContainer>
    </>
  );
}