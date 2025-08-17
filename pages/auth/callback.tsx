import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styled from 'styled-components';
import { supabase } from '@/lib/supabase/client';
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

const LoadingCard = styled.div`
  background: ${ishigakiTheme.colors.background.primary};
  border-radius: 24px;
  padding: 48px;
  width: 100%;
  max-width: 440px;
  box-shadow: ${ishigakiTheme.shadows.xl};
  text-align: center;
`;

const Logo = styled.h1`
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 24px;
  background: linear-gradient(135deg, 
    ${ishigakiTheme.colors.brand.primary} 0%, 
    ${ishigakiTheme.colors.brand.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${ishigakiTheme.colors.border.light};
  border-top-color: ${ishigakiTheme.colors.brand.primary};
  border-radius: 50%;
  margin: 0 auto 24px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.p`
  color: ${ishigakiTheme.colors.text.secondary};
  font-size: 16px;
  margin-bottom: 8px;
`;

const ErrorMessage = styled.div`
  background: rgba(255, 135, 135, 0.1);
  border: 1px solid ${ishigakiTheme.colors.semantic.coral};
  border-radius: 8px;
  padding: 16px;
  color: ${ishigakiTheme.colors.semantic.coral};
  font-size: 14px;
  margin-top: 24px;
`;

const RetryButton = styled.button`
  margin-top: 24px;
  padding: 12px 24px;
  background: ${ishigakiTheme.colors.brand.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${ishigakiTheme.colors.brand.secondary};
    transform: translateY(-2px);
    box-shadow: ${ishigakiTheme.shadows.md};
  }
`;

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase가 OAuth 콜백을 자동으로 처리
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('OAuth callback error:', error);
          return;
        }

        if (session) {
          // 로그인 성공
          console.log('Successfully logged in with Kakao:', session.user);
          
          // 사용자 정보 확인 (선택사항)
          const user = session.user;
          const metadata = user.user_metadata;
          
          // 카카오 프로필 정보는 user_metadata에 저장됨
          console.log('Kakao profile:', {
            name: metadata.full_name || metadata.name,
            avatar: metadata.avatar_url,
            email: user.email,
          });

          // 원래 가려던 페이지로 리다이렉트
          const redirectTo = localStorage.getItem('redirectAfterLogin') || '/';
          localStorage.removeItem('redirectAfterLogin');
          
          // 약간의 지연 후 리다이렉트 (사용자가 로딩을 볼 수 있도록)
          setTimeout(() => {
            router.push(redirectTo);
          }, 1000);
        } else {
          // 세션이 없는 경우
          console.log('No session found after callback');
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Callback handling error:', error);
      }
    };

    // URL에서 에러 파라미터 확인
    const error = router.query.error;
    const errorDescription = router.query.error_description;
    
    if (error) {
      console.error('OAuth error:', error, errorDescription);
      // 에러가 있으면 로그인 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/auth/login?error=' + encodeURIComponent(errorDescription as string || error as string));
      }, 3000);
    } else {
      handleCallback();
    }
  }, [router]);

  // 에러가 있는 경우
  if (router.query.error) {
    return (
      <>
        <Head>
          <title>로그인 오류 - Ishigaki Connect</title>
        </Head>
        <PageContainer>
          <LoadingCard>
            <Logo>Ishigaki Connect</Logo>
            <Message>로그인 중 오류가 발생했습니다</Message>
            <ErrorMessage>
              {router.query.error_description || router.query.error || '알 수 없는 오류가 발생했습니다.'}
            </ErrorMessage>
            <RetryButton onClick={() => router.push('/auth/login')}>
              다시 시도하기
            </RetryButton>
          </LoadingCard>
        </PageContainer>
      </>
    );
  }

  // 정상 처리 중
  return (
    <>
      <Head>
        <title>로그인 중 - Ishigaki Connect</title>
      </Head>
      <PageContainer>
        <LoadingCard>
          <Logo>Ishigaki Connect</Logo>
          <LoadingSpinner />
          <Message>카카오 로그인 처리 중입니다...</Message>
          <Message style={{ fontSize: '14px', color: ishigakiTheme.colors.text.muted }}>
            잠시만 기다려 주세요
          </Message>
        </LoadingCard>
      </PageContainer>
    </>
  );
}