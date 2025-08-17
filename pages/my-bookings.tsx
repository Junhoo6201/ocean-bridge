import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ishigakiTheme } from '@/styles/ishigaki-theme';
import IshigakiNavigation from '@/components/ishigaki/IshigakiNavigation';
import IshigakiButton from '@/components/ishigaki/IshigakiButton';
import { Badge, Footer } from '@/components';
import { getBookingsByPhone, cancelBookingRequest } from '@/services/booking';

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

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 12px;
`;

const SubTitle = styled.p`
  font-size: 18px;
  color: ${ishigakiTheme.colors.text.secondary};
  margin-bottom: 40px;
`;

const SearchSection = styled.div`
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 20px;
  padding: 32px;
  box-shadow: ${ishigakiTheme.shadows.md};
  border: 1px solid ${ishigakiTheme.colors.border.light};
  margin-bottom: 40px;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 16px;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 14px 20px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 12px;
  font-size: 16px;
  background: ${ishigakiTheme.colors.background.primary};
  color: ${ishigakiTheme.colors.text.primary};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${ishigakiTheme.colors.brand.primary};
    box-shadow: 0 0 0 3px rgba(38, 208, 206, 0.1);
  }

  &::placeholder {
    color: ${ishigakiTheme.colors.text.muted};
  }
`;

const BookingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BookingCard = styled.div`
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 20px;
  padding: 24px;
  box-shadow: ${ishigakiTheme.shadows.sm};
  border: 1px solid ${ishigakiTheme.colors.border.light};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${ishigakiTheme.shadows.md};
    border-color: ${ishigakiTheme.colors.brand.primary};
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const BookingTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 8px;
`;

const BookingId = styled.p`
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.tertiary};
`;

const BookingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailLabel = styled.span`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${ishigakiTheme.colors.text.tertiary};
`;

const DetailValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${ishigakiTheme.colors.text.primary};
`;

const BookingActions = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid ${ishigakiTheme.colors.border.light};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 24px;
`;

const EmptyIcon = styled.div`
  font-size: 80px;
  margin-bottom: 24px;
`;

const EmptyTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 12px;
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: ${ishigakiTheme.colors.text.secondary};
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 24px;
  font-size: 24px;
  color: ${ishigakiTheme.colors.text.secondary};
`;

const StatusBadge = styled(Badge)<{ status: string }>``;

export default function MyBookingsPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    try {
      const data = await getBookingsByPhone(phone);
      setBookings(data || []);
      setSearched(true);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('정말 예약을 취소하시겠습니까?')) return;

    try {
      await cancelBookingRequest(bookingId, '고객 요청');
      // Refresh bookings
      const data = await getBookingsByPhone(phone);
      setBookings(data || []);
      alert('예약이 취소되었습니다.');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('예약 취소 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return '예약 요청';
      case 'inquiring':
        return '확인 중';
      case 'pending_payment':
        return '결제 대기';
      case 'paid':
        return '결제 완료';
      case 'confirmed':
        return '예약 확정';
      case 'rejected':
        return '예약 거절';
      case 'cancelled':
        return '취소됨';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'paid':
        return 'primary';
      case 'pending_payment':
      case 'inquiring':
        return 'secondary';
      case 'cancelled':
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  };

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
        { label: '예약 확인', href: '/my-bookings' },
        { label: '취소/환불', href: '/refund' }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>내 예약 조회 - Ocean Bridge</title>
        <meta name="description" content="예약 내역을 확인하고 관리하세요" />
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
          onItemClick={handleNavClick} 
        />

        <Container>
          <Title>내 예약 조회</Title>
          <SubTitle>전화번호로 예약 내역을 확인하세요</SubTitle>

          <SearchSection>
            <SearchForm onSubmit={handleSearch}>
              <Input
                type="tel"
                placeholder="예약시 입력한 전화번호 (예: 010-1234-5678)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <IshigakiButton
                variant="coral"
                size="large"
                type="submit"
                disabled={loading}
              >
                {loading ? '조회 중...' : '조회하기'}
              </IshigakiButton>
            </SearchForm>
          </SearchSection>

          {loading && (
            <LoadingState>
              <span className="animate-spin">⚡</span>
              예약 내역을 불러오는 중...
            </LoadingState>
          )}

          {!loading && searched && bookings.length === 0 && (
            <EmptyState>
              <EmptyIcon>📋</EmptyIcon>
              <EmptyTitle>예약 내역이 없습니다</EmptyTitle>
              <EmptyText>
                입력하신 전화번호로 조회된 예약이 없습니다.<br />
                전화번호를 다시 확인해주세요.
              </EmptyText>
            </EmptyState>
          )}

          {!loading && bookings.length > 0 && (
            <BookingList>
              {bookings.map((booking) => (
                <BookingCard 
                  key={booking.id}
                  onClick={() => router.push(`/booking/confirm/${booking.id}`)}
                >
                  <BookingHeader>
                    <div>
                      <BookingTitle>
                        {booking.products?.title_ko || '투어 정보 없음'}
                      </BookingTitle>
                      <BookingId>예약번호: {booking.id.slice(0, 8).toUpperCase()}</BookingId>
                    </div>
                    <StatusBadge 
                      variant={getStatusVariant(booking.status) as any}
                      size="medium"
                    >
                      {getStatusText(booking.status)}
                    </StatusBadge>
                  </BookingHeader>

                  <BookingDetails>
                    <DetailItem>
                      <DetailLabel>예약일</DetailLabel>
                      <DetailValue>{formatDate(booking.date)}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>인원</DetailLabel>
                      <DetailValue>
                        성인 {booking.adult_count}명
                        {booking.child_count > 0 && `, 어린이 ${booking.child_count}명`}
                      </DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>예약자</DetailLabel>
                      <DetailValue>{booking.user_name}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>예상 금액</DetailLabel>
                      <DetailValue>₩{booking.total_amount?.toLocaleString()}</DetailValue>
                    </DetailItem>
                  </BookingDetails>

                  <BookingActions>
                    <IshigakiButton
                      variant="ghost"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/booking/confirm/${booking.id}`);
                      }}
                    >
                      상세보기
                    </IshigakiButton>
                    {['new', 'inquiring', 'pending_payment'].includes(booking.status) && (
                      <IshigakiButton
                        variant="danger"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelBooking(booking.id);
                        }}
                      >
                        예약 취소
                      </IshigakiButton>
                    )}
                  </BookingActions>
                </BookingCard>
              ))}
            </BookingList>
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