import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import { Button, Card, Badge, Text, Footer } from '@/components';
import IshigakiNavigation from '@/components/ishigaki/IshigakiNavigation';
import IshigakiCard from '@/components/ishigaki/IshigakiCard';
import IshigakiButton from '@/components/ishigaki/IshigakiButton';
import { BookingForm } from '@/components/booking/BookingForm';
import { ishigakiTheme } from '@/styles/ishigaki-theme';
import { supabase } from '@/lib/supabase/client';
import type { Product } from '@/types/database';

// Styled Components
const PageContainer = styled.div`
  background: ${ishigakiTheme.colors.background.primary};
  min-height: 100vh;
  padding-top: 70px;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${ishigakiTheme.colors.text.secondary};
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 32px;
  transition: all 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  
  &:hover {
    color: ${ishigakiTheme.colors.brand.primary};
    transform: translateX(-4px);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MainImage = styled.div`
  position: relative;
  height: 500px;
  border-radius: 16px;
  overflow: hidden;
  background: ${ishigakiTheme.colors.background.secondary};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ThumbnailGrid = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${ishigakiTheme.colors.background.secondary};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${ishigakiTheme.colors.brand.primary};
    border-radius: 3px;
  }
`;

const Thumbnail = styled.button<{ active: boolean }>`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  border: ${({ active }) => active ? `3px solid ${ishigakiTheme.colors.brand.primary}` : `1px solid ${ishigakiTheme.colors.border.light}`};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
    border-color: ${ishigakiTheme.colors.brand.primary};
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${ishigakiTheme.colors.text.primary};
  line-height: 1.2;
  margin: 0;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.8;
  color: ${ishigakiTheme.colors.text.secondary};
`;

const DetailSection = styled.div<{ variant?: 'default' | 'accent' | 'warning' }>`
  padding: 24px;
  border-radius: 16px;
  background: ${({ variant }) => {
    switch (variant) {
      case 'accent':
        return ishigakiTheme.colors.background.elevated;
      case 'warning':
        return ishigakiTheme.colors.semantic.sand;
      default:
        return ishigakiTheme.colors.background.secondary;
    }
  }};
  border: 1px solid ${ishigakiTheme.colors.border.light};
`;

const DetailTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DetailItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: ${ishigakiTheme.colors.text.secondary};
  
  &::before {
    content: '•';
    color: ${ishigakiTheme.colors.brand.primary};
    font-weight: bold;
    margin-top: 2px;
  }
`;

const BookingCard = styled.div`
  position: sticky;
  top: 90px;
  height: fit-content;
`;

const PriceSection = styled.div`
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${ishigakiTheme.colors.border.light};
`;

const PriceLabel = styled.p`
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.tertiary};
  margin-bottom: 8px;
`;

const Price = styled.div`
  font-size: 36px;
  font-weight: 800;
  color: ${ishigakiTheme.colors.brand.primary};
  margin-bottom: 4px;
`;

const PriceUnit = styled.span`
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.tertiary};
  font-weight: 500;
`;

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.tertiary};
`;

const InfoValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${ishigakiTheme.colors.text.primary};
`;

const ContactBox = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: ${ishigakiTheme.colors.background.secondary};
  border-radius: 12px;
  text-align: center;
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.secondary};
`;

const RelatedSection = styled.section`
  margin-top: 80px;
  padding-top: 40px;
  border-top: 1px solid ${ishigakiTheme.colors.border.light};
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 32px;
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

interface ProductDetailPageProps {
  product: Product;
  relatedProducts: Array<{
    id: string;
    title_ko: string;
    description_ko: string;
    price_adult_krw: number | null;
    category: string;
    difficulty: string;
    images: string[] | null;
  }>;
}

export default function ProductDetailPage({ product, relatedProducts }: ProductDetailPageProps) {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const isKorean = i18n.language === 'ko';
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // JSON 파싱 안전하게 처리
  const parseJsonSafely = (data: string | null, defaultValue: any[] = []) => {
    if (!data) return defaultValue;
    try {
      // 이미 배열인 경우
      if (Array.isArray(data)) return data;
      // JSON 문자열인 경우
      if (data.startsWith('[') || data.startsWith('{')) {
        return JSON.parse(data);
      }
      // 쉼표로 구분된 문자열인 경우
      if (data.includes(',')) {
        return data.split(',').map(item => item.trim());
      }
      // 단일 문자열인 경우
      return [data];
    } catch (error) {
      console.error('JSON parse error:', error, 'Data:', data);
      // 파싱 실패시 문자열을 그대로 배열에 넣어 반환
      return [data];
    }
  };

  const includes = parseJsonSafely(isKorean ? product.includes_ko : product.includes_ja);
  const excludes = parseJsonSafely(isKorean ? product.excludes_ko : product.excludes_ja);
  const preparation = parseJsonSafely(isKorean ? product.preparation_ko : product.preparation_ja);

  const handleNavClick = (href: string) => {
    router.push(href);
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
        { label: '예약 확인', href: '/booking' },
        { label: '취소/환불', href: '/refund' }
      ]
    },
    {
      title: '인기 투어',
      links: [
        { label: '카비라만 스노클링', href: '/products?category=snorkel' },
        { label: '맨타 다이빙', href: '/products?category=diving' },
        { label: '별 관측 투어', href: '/products?category=stargazing' }
      ]
    }
  ];


  return (
    <>
      <Head>
        <title>{isKorean ? product.title_ko : product.title_ja} - Ishigaki Connect</title>
        <meta name="description" content={isKorean ? product.description_ko : product.description_ja} />
      </Head>

      <PageContainer>
        <IshigakiNavigation 
          logoText="Ishigaki Connect"
          items={[
            { label: '홈', href: '/' },
            { label: '투어', href: '/products' },
            { label: '소개', href: '/about' },
            { label: '문의', href: '/contact' }
          ]}
          onItemClick={handleNavClick} 
        />

        <Container>
          <BackButton onClick={() => router.back()}>
            ← 이전으로
          </BackButton>

          <ContentGrid>
            {/* Left Column - Images & Info */}
            <MainContent>
              {/* Image Gallery */}
              <ImageGallery>
                <MainImage>
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[selectedImage]}
                      alt={isKorean ? product.title_ko : product.title_ja}
                    />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '80px' }}>🌊</span>
                    </div>
                  )}
                </MainImage>

                {product.images && product.images.length > 1 && (
                  <ThumbnailGrid>
                    {product.images.map((image, index) => (
                      <Thumbnail
                        key={index}
                        active={selectedImage === index}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img src={image} alt={`${index + 1}`} />
                      </Thumbnail>
                    ))}
                  </ThumbnailGrid>
                )}
              </ImageGallery>

              {/* Product Info */}
              <ProductInfo>
                <div>
                  <Title>{isKorean ? product.title_ko : product.title_ja}</Title>
                  
                  <BadgeContainer>
                    <Badge variant="coral" size="medium">
                      {product.category === 'snorkel' ? '스노클링' : 
                       product.category === 'diving' ? '다이빙' : 
                       product.category === 'sup' ? 'SUP' : 
                       product.category === 'stargazing' ? '별 관측' : product.category}
                    </Badge>
                    <Badge variant="primary" size="medium">
                      {product.difficulty === 'beginner' ? '초급' :
                       product.difficulty === 'intermediate' ? '중급' :
                       product.difficulty === 'advanced' ? '상급' : '모든 레벨'}
                    </Badge>
                    <Badge variant="secondary" size="medium">
                      {product.duration_minutes}분
                    </Badge>
                  </BadgeContainer>

                  <Description>
                    {isKorean ? product.description_ko : product.description_ja}
                  </Description>
                </div>

                {/* Details Sections */}
                <DetailSection>
                  <DetailTitle>
                    <span>✅</span> 포함사항
                  </DetailTitle>
                  <DetailList>
                    {includes.map((item: string, index: number) => (
                      <DetailItem key={index}>{item}</DetailItem>
                    ))}
                  </DetailList>
                </DetailSection>

                <DetailSection variant="accent">
                  <DetailTitle>
                    <span>❌</span> 불포함사항
                  </DetailTitle>
                  <DetailList>
                    {excludes.map((item: string, index: number) => (
                      <DetailItem key={index}>{item}</DetailItem>
                    ))}
                  </DetailList>
                </DetailSection>

                <DetailSection variant="warning">
                  <DetailTitle>
                    <span>🎒</span> 준비물
                  </DetailTitle>
                  <DetailList>
                    {preparation.map((item: string, index: number) => (
                      <DetailItem key={index}>{item}</DetailItem>
                    ))}
                  </DetailList>
                </DetailSection>

                <DetailSection variant="accent">
                  <DetailTitle>
                    <span>📍</span> 미팅 장소
                  </DetailTitle>
                  <p style={{ color: ishigakiTheme.colors.text.secondary }}>
                    {isKorean ? product.meeting_point_detail_ko : product.meeting_point_detail_ja}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="small" 
                    style={{ marginTop: '12px' }}
                  >
                    지도에서 보기 →
                  </Button>
                </DetailSection>
              </ProductInfo>
            </MainContent>

            {/* Right Column - Booking Card */}
            <BookingCard>
              {!showBookingForm ? (
                <div 
                  style={{
                    background: ishigakiTheme.colors.background.elevated,
                    borderRadius: '20px',
                    padding: '32px',
                    boxShadow: ishigakiTheme.shadows.lg,
                    border: `1px solid ${ishigakiTheme.colors.border.light}`,
                  }}
                >
                  <PriceSection>
                    <PriceLabel>1인 기준</PriceLabel>
                    <Price>₩{product.price_adult_krw?.toLocaleString()}</Price>
                    <PriceUnit>성인 / 1인</PriceUnit>
                    {product.price_child_krw && (
                      <p style={{ fontSize: '14px', color: ishigakiTheme.colors.text.secondary, marginTop: '8px' }}>
                        어린이: ₩{product.price_child_krw.toLocaleString()}
                      </p>
                    )}
                  </PriceSection>

                  <InfoGrid>
                    <InfoRow>
                      <InfoLabel>소요시간</InfoLabel>
                      <InfoValue>{product.duration_minutes}분</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>최소 인원</InfoLabel>
                      <InfoValue>{product.min_participants || 2}명</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>최대 인원</InfoLabel>
                      <InfoValue>{product.max_participants || 10}명</InfoValue>
                    </InfoRow>
                  </InfoGrid>

                  <IshigakiButton
                    variant="coral"
                    size="large"
                    glow
                    style={{ width: '100%' }}
                    onClick={() => setShowBookingForm(true)}
                  >
                    예약하기
                  </IshigakiButton>

                  <ContactBox>
                    문의: 카카오톡 @ishigaki-connect
                  </ContactBox>
                </div>
              ) : (
                <BookingForm product={product} />
              )}
            </BookingCard>
          </ContentGrid>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <RelatedSection>
              <SectionTitle>추천 투어</SectionTitle>
              <RelatedGrid>
                {relatedProducts.map((related) => (
                  <IshigakiCard
                    key={related.id}
                    variant="default"
                    image={related.images?.[0]}
                    title={related.title_ko}
                    description={related.description_ko}
                    price={related.price_adult_krw?.toLocaleString()}
                    badge={
                      related.difficulty === 'beginner' ? '초급' :
                      related.difficulty === 'intermediate' ? '중급' :
                      related.difficulty === 'advanced' ? '상급' : '모든 레벨'
                    }
                    onClick={() => router.push(`/products/${related.id}`)}
                  />
                ))}
              </RelatedGrid>
            </RelatedSection>
          )}
        </Container>

        <Footer
          sections={footerSections}
          description="Ishigaki Connect - 한국 여행자와 이시가키를 연결합니다"
        />
      </PageContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const productId = params?.id as string;
  
  try {
    // Fetch product from Supabase
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error || !product) {
      return {
        notFound: true,
      };
    }

    // Fetch related products
    const { data: relatedProducts } = await supabase
      .from('products')
      .select('id, title_ko, description_ko, price_adult_krw, category, difficulty, images')
      .eq('is_active', true)
      .neq('id', productId)
      .limit(3);

    return {
      props: {
        product,
        relatedProducts: relatedProducts || [],
        ...(await serverSideTranslations(locale || 'ko', ['common'])),
      },
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      notFound: true,
    };
  }
};