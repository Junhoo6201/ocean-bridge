import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import { Button, Footer } from '../src/components';
import IshigakiHero from '../src/components/ishigaki/IshigakiHero';
import IshigakiCard from '../src/components/ishigaki/IshigakiCard';
import IshigakiNavigation from '../src/components/ishigaki/IshigakiNavigation';
import { ishigakiTheme } from '../src/styles/ishigaki-theme';
import { supabase } from '../src/lib/supabase/client';
import type { Product } from '../src/types/database';

const PageContainer = styled.div`
  background: ${ishigakiTheme.colors.background.primary};
  min-height: 100vh;
`;

const Section = styled.section`
  padding: 80px 0;
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const SectionTitle = styled.h2`
  font-size: 48px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 16px;
  color: ${ishigakiTheme.colors.text.primary};
`;

const SectionSubtitle = styled.p`
  font-size: 20px;
  text-align: center;
  color: ${ishigakiTheme.colors.text.secondary};
  margin-bottom: 64px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-bottom: 80px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 48px;
  margin-bottom: 80px;
`;

const FeatureCard = styled.div`
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
`;

const FeatureTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  color: ${ishigakiTheme.colors.text.primary};
`;

const FeatureDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${ishigakiTheme.colors.text.secondary};
`;

const CTASection = styled.div`
  background: linear-gradient(135deg, 
    ${ishigakiTheme.colors.brand.primary} 0%, 
    ${ishigakiTheme.colors.brand.accent} 100%);
  padding: 80px 0;
  text-align: center;
  border-radius: 24px;
  margin: 80px 0;
`;

const CTATitle = styled.h2`
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
`;

const CTADescription = styled.p`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 32px;
`;

export default function HomePage() {
  const { } = useTranslation('common');
  const router = useRouter();
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('is_popular', true)
          .limit(6);

        if (error) throw error;

        if (data) {
          setPopularProducts(data);
        }
      } catch (error) {
        console.error('Error fetching popular products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  const categories = [
    {
      id: 'diving',
      title: '다이빙',
      subtitle: '맨타를 만나는 특별한 경험',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      description: '세계적으로 유명한 이시가키의 맨타 포인트에서 다이빙',
      price: '85,000',
      duration: '3시간',
      difficulty: '초급',
      popular: true
    },
    {
      id: 'snorkel',
      title: '스노클링',
      subtitle: '카비라만의 맑은 바다',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      description: '아름다운 산호초와 열대어를 만나는 스노클링',
      price: '65,000',
      duration: '2시간',
      difficulty: '초급',
      popular: true
    },
    {
      id: 'sup',
      title: 'SUP/카약',
      subtitle: '잔잔한 바다 위 명상',
      image: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=800&h=600&fit=crop',
      description: 'SUP 보드와 카약으로 즐기는 평화로운 시간',
      price: '55,000',
      duration: '2시간',
      difficulty: '초급',
      popular: false
    },
    {
      id: 'stargazing',
      title: '별 관측',
      subtitle: '일본 최초 별빛보호구역',
      image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=600&fit=crop',
      description: '도시에서는 볼 수 없는 은하수를 관찰',
      price: '45,000',
      duration: '2시간',
      difficulty: '모든 레벨',
      popular: true
    },
    {
      id: 'iriomote',
      title: '이리오모테',
      subtitle: '원시 정글 탐험',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      description: '맹그로브 숲과 폭포를 만나는 정글 트레킹',
      price: '120,000',
      duration: '8시간',
      difficulty: '중급',
      popular: false
    },
    {
      id: 'glassboat',
      title: '글라스보트',
      subtitle: '물에 안 들어가도 OK',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop',
      description: '유리 바닥 보트로 산호초 관찰',
      price: '35,000',
      duration: '1시간',
      difficulty: '모든 레벨',
      popular: false
    }
  ];

  const features = [
    {
      icon: '🌏',
      title: '한국어 완벽 지원',
      description: '예약부터 현장 안내까지 모든 과정을 한국어로 진행합니다'
    },
    {
      icon: '✨',
      title: '실시간 예약 확인',
      description: '카카오톡으로 실시간 예약 상태를 확인하고 문의할 수 있습니다'
    },
    {
      icon: '🛡️',
      title: '안전한 결제',
      description: '한국 카드로 안전하게 결제하고 예약을 보장받으세요'
    },
    {
      icon: '☀️',
      title: '기상 보장',
      description: '날씨로 인한 취소 시 100% 환불 또는 일정 변경을 보장합니다'
    }
  ];

  const footerSections = [
    {
      title: '회사',
      links: [
        { label: '소개', href: '/about' },
        { label: '문의하기', href: '/contact' },
        { label: '이용약관', href: '/terms' },
        { label: '개인정보처리방침', href: '/privacy' }
      ]
    },
    {
      title: '고객지원',
      links: [
        { label: '자주 묻는 질문', href: '/faq' },
        { label: '예약 확인', href: '/booking' },
        { label: '취소/환불', href: '/refund' },
        { label: '카카오톡 문의', href: 'https://pf.kakao.com/_ishigaki' }
      ]
    },
    {
      title: '인기 투어',
      links: [
        { label: '카비라만 스노클링', href: '/products?category=snorkel' },
        { label: '맨타 다이빙', href: '/products?category=diving' },
        { label: '별 관측 투어', href: '/products?category=stargazing' },
        { label: '이리오모테 정글', href: '/products?category=iriomote' }
      ]
    }
  ];


  return (
    <>
      <Head>
        <title>Ishigaki Connect - 이시가키 한국어 투어 예약</title>
        <meta name="description" content="일본 이시가키 여행을 한국어로 완벽하게. 다이빙, 스노클링, 별 관측 등 다양한 액티비티를 예약하세요." />
        <meta name="keywords" content="이시가키, 석가키, 오키나와, 일본여행, 스노클링, 다이빙, 맨타, 카비라만" />
      </Head>

      <PageContainer>
        <IshigakiNavigation 
          logoText="Ishigaki Connect"
          items={[
            { label: '홈', href: '/', active: true },
            { label: '투어', href: '/products' },
            { label: '소개', href: '/about' },
            { label: '문의', href: '/contact' }
          ]}
          onItemClick={handleNavClick} 
        />
        
        <IshigakiHero
          subtitle="일본어 몰라도 OK! 한국어로 완벽한 예약"
          title="이시가키의 푸른 바다로"
          description="카비라만의 에메랄드빛 바다, 세계적인 맨타 포인트, 일본 최초 별빛보호구역. 이시가키의 모든 것을 한국어로 예약하세요."
          backgroundImage="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop"
          onPrimaryClick={() => router.push('/products')}
          onSecondaryClick={() => router.push('/about')}
          primaryButtonText="투어 둘러보기"
          secondaryButtonText="이시가키 소개"
        />

        {/* 인기 카테고리 섹션 */}
        <Section>
          <Container>
            <SectionTitle>인기 카테고리</SectionTitle>
            <SectionSubtitle>이시가키의 다양한 액티비티를 한국어로 예약하세요</SectionSubtitle>
            
            <CategoryGrid>
              {categories.map((category) => (
                <IshigakiCard
                  key={category.id}
                  variant={category.popular ? "coral" : "default"}
                  image={category.image}
                  title={category.title}
                  description={category.description}
                  price={category.price}
                  badge={category.difficulty}
                  popular={category.popular}
                  onClick={() => router.push(`/products?category=${category.id}`)}
                />
              ))}
            </CategoryGrid>
          </Container>
        </Section>

        {/* 인기 투어 섹션 - 실제 데이터가 있을 때만 표시 */}
        {!loading && popularProducts.length > 0 && (
          <Section style={{ background: ishigakiTheme.colors.background.secondary }}>
            <Container>
              <SectionTitle>인기 투어</SectionTitle>
              <SectionSubtitle>지금 가장 인기 있는 투어를 만나보세요</SectionSubtitle>
              
              <CategoryGrid>
                {popularProducts.map((product) => (
                  <IshigakiCard
                    key={product.id}
                    variant="gradient"
                    image={product.images?.[0]}
                    title={product.title_ko}
                    description={product.description_ko || undefined}
                    price={product.price_adult_krw?.toLocaleString('ko-KR')}
                    badge={
                      product.difficulty === 'beginner' ? '초급' :
                      product.difficulty === 'intermediate' ? '중급' :
                      product.difficulty === 'advanced' ? '상급' : '모든 레벨'
                    }
                    popular={true}
                    onClick={() => router.push(`/products/${product.id}`)}
                  />
                ))}
              </CategoryGrid>
            </Container>
          </Section>
        )}

        {/* 왜 이시가키 커넥트인가? */}
        <Section style={{ background: !loading && popularProducts.length > 0 ? ishigakiTheme.colors.background.primary : ishigakiTheme.colors.background.secondary }}>
          <Container>
            <SectionTitle>왜 이시가키 커넥트인가요?</SectionTitle>
            <SectionSubtitle>이시가키 여행을 더욱 특별하게 만들어드립니다</SectionSubtitle>
            
            <FeatureGrid>
              {features.map((feature, index) => (
                <FeatureCard key={index}>
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureCard>
              ))}
            </FeatureGrid>
          </Container>
        </Section>

        {/* CTA 섹션 */}
        <Section>
          <Container>
            <CTASection>
              <CTATitle>지금 바로 시작하세요</CTATitle>
              <CTADescription>
                이시가키의 아름다운 바다가 당신을 기다립니다
              </CTADescription>
              <Button 
                size="large" 
                variant="primary"
                style={{ 
                  background: 'white', 
                  color: ishigakiTheme.colors.brand.primary,
                  padding: '16px 48px',
                  fontSize: '18px',
                  fontWeight: '700'
                }}
                onClick={() => router.push('/products')}
              >
                투어 예약하기
              </Button>
            </CTASection>
          </Container>
        </Section>

        <Footer
          sections={footerSections}
          description="Ishigaki Connect - 한국 여행자와 이시가키를 연결합니다. 일본어 몰라도 OK! 카카오톡: @ishigaki-connect"
        />
      </PageContainer>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ko', ['common'])),
    },
  };
}