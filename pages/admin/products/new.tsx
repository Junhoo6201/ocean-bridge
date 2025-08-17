import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Button, Input, Badge } from '@/components';
import IshigakiNavigation from '@/components/ishigaki/IshigakiNavigation';
import IshigakiButton from '@/components/ishigaki/IshigakiButton';
import ImageUploader from '@/components/admin/ImageUploader';
import ListManager from '@/components/admin/ListManager';
import { ishigakiTheme } from '@/styles/ishigaki-theme';
import { supabase } from '@/lib/supabase/client';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import type { Product } from '@/types/database';

// Styled Components
const PageContainer = styled.div`
  background: ${ishigakiTheme.colors.background.primary};
  min-height: 100vh;
  padding-top: 70px;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${ishigakiTheme.colors.text.secondary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const FormSection = styled.div`
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 16px;
  padding: 32px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 24px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${ishigakiTheme.colors.text.primary};
`;

const StyledInput = styled.input`
  padding: 12px 16px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${ishigakiTheme.colors.brand.primary};
    box-shadow: 0 0 0 3px rgba(38, 208, 206, 0.1);
  }
`;

const StyledTextarea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 8px;
  font-size: 14px;
  background: white;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${ishigakiTheme.colors.brand.primary};
    box-shadow: 0 0 0 3px rgba(38, 208, 206, 0.1);
  }
`;

const StyledSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${ishigakiTheme.colors.brand.primary};
    box-shadow: 0 0 0 3px rgba(38, 208, 206, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.primary};
  
  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
`;

function AdminProductNewPageContent() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title_ko: '',
    title_ja: '',
    description_ko: '',
    description_ja: '',
    category: 'snorkel',
    difficulty: 'beginner',
    duration_minutes: 120,
    price_adult_krw: 0,
    price_child_krw: 0,
    max_participants: 10,
    min_participants: 2,
    meeting_point_detail_ko: '',
    meeting_point_detail_ja: '',
    is_active: true,
    is_popular: false,
    images: [] as string[],
    includes_ko: [] as string[],
    includes_ja: [] as string[],
    excludes_ko: [] as string[],
    excludes_ja: [] as string[],
    preparation_ko: [] as string[],
    preparation_ja: [] as string[]
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 현재 사용자 확인 (옵션)
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      // Shop ID를 null로 설정 (외래키 제약이 없을 경우)
      // 또는 기존 샵 조회
      let shopId = null;
      
      const { data: shops, error: shopError } = await supabase
        .from('shops')
        .select('id')
        .limit(1);

      if (!shopError && shops && shops.length > 0) {
        shopId = shops[0].id;
        console.log('Using existing shop:', shopId);
      } else {
        console.log('No shop found, using null shop_id');
      }

      const productData = {
        ...formData,
        includes_ko: JSON.stringify(formData.includes_ko),
        includes_ja: JSON.stringify(formData.includes_ja),
        excludes_ko: JSON.stringify(formData.excludes_ko),
        excludes_ja: JSON.stringify(formData.excludes_ja),
        preparation_ko: JSON.stringify(formData.preparation_ko),
        preparation_ja: JSON.stringify(formData.preparation_ja),
        shop_id: shopId, // 기본 샵 ID 사용
        price_adult_jpy: Math.round(formData.price_adult_krw / 10), // KRW to JPY 대략 변환
        price_child_jpy: formData.price_child_krw ? Math.round(formData.price_child_krw / 10) : null,
        meeting_point_id: null,
        age_limit_min: null,
        age_limit_max: null,
        display_order: 0
      };

      console.log('Inserting product with data:', productData);
      
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      alert('상품이 추가되었습니다!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      
      // 더 자세한 오류 메시지 표시
      let errorMessage = '상품 추가 중 오류가 발생했습니다.\n';
      
      if (error.message) {
        errorMessage += `\n오류: ${error.message}`;
      }
      
      if (error.code) {
        errorMessage += `\n코드: ${error.code}`;
      }
      
      if (error.details) {
        errorMessage += `\n상세: ${error.details}`;
      }
      
      // Supabase 특정 오류 처리
      if (error.message?.includes('new row violates row-level security policy')) {
        errorMessage = '권한이 없습니다. 관리자로 로그인했는지 확인해주세요.';
      } else if (error.message?.includes('violates foreign key constraint')) {
        errorMessage = '필요한 참조 데이터가 없습니다. Shop이 존재하는지 확인해주세요.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  return (
    <>
      <Head>
        <title>새 상품 추가 - Ishigaki Connect Admin</title>
      </Head>

      <PageContainer>
        <IshigakiNavigation 
          logoText="Ishigaki Admin"
          items={[
            { label: '대시보드', href: '/admin' },
            { label: '상품 관리', href: '/admin/products' },
            { label: '예약 관리', href: '/admin/bookings' },
            { label: '사이트로 돌아가기', href: '/' }
          ]}
          onItemClick={handleNavClick} 
        />

        <Container>
          <Header>
            <Title>새 상품 추가</Title>
            <Subtitle>새로운 투어 상품을 등록합니다</Subtitle>
          </Header>

          <Form onSubmit={handleSubmit}>
            {/* 기본 정보 */}
            <FormSection>
              <SectionTitle>기본 정보</SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label>상품명 (한국어) *</Label>
                  <StyledInput
                    type="text"
                    value={formData.title_ko}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_ko: e.target.value }))}
                    required
                    placeholder="예: 카비라만 스노클링 투어"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>상품명 (일본어) *</Label>
                  <StyledInput
                    type="text"
                    value={formData.title_ja}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_ja: e.target.value }))}
                    required
                    placeholder="예: 川平湾シュノーケリングツアー"
                  />
                </FormGroup>
              </FormGrid>

              <FormGroup style={{ marginTop: '24px' }}>
                <Label>설명 (한국어) *</Label>
                <StyledTextarea
                  value={formData.description_ko}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_ko: e.target.value }))}
                  required
                  placeholder="상품에 대한 자세한 설명을 입력하세요"
                />
              </FormGroup>

              <FormGroup>
                <Label>설명 (일본어) *</Label>
                <StyledTextarea
                  value={formData.description_ja}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_ja: e.target.value }))}
                  required
                  placeholder="商品の詳細説明を入力してください"
                />
              </FormGroup>

              <FormGrid style={{ marginTop: '24px' }}>
                <FormGroup>
                  <Label>카테고리 *</Label>
                  <StyledSelect
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="snorkel">스노클링</option>
                    <option value="diving">다이빙</option>
                    <option value="sup">SUP</option>
                    <option value="kayak">카약</option>
                    <option value="stargazing">별 관측</option>
                    <option value="glassboat">글라스보트</option>
                    <option value="iriomote">이리오모테</option>
                  </StyledSelect>
                </FormGroup>
                <FormGroup>
                  <Label>난이도 *</Label>
                  <StyledSelect
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                  >
                    <option value="all">모든 레벨</option>
                    <option value="beginner">초급</option>
                    <option value="intermediate">중급</option>
                    <option value="advanced">상급</option>
                  </StyledSelect>
                </FormGroup>
              </FormGrid>
            </FormSection>

            {/* 가격 및 인원 */}
            <FormSection>
              <SectionTitle>가격 및 인원</SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label>성인 가격 (KRW) *</Label>
                  <StyledInput
                    type="number"
                    value={formData.price_adult_krw}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_adult_krw: Number(e.target.value) }))}
                    required
                    min="0"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>어린이 가격 (KRW)</Label>
                  <StyledInput
                    type="number"
                    value={formData.price_child_krw}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_child_krw: Number(e.target.value) }))}
                    min="0"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>소요 시간 (분) *</Label>
                  <StyledInput
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: Number(e.target.value) }))}
                    required
                    min="30"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>최대 인원</Label>
                  <StyledInput
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_participants: Number(e.target.value) }))}
                    min="1"
                  />
                </FormGroup>
              </FormGrid>
            </FormSection>

            {/* 이미지 */}
            <FormSection>
              <SectionTitle>이미지</SectionTitle>
              <ImageUploader
                images={formData.images}
                onChange={(images) => setFormData(prev => ({ ...prev, images }))}
                maxImages={10}
              />
            </FormSection>

            {/* 포함/불포함 사항 */}
            <FormSection>
              <SectionTitle>포함/불포함 사항</SectionTitle>
              
              <FormGroup>
                <Label>포함사항 (한국어)</Label>
                <ListManager
                  items={formData.includes_ko}
                  onChange={(items) => setFormData(prev => ({ ...prev, includes_ko: items }))}
                  placeholder="예: 스노클링 장비, 가이드, 픽업 서비스"
                  buttonText="추가"
                  emptyText="포함사항을 추가해주세요"
                />
              </FormGroup>

              <FormGroup>
                <Label>포함사항 (일본어)</Label>
                <ListManager
                  items={formData.includes_ja}
                  onChange={(items) => setFormData(prev => ({ ...prev, includes_ja: items }))}
                  placeholder="例: シュノーケリング器材、ガイド、送迎サービス"
                  buttonText="追加"
                  emptyText="含まれる内容を追加してください"
                />
              </FormGroup>

              <FormGroup>
                <Label>불포함사항 (한국어)</Label>
                <ListManager
                  items={formData.excludes_ko}
                  onChange={(items) => setFormData(prev => ({ ...prev, excludes_ko: items }))}
                  placeholder="예: 수영복, 타올, 점심 식사"
                  buttonText="추가"
                  emptyText="불포함사항을 추가해주세요"
                />
              </FormGroup>

              <FormGroup>
                <Label>불포함사항 (일본어)</Label>
                <ListManager
                  items={formData.excludes_ja}
                  onChange={(items) => setFormData(prev => ({ ...prev, excludes_ja: items }))}
                  placeholder="例: 水着、タオル、昼食"
                  buttonText="追加"
                  emptyText="含まれない内容を追加してください"
                />
              </FormGroup>
            </FormSection>

            {/* 준비물 */}
            <FormSection>
              <SectionTitle>준비물</SectionTitle>
              
              <FormGroup>
                <Label>준비물 (한국어)</Label>
                <ListManager
                  items={formData.preparation_ko}
                  onChange={(items) => setFormData(prev => ({ ...prev, preparation_ko: items }))}
                  placeholder="예: 수영복, 타올, 선크림"
                  buttonText="추가"
                  emptyText="준비물을 추가해주세요"
                />
              </FormGroup>

              <FormGroup>
                <Label>준비물 (일본어)</Label>
                <ListManager
                  items={formData.preparation_ja}
                  onChange={(items) => setFormData(prev => ({ ...prev, preparation_ja: items }))}
                  placeholder="例: 水着、タオル、日焼け止め"
                  buttonText="追加"
                  emptyText="持ち物を追加してください"
                />
              </FormGroup>
            </FormSection>

            {/* 상태 */}
            <FormSection>
              <SectionTitle>상태</SectionTitle>
              <CheckboxGroup>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                  활성 상품
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={formData.is_popular}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_popular: e.target.checked }))}
                  />
                  인기 상품
                </CheckboxLabel>
              </CheckboxGroup>
            </FormSection>

            <FormActions>
              <Button
                variant="secondary"
                size="medium"
                onClick={() => router.push('/admin/products')}
                type="button"
              >
                취소
              </Button>
              <IshigakiButton
                variant="coral"
                size="medium"
                type="submit"
                disabled={loading}
              >
                {loading ? '저장 중...' : '상품 추가'}
              </IshigakiButton>
            </FormActions>
          </Form>
        </Container>
      </PageContainer>
    </>
  );
}

export default function AdminProductNewPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminProductNewPageContent />
    </ProtectedRoute>
  );
}