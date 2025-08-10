import React from 'react';
import styled from '@emotion/styled';
import { ishigakiTheme, ishigakiCSSVariables } from '../src/styles/ishigaki-theme';
import IshigakiNavigation from '../src/components/ishigaki/IshigakiNavigation';
import IshigakiHero from '../src/components/ishigaki/IshigakiHero';
import IshigakiCard from '../src/components/ishigaki/IshigakiCard';
import IshigakiButton from '../src/components/ishigaki/IshigakiButton';

const GlobalStyles = styled.div`
  ${ishigakiCSSVariables}
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: ${ishigakiTheme.colors.background.primary};
    color: ${ishigakiTheme.colors.text.primary};
    overflow-x: hidden;
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${ishigakiTheme.colors.background.primary};
`;

const Section = styled.section`
  padding: 100px 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const SectionSubtitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${ishigakiTheme.colors.brand.accent};
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 20px;
  color: ${ishigakiTheme.colors.brand.primary};
`;

const SectionDescription = styled.p`
  font-size: 18px;
  color: ${ishigakiTheme.colors.text.tertiary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  margin-bottom: 60px;
`;

const ButtonShowcase = styled.div`
  padding: 60px 24px;
  background: ${ishigakiTheme.colors.background.secondary};
  border-radius: 24px;
  margin-bottom: 60px;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 40px;
`;

const ButtonCategory = styled.div`
  margin-bottom: 40px;
`;

const CategoryTitle = styled.h3`
  font-size: 20px;
  color: ${ishigakiTheme.colors.text.secondary};
  margin-bottom: 20px;
`;

const FeatureSection = styled.section`
  padding: 100px 24px;
  background: ${ishigakiTheme.colors.background.secondary};
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 40px 24px;
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 20px;
  border: 1px solid rgba(72, 202, 228, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${ishigakiTheme.shadows.lg};
    border-color: ${ishigakiTheme.colors.brand.accent};
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: ${ishigakiTheme.colors.brand.primary};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
`;

const FeatureTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 12px;
`;

const FeatureDescription = styled.p`
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.tertiary};
  line-height: 1.6;
`;

const IshigakiDemo: React.FC = () => {
  const navItems = [
    { label: '홈', href: '/', active: true },
    { label: '투어', href: '/tours' },
    { label: '액티비티', href: '/activities' },
    { label: '이시가키 소개', href: '/about' },
    { label: '문의하기', href: '/contact' },
  ];

  const tourCards = [
    {
      title: '만타레이 스노클링',
      description: '이시가키의 청정 바다에서 만타레이와 함께 수영하는 특별한 경험',
      price: '89,000',
      badge: '베스트셀러',
      variant: 'coral' as const,
      popular: true,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    },
    {
      title: '선셋 카약 투어',
      description: '황금빛 석양을 바라보며 즐기는 로맨틱한 카약 체험',
      price: '65,000',
      badge: '프리미엄',
      variant: 'premium' as const,
      image: 'https://images.unsplash.com/photo-1545450660-3378a7f3a364?w=800&h=600&fit=crop',
    },
    {
      title: '정글 트레킹',
      description: '이시가키의 원시 정글을 탐험하는 에코 어드벤처',
      price: '45,000',
      badge: '에코투어',
      variant: 'eco' as const,
      image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop',
    },
  ];

  const features = [
    {
      icon: '🏝️',
      title: '천혜의 자연',
      description: '에메랄드빛 바다와 백사장이 만들어내는 완벽한 조화',
    },
    {
      icon: '🤿',
      title: '다양한 액티비티',
      description: '스노클링부터 다이빙까지 모든 해양 스포츠를 즐기세요',
    },
    {
      icon: '🌅',
      title: '환상적인 일몰',
      description: '이시가키에서만 볼 수 있는 특별한 선셋 뷰',
    },
    {
      icon: '🐠',
      title: '풍부한 해양생물',
      description: '만타레이, 바다거북 등 다양한 해양생물과의 만남',
    },
  ];

  return (
    <GlobalStyles>
      <PageContainer>
        <IshigakiNavigation
          logoText="ISHIGAKI OCEAN"
          items={navItems}
          onItemClick={(href) => console.log('Navigate to:', href)}
        />

        <IshigakiHero
          title="이시가키의 푸른 바다로 떠나는 여행"
          subtitle="일본 오키나와 이시가키"
          description="에메랄드빛 바다와 산호초가 만들어내는 환상적인 해양 파라다이스에서 특별한 추억을 만들어보세요"
          backgroundImage="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1920&h=1080&fit=crop"
          primaryButtonText="지금 예약하기"
          secondaryButtonText="투어 둘러보기"
          onPrimaryClick={() => console.log('Book now clicked')}
          onSecondaryClick={() => console.log('Browse tours clicked')}
        />

        <Section>
          <SectionHeader>
            <SectionSubtitle>인기 투어</SectionSubtitle>
            <SectionTitle>이시가키 베스트 체험</SectionTitle>
            <SectionDescription>
              현지 가이드와 함께하는 안전하고 특별한 해양 투어를 만나보세요
            </SectionDescription>
          </SectionHeader>

          <CardGrid>
            {tourCards.map((card, index) => (
              <IshigakiCard
                key={index}
                {...card}
                onClick={() => console.log(`Card clicked: ${card.title}`)}
              />
            ))}
          </CardGrid>
        </Section>

        <Section>
          <ButtonShowcase>
            <SectionHeader>
              <SectionTitle>버튼 스타일 쇼케이스</SectionTitle>
            </SectionHeader>

            <ButtonCategory>
              <CategoryTitle>기본 버튼</CategoryTitle>
              <ButtonGrid>
                <IshigakiButton variant="ocean">오션 버튼</IshigakiButton>
                <IshigakiButton variant="coral">코랄 버튼</IshigakiButton>
                <IshigakiButton variant="sunset">선셋 버튼</IshigakiButton>
                <IshigakiButton variant="tropical">트로피컬 버튼</IshigakiButton>
                <IshigakiButton variant="sand">샌드 버튼</IshigakiButton>
              </ButtonGrid>
            </ButtonCategory>

            <ButtonCategory>
              <CategoryTitle>글로우 효과</CategoryTitle>
              <ButtonGrid>
                <IshigakiButton variant="ocean" glow>글로우 오션</IshigakiButton>
                <IshigakiButton variant="coral" glow>글로우 코랄</IshigakiButton>
                <IshigakiButton variant="sunset" glow>글로우 선셋</IshigakiButton>
              </ButtonGrid>
            </ButtonCategory>

            <ButtonCategory>
              <CategoryTitle>사이즈 변형</CategoryTitle>
              <ButtonGrid>
                <IshigakiButton size="small">작은 버튼</IshigakiButton>
                <IshigakiButton size="medium">중간 버튼</IshigakiButton>
                <IshigakiButton size="large">큰 버튼</IshigakiButton>
              </ButtonGrid>
            </ButtonCategory>
          </ButtonShowcase>
        </Section>

        <FeatureSection>
          <SectionHeader>
            <SectionSubtitle>왜 이시가키인가</SectionSubtitle>
            <SectionTitle>이시가키만의 특별함</SectionTitle>
          </SectionHeader>

          <FeatureGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </FeatureSection>
      </PageContainer>
    </GlobalStyles>
  );
};

export default IshigakiDemo;