import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ishigakiTheme } from '@/styles/ishigaki-theme';
import IshigakiNavigation from '@/components/ishigaki/IshigakiNavigation';
import IshigakiButton from '@/components/ishigaki/IshigakiButton';
import IshigakiCard from '@/components/ishigaki/IshigakiCard';
import { Badge, Footer } from '@/components';
import { supabase } from '@/lib/supabase/client';
import { BookingForm } from '@/components/booking/BookingForm';
import type { Product } from '@/types/database';

const PageContainer = styled.div`
  background: ${ishigakiTheme.colors.background.primary};
  min-height: 100vh;
  padding-top: 70px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 800;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const SubTitle = styled.p`
  font-size: 18px;
  color: ${ishigakiTheme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-bottom: 48px;
  padding: 24px;
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 20px;
  box-shadow: ${ishigakiTheme.shadows.sm};
  
  @media (max-width: 768px) {
    gap: 16px;
    padding: 16px;
  }
`;

const Step = styled.div<{ active?: boolean; completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const StepNumber = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s ease;
  
  background: ${({ active, completed }) =>
    active
      ? `linear-gradient(135deg, ${ishigakiTheme.colors.semantic.tropical} 0%, ${ishigakiTheme.colors.brand.primary} 100%)`
      : completed
      ? ishigakiTheme.colors.semantic.tropical
      : ishigakiTheme.colors.background.secondary};
  color: ${({ active, completed }) =>
    active || completed ? 'white' : ishigakiTheme.colors.text.tertiary};
  border: 2px solid ${({ active, completed }) =>
    active || completed ? 'transparent' : ishigakiTheme.colors.border.light};
    
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
`;

const StepLabel = styled.span<{ active?: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${({ active }) =>
    active ? ishigakiTheme.colors.text.primary : ishigakiTheme.colors.text.tertiary};
    
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const StepDivider = styled.div`
  width: 40px;
  height: 2px;
  background: ${ishigakiTheme.colors.border.light};
  
  @media (max-width: 768px) {
    width: 20px;
  }
`;

const ContentSection = styled.div`
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 24px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const ProductCard = styled.div<{ selected?: boolean }>`
  border: 2px solid ${({ selected }) =>
    selected ? ishigakiTheme.colors.brand.primary : 'transparent'};
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const DateSection = styled.div`
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 20px;
  padding: 32px;
  box-shadow: ${ishigakiTheme.shadows.sm};
  margin-bottom: 32px;
`;

const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-top: 24px;
`;

const DateCell = styled.button<{ selected?: boolean; disabled?: boolean }>`
  aspect-ratio: 1;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  background: ${({ selected, disabled }) =>
    selected
      ? ishigakiTheme.colors.brand.primary
      : disabled
      ? ishigakiTheme.colors.background.secondary
      : ishigakiTheme.colors.background.glass};
  
  color: ${({ selected, disabled }) =>
    selected
      ? 'white'
      : disabled
      ? ishigakiTheme.colors.text.tertiary
      : ishigakiTheme.colors.text.primary};
  
  &:hover:not(:disabled) {
    background: ${({ selected }) =>
      selected
        ? ishigakiTheme.colors.brand.primary
        : ishigakiTheme.colors.background.tertiary};
    transform: scale(1.05);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const QuickBookingCard = styled.div`
  background: linear-gradient(135deg, 
    ${ishigakiTheme.colors.semantic.sand}20 0%, 
    ${ishigakiTheme.colors.semantic.tropical}20 100%);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  border: 1px solid ${ishigakiTheme.colors.border.light};
`;

interface BookingPageProps {}

export default function BookingPage({}: BookingPageProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    loadProducts();
    
    // URL에서 product_id 파라미터 확인
    const { product_id } = router.query;
    if (product_id && products.length > 0) {
      const product = products.find(p => p.id === product_id);
      if (product) {
        setSelectedProduct(product);
        setCurrentStep(2);
      }
    }
  }, [router.query]);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          shop:shops(name_ko, name_ja)
        `)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentStep(2);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentStep(3);
    setShowBookingForm(true);
  };

  const handleQuickBooking = () => {
    router.push('/products');
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.getDate().toString();
  };

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
        { label: '예약 확인', href: '/my-bookings' },
        { label: '취소/환불', href: '/refund' }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>예약하기 - Ocean Bridge</title>
        <meta name="description" content="이시가키 투어 예약" />
      </Head>

      <PageContainer>
        <IshigakiNavigation 
          logoText="Ocean Bridge"
          items={[
            { label: '홈', href: '/' },
            { label: '투어', href: '/products' },
            { label: '내 예약', href: '/my-bookings' },
            { label: '문의', href: '/contact' }
          ]}
          onItemClick={(href) => router.push(href)}
        />

        <Container>
          <Header>
            <Title>투어 예약하기</Title>
            <SubTitle>
              이시가키의 아름다운 바다와 자연을 경험해보세요
            </SubTitle>
          </Header>

          <StepIndicator>
            <Step active={currentStep === 1} completed={currentStep > 1}>
              <StepNumber active={currentStep === 1} completed={currentStep > 1}>
                {currentStep > 1 ? '✓' : '1'}
              </StepNumber>
              <StepLabel active={currentStep === 1}>투어 선택</StepLabel>
            </Step>
            
            <StepDivider />
            
            <Step active={currentStep === 2} completed={currentStep > 2}>
              <StepNumber active={currentStep === 2} completed={currentStep > 2}>
                {currentStep > 2 ? '✓' : '2'}
              </StepNumber>
              <StepLabel active={currentStep === 2}>날짜 선택</StepLabel>
            </Step>
            
            <StepDivider />
            
            <Step active={currentStep === 3}>
              <StepNumber active={currentStep === 3}>3</StepNumber>
              <StepLabel active={currentStep === 3}>정보 입력</StepLabel>
            </Step>
          </StepIndicator>

          {/* Step 1: 투어 선택 */}
          {currentStep === 1 && (
            <ContentSection>
              <SectionTitle>투어를 선택해주세요</SectionTitle>
              
              {loading ? (
                <div>로딩 중...</div>
              ) : products.length > 0 ? (
                <ProductGrid>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      selected={selectedProduct?.id === product.id}
                      onClick={() => handleProductSelect(product)}
                    >
                      <IshigakiCard
                        imageSrc={product.images?.[0] || '/images/placeholder.jpg'}
                        imageAlt={product.title_ko}
                        title={product.title_ko}
                        subtitle={product.shop?.name_ko}
                        description={product.description_ko || ''}
                        badges={[
                          { text: `${product.duration_minutes}분`, variant: 'ocean' },
                          { text: product.category, variant: 'sand' }
                        ]}
                        price={`₩${product.price_adult_krw?.toLocaleString()}`}
                        priceLabel="성인 1인"
                      />
                    </ProductCard>
                  ))}
                </ProductGrid>
              ) : (
                <QuickBookingCard>
                  <h3>아직 준비된 투어가 없습니다</h3>
                  <p style={{ marginTop: '16px', marginBottom: '24px' }}>
                    곧 다양한 투어가 준비될 예정입니다
                  </p>
                  <IshigakiButton
                    variant="ocean"
                    size="large"
                    onClick={() => router.push('/products')}
                  >
                    투어 둘러보기
                  </IshigakiButton>
                </QuickBookingCard>
              )}
            </ContentSection>
          )}

          {/* Step 2: 날짜 선택 */}
          {currentStep === 2 && selectedProduct && (
            <ContentSection>
              <SectionTitle>날짜를 선택해주세요</SectionTitle>
              
              <DateSection>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                    {selectedProduct.title_ko}
                  </h3>
                  <p style={{ color: ishigakiTheme.colors.text.secondary }}>
                    예약 가능한 날짜를 선택해주세요
                  </p>
                </div>
                
                <CalendarContainer>
                  {generateCalendarDays().map((date, index) => (
                    <DateCell
                      key={index}
                      selected={selectedDate?.toDateString() === date.toDateString()}
                      disabled={date.getDay() === 0} // 일요일 비활성화 (예시)
                      onClick={() => handleDateSelect(date)}
                    >
                      {formatDate(date)}
                    </DateCell>
                  ))}
                </CalendarContainer>
                
                <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
                  <IshigakiButton
                    variant="ghost"
                    size="medium"
                    onClick={() => {
                      setCurrentStep(1);
                      setSelectedProduct(null);
                    }}
                  >
                    이전
                  </IshigakiButton>
                  <IshigakiButton
                    variant="ocean"
                    size="medium"
                    disabled={!selectedDate}
                    onClick={() => {
                      if (selectedDate) {
                        setCurrentStep(3);
                        setShowBookingForm(true);
                      }
                    }}
                  >
                    다음
                  </IshigakiButton>
                </div>
              </DateSection>
            </ContentSection>
          )}

          {/* Step 3: 정보 입력 */}
          {currentStep === 3 && showBookingForm && selectedProduct && selectedDate && (
            <ContentSection>
              <SectionTitle>예약 정보를 입력해주세요</SectionTitle>
              <BookingForm
                productId={selectedProduct.id}
                productTitle={selectedProduct.title_ko}
                selectedDate={selectedDate.toISOString().split('T')[0]}
                priceAdult={selectedProduct.price_adult_krw || 0}
                priceChild={selectedProduct.price_child_krw || 0}
                onBack={() => {
                  setCurrentStep(2);
                  setShowBookingForm(false);
                }}
              />
            </ContentSection>
          )}

          {/* 빠른 예약 안내 */}
          {!showBookingForm && (
            <QuickBookingCard>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>
                원하는 투어를 찾고 계신가요? 🌴
              </h3>
              <p style={{ fontSize: '16px', color: ishigakiTheme.colors.text.secondary, marginBottom: '24px' }}>
                다양한 이시가키 투어를 둘러보고 완벽한 여행을 계획해보세요
              </p>
              <IshigakiButton
                variant="coral"
                size="large"
                onClick={handleQuickBooking}
              >
                모든 투어 보기
              </IshigakiButton>
            </QuickBookingCard>
          )}
        </Container>

        <Footer
          sections={footerSections}
          description="Ocean Bridge - 이시가키 여행의 모든 것"
        />
      </PageContainer>
    </>
  );
}