import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import { Button, Card, Badge, Text, Hero, Footer, PriceRangeFilter } from '@/components';
import IshigakiNavigation from '@/components/ishigaki/IshigakiNavigation';
import IshigakiCard from '@/components/ishigaki/IshigakiCard';
import { ishigakiTheme } from '@/styles/ishigaki-theme';
import { supabase } from '@/lib/supabase/client';
import type { Product } from '@/types/database';

// Styled Components
const PageContainer = styled.div`
  background: ${ishigakiTheme.colors.background.primary};
  min-height: 100vh;
  padding-top: 70px; /* For fixed navigation */
`;

const FilterSection = styled.aside`
  position: sticky;
  top: 90px;
  height: fit-content;
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${ishigakiTheme.shadows.sm};
  border: 1px solid ${ishigakiTheme.colors.border.light};
`;

const MainContent = styled.main`
  flex: 1;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const FilterTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  color: ${ishigakiTheme.colors.brand.primary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${ishigakiTheme.colors.brand.accent};
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 32px;
`;

const FilterLabel = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${ishigakiTheme.colors.text.secondary};
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterChip = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid ${({ active }) => active ? ishigakiTheme.colors.brand.primary : ishigakiTheme.colors.border.light};
  background: ${({ active }) => active ? ishigakiTheme.colors.brand.primary : 'white'};
  color: ${({ active }) => active ? 'white' : ishigakiTheme.colors.text.secondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${ishigakiTheme.colors.brand.primary};
    transform: translateY(-2px);
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ResultsCount = styled.p`
  font-size: 16px;
  color: ${ishigakiTheme.colors.text.secondary};
`;

const SortDropdown = styled.select`
  padding: 8px 16px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${ishigakiTheme.colors.brand.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: ${ishigakiTheme.colors.background.secondary};
  border-radius: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
`;

const EmptyTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 12px;
`;

const EmptyDescription = styled.p`
  font-size: 16px;
  color: ${ishigakiTheme.colors.text.secondary};
`;


interface FilterState {
  categories: string[];
  difficulty: string[];
  priceMin: number;
  priceMax: number;
  duration: string;
}

export default function ProductsPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    difficulty: [],
    priceMin: 0,
    priceMax: 500000,
    duration: 'all',
  });

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleDifficulty = (level: string) => {
    setFilters(prev => ({
      ...prev,
      difficulty: prev.difficulty.includes(level)
        ? prev.difficulty.filter(d => d !== level)
        : [...prev.difficulty, level]
    }));
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      difficulty: [],
      priceMin: 0,
      priceMax: 500000,
      duration: 'all',
    });
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => 
        p.category && filters.categories.includes(p.category)
      );
    }

    // Difficulty filter
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(p => 
        p.difficulty && filters.difficulty.includes(p.difficulty)
      );
    }

    // Price filter
    filtered = filtered.filter(p => {
      const price = p.price_adult_krw || 0;
      return price >= filters.priceMin && price <= filters.priceMax;
    });

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price_adult_krw || 0) - (b.price_adult_krw || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price_adult_krw || 0) - (a.price_adult_krw || 0));
        break;
      case 'duration':
        filtered.sort((a, b) => (a.duration_minutes || 0) - (b.duration_minutes || 0));
        break;
    }

    setFilteredProducts(filtered);
  }, [filters, products, sortBy]);

  // Check for category query param
  useEffect(() => {
    if (router.query.category) {
      const category = router.query.category as string;
      setFilters(prev => ({
        ...prev,
        categories: [category]
      }));
    }
  }, [router.query]);

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
        <title>{t('navigation.products')} - Ishigaki Connect</title>
        <meta name="description" content="이시가키의 다양한 액티비티와 투어를 예약하세요" />
      </Head>

      <PageContainer>
        <IshigakiNavigation 
          logoText="Ishigaki Connect"
          items={[
            { label: '홈', href: '/' },
            { label: '투어', href: '/products', active: true },
            { label: '소개', href: '/about' },
            { label: '문의', href: '/contact' }
          ]}
          onItemClick={handleNavClick} 
        />

        <Hero
          title="이시가키 투어"
          description="카비라만의 에메랄드빛 바다부터 밤하늘의 은하수까지, 이시가키의 모든 체험을 한국어로 예약하세요"
          backgroundImage="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=600&fit=crop"
          backgroundOverlay={true}
          variant="centered"
          size="small"
        />

        <Container>
          <ContentWrapper>
            {/* Filter Sidebar */}
            <FilterSection>
              <FilterHeader>
                <FilterTitle>필터</FilterTitle>
                <ResetButton onClick={resetFilters}>초기화</ResetButton>
              </FilterHeader>

              {/* Categories */}
              <FilterGroup>
                <FilterLabel>카테고리</FilterLabel>
                <FilterOptions>
                  {[
                    { value: 'snorkel', label: '스노클링', icon: '🏊' },
                    { value: 'diving', label: '다이빙', icon: '🤿' },
                    { value: 'sup', label: 'SUP', icon: '🏄' },
                    { value: 'kayak', label: '카약', icon: '🚣' },
                    { value: 'stargazing', label: '별 관측', icon: '⭐' },
                    { value: 'glassboat', label: '글라스보트', icon: '🚢' },
                    { value: 'iriomote', label: '이리오모테', icon: '🏝️' },
                  ].map(cat => (
                    <FilterChip
                      key={cat.value}
                      active={filters.categories.includes(cat.value)}
                      onClick={() => toggleCategory(cat.value)}
                    >
                      {cat.icon} {cat.label}
                    </FilterChip>
                  ))}
                </FilterOptions>
              </FilterGroup>

              {/* Difficulty */}
              <FilterGroup>
                <FilterLabel>난이도</FilterLabel>
                <FilterOptions>
                  {[
                    { value: 'all', label: '모든 레벨' },
                    { value: 'beginner', label: '초급' },
                    { value: 'intermediate', label: '중급' },
                    { value: 'advanced', label: '상급' },
                  ].map(level => (
                    <FilterChip
                      key={level.value}
                      active={filters.difficulty.includes(level.value)}
                      onClick={() => toggleDifficulty(level.value)}
                    >
                      {level.label}
                    </FilterChip>
                  ))}
                </FilterOptions>
              </FilterGroup>

              {/* Price Range */}
              <FilterGroup>
                <FilterLabel>가격대</FilterLabel>
                <PriceRangeFilter
                  min={0}
                  max={500000}
                  defaultMin={filters.priceMin}
                  defaultMax={filters.priceMax}
                  step={5000}
                  onChange={(min, max) => {
                    setFilters(prev => ({
                      ...prev,
                      priceMin: min,
                      priceMax: max
                    }));
                  }}
                />
              </FilterGroup>
            </FilterSection>

            {/* Products Grid */}
            <MainContent>
              <ResultsHeader>
                <ResultsCount>{filteredProducts.length}개의 투어</ResultsCount>
                <SortDropdown value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="popular">인기순</option>
                  <option value="price-low">가격 낮은순</option>
                  <option value="price-high">가격 높은순</option>
                  <option value="duration">소요시간순</option>
                </SortDropdown>
              </ResultsHeader>

              {loading ? (
                <EmptyState>
                  <EmptyIcon>⏳</EmptyIcon>
                  <EmptyTitle>투어를 불러오는 중...</EmptyTitle>
                  <EmptyDescription>잠시만 기다려주세요</EmptyDescription>
                </EmptyState>
              ) : filteredProducts.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>🔍</EmptyIcon>
                  <EmptyTitle>조건에 맞는 투어가 없습니다</EmptyTitle>
                  <EmptyDescription>다른 필터 조건으로 검색해보세요</EmptyDescription>
                </EmptyState>
              ) : (
                <ProductGrid>
                  {filteredProducts.map(product => (
                    <IshigakiCard
                      key={product.id}
                      variant={product.is_popular ? 'coral' : 'default'}
                      image={product.images?.[0]}
                      title={product.title_ko}
                      description={product.description_ko}
                      price={product.price_adult_krw?.toLocaleString()}
                      badge={
                        product.difficulty === 'beginner' ? '초급' :
                        product.difficulty === 'intermediate' ? '중급' :
                        product.difficulty === 'advanced' ? '상급' : '모든 레벨'
                      }
                      popular={product.is_popular}
                      onClick={() => router.push(`/products/${product.id}`)}
                    />
                  ))}
                </ProductGrid>
              )}
            </MainContent>
          </ContentWrapper>
        </Container>

        <Footer
          sections={footerSections}
          description="Ishigaki Connect - 한국 여행자와 이시가키를 연결합니다"
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