import React from 'react';
import styled from '@emotion/styled';
import { ishigakiTheme } from '../src/styles/ishigaki-theme';
import IshigakiNavigation from '../src/components/ishigaki/IshigakiNavigation';
import IshigakiHero from '../src/components/ishigaki/IshigakiHero';
import IshigakiCard from '../src/components/ishigaki/IshigakiCard';
import IshigakiButton from '../src/components/ishigaki/IshigakiButton';

const GlobalStyles = styled.div`
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
`;

const CTASection = styled.section`
  padding: 120px 24px;
  background: ${ishigakiTheme.colors.background.tertiary};
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: ${ishigakiTheme.colors.brand.primary};
    opacity: 0.05;
    transform: rotate(45deg);
  }
`;

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const CTATitle = styled.h2`
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 24px;
  color: ${ishigakiTheme.colors.text.primary};
`;

const CTADescription = styled.p`
  font-size: 20px;
  color: ${ishigakiTheme.colors.text.secondary};
  margin-bottom: 48px;
  line-height: 1.6;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
`;

const IshigakiPage: React.FC = () => {
  const navItems = [
    { label: '홈', href: '/ishigaki', active: true },
    { label: '투어', href: '/tours' },
    { label: '액티비티', href: '/activities' },
    { label: '이시가키 소개', href: '/about' },
    { label: '문의하기', href: '/contact' },
  ];

  const tourCards = [
    {
      title: '청의 동굴 다이빙',
      description: '신비로운 푸른 빛이 가득한 동굴에서의 환상적인 다이빙 체험',
      price: '120,000',
      badge: '전문가 코스',
      variant: 'coral' as const,
      popular: true,
      image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&h=600&fit=crop',
    },
    {
      title: '카비라 베이 투어',
      description: '이시가키 최고의 절경 포인트에서 즐기는 글라스보트 투어',
      price: '55,000',
      badge: '가족추천',
      variant: 'default' as const,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    },
    {
      title: '야에야마 섬 호핑',
      description: '이시가키 주변의 아름다운 섬들을 둘러보는 1일 투어',
      price: '98,000',
      badge: '올데이',
      variant: 'premium' as const,
      image: 'https://images.unsplash.com/photo-1527004760902-2bfaac32d0f4?w=800&h=600&fit=crop',
    },
    {
      title: '맹그로브 카약',
      description: '원시 자연이 살아있는 맹그로브 숲을 카약으로 탐험',
      price: '48,000',
      badge: '에코투어',
      variant: 'eco' as const,
      image: 'https://images.unsplash.com/photo-1545450660-3378a7f3a364?w=800&h=600&fit=crop',
    },
    {
      title: '선셋 SUP 보드',
      description: '황금빛 노을을 바라보며 즐기는 SUP 보드 체험',
      price: '58,000',
      badge: '로맨틱',
      variant: 'premium' as const,
      image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&h=600&fit=crop',
    },
    {
      title: '바다거북 스노클링',
      description: '바다거북과 함께 수영하는 특별한 스노클링 체험',
      price: '75,000',
      badge: '인기',
      variant: 'coral' as const,
      popular: true,
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop',
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
          title="이시가키 바다의 모든 것"
          subtitle="일본 최남단 오키나와 이시가키"
          description="세계적으로 유명한 만타레이 포인트와 에메랄드빛 바다, 그리고 따뜻한 열대 기후가 여러분을 기다립니다"
          backgroundImage="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop"
          primaryButtonText="지금 예약하기"
          secondaryButtonText="투어 보기"
          onPrimaryClick={() => console.log('Book now clicked')}
          onSecondaryClick={() => console.log('Browse tours clicked')}
        />

        <Section>
          <SectionHeader>
            <SectionSubtitle>BEST TOURS</SectionSubtitle>
            <SectionTitle>이시가키 인기 투어</SectionTitle>
            <SectionDescription>
              전문 가이드와 함께하는 안전하고 특별한 이시가키 해양 투어
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

        <CTASection>
          <CTAContent>
            <CTATitle>지금 바로 시작하세요</CTATitle>
            <CTADescription>
              이시가키의 아름다운 바다가 당신을 기다리고 있습니다.
              잊지 못할 추억을 만들어보세요.
            </CTADescription>
            <CTAButtons>
              <IshigakiButton variant="coral" size="large" glow>
                투어 예약하기
              </IshigakiButton>
              <IshigakiButton variant="ocean" size="large">
                상담 신청하기
              </IshigakiButton>
            </CTAButtons>
          </CTAContent>
        </CTASection>
      </PageContainer>
    </GlobalStyles>
  );
};

export default IshigakiPage;