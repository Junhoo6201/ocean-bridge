import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import IshigakiButton from '@/components/ishigaki/IshigakiButton';
import { ishigakiTheme } from '@/styles/ishigaki-theme';
import TermsModal from '@/components/common/TermsModal';

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

const SignupCard = styled.div`
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
`;

const SuccessMessage = styled.div`
  background: rgba(78, 205, 196, 0.1);
  border: 1px solid ${ishigakiTheme.colors.semantic.tropical};
  border-radius: 8px;
  padding: 12px;
  color: ${ishigakiTheme.colors.semantic.tropical};
  font-size: 14px;
`;

const PasswordHint = styled.div`
  font-size: 12px;
  color: ${ishigakiTheme.colors.text.muted};
  margin-top: -4px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.secondary};
  line-height: 1.5;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  margin-top: 2px;
  cursor: pointer;
  accent-color: ${ishigakiTheme.colors.brand.primary};
`;

const CheckboxText = styled.span`
  flex: 1;
`;

const TermsLink = styled.button`
  background: none;
  border: none;
  color: ${ishigakiTheme.colors.brand.primary};
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  
  &:hover {
    color: ${ishigakiTheme.colors.brand.secondary};
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${ishigakiTheme.colors.border.light};
  margin: 4px 0;
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

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // 약관 동의 상태
  const [allAgree, setAllAgree] = useState(false);
  const [termsAgree, setTermsAgree] = useState(false);
  const [privacyAgree, setPrivacyAgree] = useState(false);
  const [marketingAgree, setMarketingAgree] = useState(false);
  
  // 모달 상태
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // 전체 동의 처리
  const handleAllAgree = (checked: boolean) => {
    setAllAgree(checked);
    setTermsAgree(checked);
    setPrivacyAgree(checked);
    setMarketingAgree(checked);
  };

  // 개별 동의 처리
  const handleIndividualAgree = () => {
    if (termsAgree && privacyAgree && marketingAgree) {
      setAllAgree(true);
    } else {
      setAllAgree(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // 약관 동의 확인
    if (!termsAgree || !privacyAgree) {
      setError('필수 약관에 동의해주세요.');
      return;
    }

    // Validation
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        if (error.message.includes('already registered')) {
          setError('이미 등록된 이메일입니다.');
        } else {
          setError(error.message);
        }
      } else {
        setSuccess(true);
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>회원가입 - Ishigaki Connect</title>
        <meta name="description" content="Ishigaki Connect 회원가입" />
      </Head>

      <PageContainer>
        <SignupCard>
          <Logo>Ishigaki Connect</Logo>
          <Subtitle>이시가키 여행을 더욱 특별하게</Subtitle>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && (
            <SuccessMessage>
              회원가입이 완료되었습니다! 이메일을 확인해주세요.
              <br />잠시 후 로그인 페이지로 이동합니다...
            </SuccessMessage>
          )}

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>이메일</Label>
              <Input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || success}
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
                disabled={loading || success}
              />
              <PasswordHint>최소 6자 이상, 영문과 숫자 포함</PasswordHint>
            </InputGroup>

            <InputGroup>
              <Label>비밀번호 확인</Label>
              <Input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                disabled={loading || success}
              />
            </InputGroup>

            <CheckboxGroup>
              <CheckboxItem>
                <Checkbox
                  type="checkbox"
                  checked={allAgree}
                  onChange={(e) => handleAllAgree(e.target.checked)}
                  disabled={loading || success}
                />
                <CheckboxText>
                  <strong>전체 동의</strong>
                </CheckboxText>
              </CheckboxItem>
              
              <Divider />
              
              <CheckboxItem>
                <Checkbox
                  type="checkbox"
                  checked={termsAgree}
                  onChange={(e) => {
                    setTermsAgree(e.target.checked);
                    handleIndividualAgree();
                  }}
                  disabled={loading || success}
                />
                <CheckboxText>
                  [필수] 이용약관 동의{' '}
                  <TermsLink 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsModal(true);
                    }}
                  >
                    보기
                  </TermsLink>
                </CheckboxText>
              </CheckboxItem>
              
              <CheckboxItem>
                <Checkbox
                  type="checkbox"
                  checked={privacyAgree}
                  onChange={(e) => {
                    setPrivacyAgree(e.target.checked);
                    handleIndividualAgree();
                  }}
                  disabled={loading || success}
                />
                <CheckboxText>
                  [필수] 개인정보처리방침 동의{' '}
                  <TermsLink 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPrivacyModal(true);
                    }}
                  >
                    보기
                  </TermsLink>
                </CheckboxText>
              </CheckboxItem>
              
              <CheckboxItem>
                <Checkbox
                  type="checkbox"
                  checked={marketingAgree}
                  onChange={(e) => {
                    setMarketingAgree(e.target.checked);
                    handleIndividualAgree();
                  }}
                  disabled={loading || success}
                />
                <CheckboxText>
                  [선택] 마케팅 정보 수신 동의 (이벤트, 할인 정보 등)
                </CheckboxText>
              </CheckboxItem>
            </CheckboxGroup>

            <IshigakiButton
              variant="coral"
              size="large"
              disabled={loading || success}
            >
              {loading ? '처리 중...' : '회원가입'}
            </IshigakiButton>
          </Form>

          <LinkText>
            이미 계정이 있으신가요? <Link href="/auth/login">로그인</Link>
          </LinkText>
        </SignupCard>
      </PageContainer>

      {/* 약관 모달 */}
      <TermsModal 
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        type="terms"
      />
      
      {/* 개인정보처리방침 모달 */}
      <TermsModal 
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        type="privacy"
      />
    </>
  );
}