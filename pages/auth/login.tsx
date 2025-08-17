import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import IshigakiButton from '@/components/ishigaki/IshigakiButton';
import { ishigakiTheme } from '@/styles/ishigaki-theme';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    ${ishigakiTheme.colors.background.tertiary} 0%, 
    ${ishigakiTheme.colors.background.secondary} 100%);
  padding: 24px;
`;

const LoginCard = styled.div`
  background: ${ishigakiTheme.colors.background.primary};
  border-radius: 24px;
  padding: 48px;
  width: 100%;
  max-width: 440px;
  box-shadow: ${ishigakiTheme.shadows.xl};
`;

const Logo = styled.h1`
  font-size: 32px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 12px;
  background: linear-gradient(135deg, 
    ${ishigakiTheme.colors.brand.primary} 0%, 
    ${ishigakiTheme.colors.brand.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${ishigakiTheme.colors.text.secondary};
  margin-bottom: 40px;
  font-size: 14px;
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
    border-color: ${ishigakiTheme.colors.brand.primary};
    box-shadow: 0 0 0 3px rgba(38, 208, 206, 0.1);
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
  margin-bottom: 16px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 32px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${ishigakiTheme.colors.border.light};
  }
  
  span {
    padding: 0 16px;
    color: ${ishigakiTheme.colors.text.muted};
    font-size: 14px;
  }
`;

const SocialButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${ishigakiTheme.colors.border.medium};
  border-radius: 12px;
  background: #FEE500;
  color: #000000;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${ishigakiTheme.shadows.md};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithKakao } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirect = router.query.redirect as string || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        router.push(redirect);
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      // 리다이렉트할 페이지 저장 (콜백에서 사용)
      if (redirect !== '/') {
        localStorage.setItem('redirectAfterLogin', redirect);
      }
      
      const { error } = await signInWithKakao();
      
      if (error) {
        console.error('Kakao login error:', error);
        setError('카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        setLoading(false);
      }
      // 성공하면 카카오 로그인 페이지로 자동 리다이렉트됨
    } catch (err) {
      console.error('Kakao login error:', err);
      setError('카카오 로그인 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>로그인 - Ishigaki Connect</title>
        <meta name="description" content="Ishigaki Connect 로그인" />
      </Head>

      <PageContainer>
        <LoginCard>
          <Logo>Ishigaki Connect</Logo>
          <Subtitle>이시가키 여행의 모든 것</Subtitle>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>이메일</Label>
              <Input
                type="email"
                placeholder="이메일을 입력하세요"
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
                placeholder="비밀번호를 입력하세요"
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
              {loading ? '로그인 중...' : '로그인'}
            </IshigakiButton>
          </Form>

          <Divider>
            <span>또는</span>
          </Divider>

          <SocialButton onClick={handleKakaoLogin} disabled={loading}>
            <span>💬</span>
            카카오로 시작하기
          </SocialButton>

          <LinkText>
            계정이 없으신가요? <Link href="/auth/signup">회원가입</Link>
          </LinkText>

          <LinkText>
            <Link href="/auth/admin-login">관리자 로그인 →</Link>
          </LinkText>
        </LoginCard>
      </PageContainer>
    </>
  );
}