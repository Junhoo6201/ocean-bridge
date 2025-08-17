import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Badge } from '@/components';
import IshigakiNavigation from '@/components/ishigaki/IshigakiNavigation';
import IshigakiButton from '@/components/ishigaki/IshigakiButton';
import { ishigakiTheme } from '@/styles/ishigaki-theme';
import { supabase } from '@/lib/supabase/client';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Types
interface BookingRequest {
  id: string;
  product_id: string;
  user_name: string;
  user_phone: string;
  user_email?: string;
  date: string;
  adult_count: number;
  child_count: number;
  total_amount: number;
  status: 'new' | 'inquiring' | 'pending_payment' | 'paid' | 'confirmed' | 'rejected' | 'cancelled';
  special_requests?: string;
  created_at: string;
  products?: {
    title_ko: string;
    title_ja: string;
  };
}

// Styled Components
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
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${ishigakiTheme.colors.text.primary};
  margin: 0;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 12px;
  padding: 24px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: ${ishigakiTheme.colors.brand.primary};
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.secondary};
  font-weight: 500;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 8px 16px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 8px;
  font-size: 14px;
  background: ${ishigakiTheme.colors.background.elevated};
  color: ${ishigakiTheme.colors.text.primary};
`;

const BookingTable = styled.div`
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${ishigakiTheme.colors.border.light};
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
  gap: 16px;
  padding: 16px 20px;
  background: ${ishigakiTheme.colors.background.secondary};
  font-weight: 600;
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.secondary};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid ${ishigakiTheme.colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${ishigakiTheme.colors.background.hover};
  }
`;

const TableCell = styled.div`
  color: ${ishigakiTheme.colors.text.primary};
  font-size: 14px;
`;

const StatusBadge = styled(Badge)<{ $status: string }>`
  ${({ $status }) => {
    switch ($status) {
      case 'new':
        return `background-color: ${ishigakiTheme.colors.semantic.warning}20; color: ${ishigakiTheme.colors.semantic.warning};`;
      case 'confirmed':
        return `background-color: ${ishigakiTheme.colors.semantic.success}20; color: ${ishigakiTheme.colors.semantic.success};`;
      case 'cancelled':
        return `background-color: ${ishigakiTheme.colors.semantic.error}20; color: ${ishigakiTheme.colors.semantic.error};`;
      case 'paid':
        return `background-color: ${ishigakiTheme.colors.brand.primary}20; color: ${ishigakiTheme.colors.brand.primary};`;
      default:
        return `background-color: ${ishigakiTheme.colors.text.tertiary}20; color: ${ishigakiTheme.colors.text.tertiary};`;
    }
  }}
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 6px;
  background: ${ishigakiTheme.colors.background.elevated};
  color: ${ishigakiTheme.colors.text.primary};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${ishigakiTheme.colors.background.hover};
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
  font-size: 16px;
  color: ${ishigakiTheme.colors.text.secondary};
`;

function AdminBookingsContent() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    confirmed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('requests')
        .select(`
          *,
          products (
            title_ko,
            title_ja
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setBookings(data || []);
      
      // Calculate stats
      const allBookings = statusFilter === 'all' ? data || [] : await getAllBookings();
      const newStats = {
        total: allBookings.length,
        new: allBookings.filter(b => b.status === 'new').length,
        confirmed: allBookings.filter(b => b.status === 'confirmed').length,
        cancelled: allBookings.filter(b => b.status === 'cancelled').length,
      };
      setStats(newStats);

    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAllBookings = async () => {
    const { data } = await supabase
      .from('requests')
      .select('status');
    return data || [];
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      // Refresh bookings
      loadBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('예약 상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return '신규';
      case 'inquiring': return '문의중';
      case 'pending_payment': return '결제대기';
      case 'paid': return '결제완료';
      case 'confirmed': return '확정';
      case 'rejected': return '거절';
      case 'cancelled': return '취소';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  return (
    <>
      <Head>
        <title>예약 관리 - Ishigaki Connect Admin</title>
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
            <Title>예약 관리</Title>
            <IshigakiButton
              variant="coral"
              size="medium"
              onClick={() => router.push('/admin/bookings/calendar')}
            >
              캘린더 보기
            </IshigakiButton>
          </Header>

          {/* 통계 */}
          <Stats>
            <StatCard>
              <StatNumber>{stats.total}</StatNumber>
              <StatLabel>전체 예약</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.new}</StatNumber>
              <StatLabel>신규 예약</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.confirmed}</StatNumber>
              <StatLabel>확정 예약</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.cancelled}</StatNumber>
              <StatLabel>취소 예약</StatLabel>
            </StatCard>
          </Stats>

          {/* 필터 */}
          <FilterBar>
            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">전체 상태</option>
              <option value="new">신규</option>
              <option value="inquiring">문의중</option>
              <option value="pending_payment">결제대기</option>
              <option value="paid">결제완료</option>
              <option value="confirmed">확정</option>
              <option value="rejected">거절</option>
              <option value="cancelled">취소</option>
            </FilterSelect>
          </FilterBar>

          {/* 예약 목록 */}
          <BookingTable>
            <TableHeader>
              <div>상품명</div>
              <div>고객 정보</div>
              <div>예약 날짜</div>
              <div>인원/금액</div>
              <div>상태</div>
              <div>액션</div>
            </TableHeader>

            {loading ? (
              <LoadingSpinner>로딩 중...</LoadingSpinner>
            ) : bookings.length === 0 ? (
              <LoadingSpinner>예약이 없습니다.</LoadingSpinner>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div style={{ fontWeight: 600 }}>
                      {booking.products?.title_ko || '상품 정보 없음'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ fontWeight: 600 }}>{booking.user_name}</div>
                    <div style={{ fontSize: '12px', color: ishigakiTheme.colors.text.tertiary }}>
                      {booking.user_phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(booking.date)}
                  </TableCell>
                  <TableCell>
                    <div>성인 {booking.adult_count}명</div>
                    {booking.child_count > 0 && <div>어린이 {booking.child_count}명</div>}
                    <div style={{ fontWeight: 600, color: ishigakiTheme.colors.brand.primary }}>
                      ₩{booking.total_amount?.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge $status={booking.status} variant="secondary">
                      {getStatusLabel(booking.status)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <Actions>
                      {booking.status === 'new' && (
                        <>
                          <ActionButton onClick={() => updateBookingStatus(booking.id, 'confirmed')}>
                            승인
                          </ActionButton>
                          <ActionButton onClick={() => updateBookingStatus(booking.id, 'rejected')}>
                            거절
                          </ActionButton>
                        </>
                      )}
                      <ActionButton onClick={() => router.push(`/admin/bookings/${booking.id}`)}>
                        상세
                      </ActionButton>
                    </Actions>
                  </TableCell>
                </TableRow>
              ))
            )}
          </BookingTable>
        </Container>
      </PageContainer>
    </>
  );
}

export default function AdminBookingsPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminBookingsContent />
    </ProtectedRoute>
  );
}