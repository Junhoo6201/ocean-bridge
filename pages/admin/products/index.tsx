import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Button, Badge, Text } from '@/components';
import IshigakiNavigation from '@/components/ishigaki/IshigakiNavigation';
import IshigakiButton from '@/components/ishigaki/IshigakiButton';
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${ishigakiTheme.colors.text.primary};
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: ${ishigakiTheme.colors.background.elevated};
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
`;

const StatLabel = styled.p`
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.tertiary};
  margin-bottom: 8px;
`;

const StatValue = styled.p`
  font-size: 32px;
  font-weight: 800;
  color: ${ishigakiTheme.colors.brand.primary};
`;

const TableContainer = styled.div`
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${ishigakiTheme.colors.border.light};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${ishigakiTheme.colors.background.secondary};
  border-bottom: 2px solid ${ishigakiTheme.colors.border.light};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${ishigakiTheme.colors.border.light};
  
  &:hover {
    background: ${ishigakiTheme.colors.background.secondary};
  }
`;

const TableHead = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: ${ishigakiTheme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.primary};
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  background: white;
  color: ${ishigakiTheme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${ishigakiTheme.colors.background.secondary};
    transform: translateY(-1px);
  }
  
  &.delete {
    color: ${ishigakiTheme.colors.semantic.coral};
    border-color: ${ishigakiTheme.colors.semantic.coral};
    
    &:hover {
      background: ${ishigakiTheme.colors.semantic.coral};
      color: white;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
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
  margin-bottom: 24px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  font-size: 18px;
  color: ${ishigakiTheme.colors.text.secondary};
`;

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    popular: 0,
    categories: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setProducts(data);
        
        // Calculate stats
        const uniqueCategories = new Set(data.map(p => p.category).filter(Boolean));
        setStats({
          total: data.length,
          active: data.filter(p => p.is_active).length,
          popular: data.filter(p => p.is_popular).length,
          categories: uniqueCategories.size
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('상품이 삭제되었습니다.');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleTogglePopular = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_popular: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  return (
    <>
      <Head>
        <title>상품 관리 - Ishigaki Connect Admin</title>
      </Head>

      <PageContainer>
        <IshigakiNavigation 
          logoText="Ishigaki Admin"
          items={[
            { label: '대시보드', href: '/admin' },
            { label: '상품 관리', href: '/admin/products', active: true },
            { label: '예약 관리', href: '/admin/bookings' },
            { label: '사이트로 돌아가기', href: '/' }
          ]}
          onItemClick={handleNavClick} 
        />

        <Container>
          <Header>
            <Title>상품 관리</Title>
            <IshigakiButton
              variant="coral"
              size="medium"
              onClick={() => router.push('/admin/products/new')}
            >
              + 새 상품 추가
            </IshigakiButton>
          </Header>

          <Stats>
            <StatCard>
              <StatLabel>전체 상품</StatLabel>
              <StatValue>{stats.total}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>활성 상품</StatLabel>
              <StatValue>{stats.active}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>인기 상품</StatLabel>
              <StatValue>{stats.popular}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>카테고리</StatLabel>
              <StatValue>{stats.categories}</StatValue>
            </StatCard>
          </Stats>

          <TableContainer>
            {loading ? (
              <LoadingContainer>데이터를 불러오는 중...</LoadingContainer>
            ) : products.length === 0 ? (
              <EmptyState>
                <EmptyIcon>📦</EmptyIcon>
                <EmptyTitle>상품이 없습니다</EmptyTitle>
                <EmptyDescription>새로운 상품을 추가해보세요</EmptyDescription>
                <IshigakiButton
                  variant="ocean"
                  size="medium"
                  onClick={() => router.push('/admin/products/new')}
                >
                  첫 상품 추가하기
                </IshigakiButton>
              </EmptyState>
            ) : (
              <Table>
                <TableHeader>
                  <tr>
                    <TableHead>이미지</TableHead>
                    <TableHead>상품명</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>가격</TableHead>
                    <TableHead>시간</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>인기</TableHead>
                    <TableHead>액션</TableHead>
                  </tr>
                </TableHeader>
                <tbody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.images?.[0] ? (
                          <ProductImage src={product.images[0]} alt={product.title_ko} />
                        ) : (
                          <div style={{ width: 60, height: 60, background: ishigakiTheme.colors.background.secondary, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            🌊
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div style={{ fontWeight: 600 }}>{product.title_ko}</div>
                          <div style={{ fontSize: '12px', color: ishigakiTheme.colors.text.tertiary }}>
                            {product.title_ja}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="primary" size="small">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        ₩{product.price_adult_krw?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {product.duration_minutes}분
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.is_active ? "success" : "secondary"} 
                          size="small"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleToggleActive(product.id, product.is_active)}
                        >
                          {product.is_active ? '활성' : '비활성'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.is_popular ? "coral" : "secondary"} 
                          size="small"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleTogglePopular(product.id, product.is_popular)}
                        >
                          {product.is_popular ? '인기' : '일반'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ActionButtons>
                          <ActionButton onClick={() => router.push(`/admin/products/${product.id}`)}>
                            수정
                          </ActionButton>
                          <ActionButton className="delete" onClick={() => handleDelete(product.id)}>
                            삭제
                          </ActionButton>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}
          </TableContainer>
        </Container>
      </PageContainer>
    </>
  );
}