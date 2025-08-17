import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ishigakiTheme } from '@/styles/ishigaki-theme';
import IshigakiNavigation from '@/components/ishigaki/IshigakiNavigation';
import IshigakiButton from '@/components/ishigaki/IshigakiButton';
import { Footer } from '@/components';
import { supabase } from '@/lib/supabase/client';
import { getBookingRequest } from '@/services/booking';

const PageContainer = styled.div`
  background: ${ishigakiTheme.colors.background.primary};
  min-height: 100vh;
  padding-top: 70px;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, 
    ${ishigakiTheme.colors.semantic.tropical} 0%, 
    ${ishigakiTheme.colors.brand.primary} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(38, 208, 206, 0.4);
    }
    70% {
      box-shadow: 0 0 0 20px rgba(38, 208, 206, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(38, 208, 206, 0);
    }
  }
`;

const ConfirmCard = styled.div`
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 24px;
  padding: 48px;
  box-shadow: ${ishigakiTheme.shadows.xl};
  border: 1px solid ${ishigakiTheme.colors.border.light};
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 12px;
`;

const SubTitle = styled.p`
  font-size: 18px;
  color: ${ishigakiTheme.colors.text.secondary};
  margin-bottom: 40px;
`;

const BookingInfo = styled.div`
  background: ${ishigakiTheme.colors.background.secondary};
  border-radius: 16px;
  padding: 24px;
  margin: 32px 0;
  text-align: left;
`;

const InfoSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.p`
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.tertiary};
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: ${ishigakiTheme.colors.text.primary};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatusBadge = styled.div<{ status: string }>`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background: ${({ status }) => {
    switch (status) {
      case 'confirmed':
        return ishigakiTheme.colors.semantic.tropical;
      case 'pending_payment':
        return ishigakiTheme.colors.semantic.sand;
      case 'paid':
        return ishigakiTheme.colors.brand.primary;
      case 'cancelled':
        return ishigakiTheme.colors.status.error;
      default:
        return ishigakiTheme.colors.background.tertiary;
    }
  }};
  color: white;
`;

const Notice = styled.div`
  background: rgba(255, 217, 90, 0.1);
  border: 1px solid ${ishigakiTheme.colors.semantic.sand};
  border-radius: 12px;
  padding: 16px;
  margin: 24px 0;
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.secondary};
  text-align: left;
`;

const Actions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const QRCode = styled.div`
  margin: 24px auto;
  width: 200px;
  height: 200px;
  background: ${ishigakiTheme.colors.background.secondary};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.tertiary};
`;

// Modal Styles
const ModalOverlay = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalContent = styled.div`
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 20px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 16px;
`;

const ModalDescription = styled.p`
  font-size: 16px;
  color: ${ishigakiTheme.colors.text.secondary};
  margin-bottom: 24px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid ${ishigakiTheme.colors.border.default};
  border-radius: 12px;
  font-size: 16px;
  resize: vertical;
  background: ${ishigakiTheme.colors.background.primary};
  color: ${ishigakiTheme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${ishigakiTheme.colors.brand.primary};
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

interface BookingConfirmProps {
  booking: any;
}

export default function BookingConfirmPage({ booking: initialBooking }: BookingConfirmProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(initialBooking);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [modifyRequest, setModifyRequest] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return '예약 요청됨';
      case 'inquiring':
        return '확인 중';
      case 'pending_payment':
        return '결제 대기';
      case 'paid':
        return '결제 완료';
      case 'confirmed':
        return '예약 확정';
      case 'rejected':
        return '예약 거절됨';
      case 'cancelled':
        return '취소됨';
      default:
        return status;
    }
  };

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  // 실시간 상태 업데이트
  useEffect(() => {
    const channel = supabase
      .channel(`booking-${booking.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'booking_requests',
          filter: `id=eq.${booking.id}`,
        },
        (payload) => {
          setBooking((prev: any) => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [booking.id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '예약 확인',
          text: `${booking.products.title_ko} 예약이 완료되었습니다.`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      alert('취소 사유를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: cancelReason,
        })
        .eq('id', booking.id);

      if (error) throw error;

      // 이메일 발송 (Edge Function 호출)
      await supabase.functions.invoke('send-booking-email', {
        body: {
          type: 'cancellation',
          bookingId: booking.id,
          userEmail: booking.user_email,
          userName: booking.user_name,
          productName: booking.products.title_ko,
        },
      });

      setBooking((prev: any) => ({ ...prev, status: 'cancelled' }));
      setShowCancelModal(false);
      alert('예약이 취소되었습니다.');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('예약 취소 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleModifyRequest = async () => {
    if (!modifyRequest.trim()) {
      alert('변경 요청사항을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('booking_modifications')
        .insert({
          booking_id: booking.id,
          request_details: modifyRequest,
          requested_at: new Date().toISOString(),
          status: 'pending',
        });

      if (error) throw error;

      // 이메일 발송
      await supabase.functions.invoke('send-booking-email', {
        body: {
          type: 'modification_request',
          bookingId: booking.id,
          userEmail: booking.user_email,
          userName: booking.user_name,
          productName: booking.products.title_ko,
          modificationRequest: modifyRequest,
        },
      });

      setShowModifyModal(false);
      alert('변경 요청이 접수되었습니다. 곧 연락드리겠습니다.');
    } catch (error) {
      console.error('Error requesting modification:', error);
      alert('변경 요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
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
        <title>예약 확인 - Ocean Bridge</title>
        <meta name="description" content="예약이 성공적으로 접수되었습니다" />
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
          <ConfirmCard>
            <SuccessIcon>✓</SuccessIcon>
            
            <Title>예약이 접수되었습니다!</Title>
            <SubTitle>
              예약 번호: <strong>{booking.id.slice(0, 8).toUpperCase()}</strong>
            </SubTitle>

            <StatusBadge status={booking.status}>
              {getStatusText(booking.status)}
            </StatusBadge>

            <BookingInfo>
              <InfoSection>
                <InfoLabel>투어 정보</InfoLabel>
                <InfoValue>{booking.products.title_ko}</InfoValue>
              </InfoSection>

              <InfoGrid>
                <InfoSection>
                  <InfoLabel>예약일</InfoLabel>
                  <InfoValue>{formatDate(booking.date)}</InfoValue>
                </InfoSection>
                <InfoSection>
                  <InfoLabel>인원</InfoLabel>
                  <InfoValue>
                    성인 {booking.adult_count}명
                    {booking.child_count > 0 && `, 어린이 ${booking.child_count}명`}
                  </InfoValue>
                </InfoSection>
              </InfoGrid>

              <InfoGrid>
                <InfoSection>
                  <InfoLabel>예약자</InfoLabel>
                  <InfoValue>{booking.user_name}</InfoValue>
                </InfoSection>
                <InfoSection>
                  <InfoLabel>연락처</InfoLabel>
                  <InfoValue>{booking.user_phone}</InfoValue>
                </InfoSection>
              </InfoGrid>

              {booking.total_amount && (
                <InfoSection>
                  <InfoLabel>예상 금액</InfoLabel>
                  <InfoValue style={{ fontSize: '24px', color: ishigakiTheme.colors.brand.primary }}>
                    ₩{booking.total_amount.toLocaleString()}
                  </InfoValue>
                </InfoSection>
              )}

              {booking.special_requests && (
                <InfoSection>
                  <InfoLabel>특별 요청사항</InfoLabel>
                  <InfoValue style={{ fontSize: '16px', fontWeight: 400 }}>
                    {booking.special_requests}
                  </InfoValue>
                </InfoSection>
              )}
            </BookingInfo>

            <Notice>
              <p style={{ marginBottom: '8px' }}>
                <strong>📱 카카오톡으로 안내를 보내드립니다</strong>
              </p>
              <p>
                영업시간 내 30분 이내에 카카오톡으로 예약 가능 여부를 안내해드립니다.
                카카오톡 채널 '@oceanbridge'를 추가해주세요.
              </p>
            </Notice>

            <QRCode>
              <span>QR 코드 (준비 중)</span>
            </QRCode>

            <Actions>
              <IshigakiButton
                variant="ocean"
                size="large"
                style={{ flex: 1 }}
                onClick={() => router.push('/my-bookings')}
              >
                내 예약 보기
              </IshigakiButton>
              <IshigakiButton
                variant="ghost"
                size="large"
                style={{ flex: 1 }}
                onClick={handleShare}
              >
                공유하기
              </IshigakiButton>
            </Actions>

            {booking.status !== 'cancelled' && booking.status !== 'rejected' && (
              <Actions style={{ marginTop: '16px' }}>
                <IshigakiButton
                  variant="sand"
                  size="medium"
                  style={{ flex: 1 }}
                  onClick={() => setShowModifyModal(true)}
                  disabled={loading}
                >
                  예약 변경 요청
                </IshigakiButton>
                <IshigakiButton
                  variant="ghost"
                  size="medium"
                  style={{ flex: 1, color: ishigakiTheme.colors.status.error }}
                  onClick={() => setShowCancelModal(true)}
                  disabled={loading}
                >
                  예약 취소
                </IshigakiButton>
              </Actions>
            )}
          </ConfirmCard>
        </Container>

        <Footer
          sections={footerSections}
          description="Ocean Bridge - 이시가키 여행의 모든 것"
        />
      </PageContainer>

      {/* 취소 모달 */}
      <ModalOverlay show={showCancelModal} onClick={() => setShowCancelModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>예약을 취소하시겠습니까?</ModalTitle>
          <ModalDescription>
            취소 사유를 입력해주세요. 취소 정책에 따라 환불이 진행됩니다.
          </ModalDescription>
          <TextArea
            placeholder="취소 사유를 입력해주세요..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <ModalActions>
            <IshigakiButton
              variant="ghost"
              size="medium"
              style={{ flex: 1 }}
              onClick={() => setShowCancelModal(false)}
              disabled={loading}
            >
              닫기
            </IshigakiButton>
            <IshigakiButton
              variant="coral"
              size="medium"
              style={{ flex: 1 }}
              onClick={handleCancelBooking}
              disabled={loading}
            >
              {loading ? '처리 중...' : '예약 취소'}
            </IshigakiButton>
          </ModalActions>
        </ModalContent>
      </ModalOverlay>

      {/* 변경 요청 모달 */}
      <ModalOverlay show={showModifyModal} onClick={() => setShowModifyModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>예약 변경 요청</ModalTitle>
          <ModalDescription>
            변경하고 싶은 내용을 자세히 입력해주세요. 담당자가 확인 후 연락드리겠습니다.
          </ModalDescription>
          <TextArea
            placeholder="예: 날짜를 8월 15일로 변경하고 싶습니다..."
            value={modifyRequest}
            onChange={(e) => setModifyRequest(e.target.value)}
          />
          <ModalActions>
            <IshigakiButton
              variant="ghost"
              size="medium"
              style={{ flex: 1 }}
              onClick={() => setShowModifyModal(false)}
              disabled={loading}
            >
              닫기
            </IshigakiButton>
            <IshigakiButton
              variant="ocean"
              size="medium"
              style={{ flex: 1 }}
              onClick={handleModifyRequest}
              disabled={loading}
            >
              {loading ? '처리 중...' : '변경 요청'}
            </IshigakiButton>
          </ModalActions>
        </ModalContent>
      </ModalOverlay>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const bookingId = params?.id as string;
  
  try {
    const booking = await getBookingRequest(bookingId);
    
    if (!booking) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        booking,
      },
    };
  } catch (error) {
    console.error('Error fetching booking:', error);
    return {
      notFound: true,
    };
  }
};