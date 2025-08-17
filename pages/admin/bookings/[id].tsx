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
  user_kakao_id?: string;
  date: string;
  adult_count: number;
  child_count: number;
  total_amount: number;
  status: 'new' | 'inquiring' | 'pending_payment' | 'paid' | 'confirmed' | 'rejected' | 'cancelled';
  special_requests?: string;
  pickup_location?: string;
  created_at: string;
  updated_at: string;
  products?: {
    title_ko: string;
    title_ja: string;
    description_ko: string;
    duration_minutes: number;
    price_adult_krw: number;
    price_child_krw?: number;
  };
}

interface RequestLog {
  id: string;
  action: string;
  notes?: string;
  created_at: string;
  user_id?: string;
}

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: ${ishigakiTheme.colors.text.primary};
  margin: 0;
`;

const BookingId = styled.span`
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.tertiary};
  font-weight: 400;
`;

const Section = styled.div`
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${ishigakiTheme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  color: ${ishigakiTheme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CopyButton = styled.button`
  padding: 4px 8px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 4px;
  background: ${ishigakiTheme.colors.background.secondary};
  color: ${ishigakiTheme.colors.text.secondary};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${ishigakiTheme.colors.background.hover};
  }
`;

const StatusSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 8px;
  background: ${ishigakiTheme.colors.background.secondary};
  color: ${ishigakiTheme.colors.text.primary};
  font-size: 14px;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 8px;
  background: ${ishigakiTheme.colors.background.secondary};
  color: ${ishigakiTheme.colors.text.primary};
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${ishigakiTheme.colors.brand.primary};
  }
`;

const MemoInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 8px;
  background: ${ishigakiTheme.colors.background.secondary};
  color: ${ishigakiTheme.colors.text.primary};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${ishigakiTheme.colors.brand.primary};
  }
`;

const MemoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`;

const MemoItem = styled.div`
  padding: 12px;
  background: ${ishigakiTheme.colors.background.secondary};
  border-radius: 8px;
  border-left: 3px solid ${ishigakiTheme.colors.brand.primary};
`;

const MemoDate = styled.div`
  font-size: 12px;
  color: ${ishigakiTheme.colors.text.tertiary};
  margin-bottom: 4px;
`;

const MemoText = styled.div`
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.primary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
  font-size: 16px;
  color: ${ishigakiTheme.colors.text.secondary};
`;

const EmptyText = styled.div`
  padding: 20px;
  text-align: center;
  color: ${ishigakiTheme.colors.text.tertiary};
  font-size: 14px;
`;

const PriceHighlight = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.brand.primary};
`;

const TabContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${ishigakiTheme.colors.border.light};
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-bottom: 2px solid ${props => props.$active ? ishigakiTheme.colors.brand.primary : 'transparent'};
  color: ${props => props.$active ? ishigakiTheme.colors.brand.primary : ishigakiTheme.colors.text.tertiary};
  font-weight: ${props => props.$active ? 600 : 400};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${ishigakiTheme.colors.text.primary};
  }
`;

function AdminBookingDetailContent() {
  const router = useRouter();
  const { id } = router.query;
  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMemo, setNewMemo] = useState('');
  const [savingMemo, setSavingMemo] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'memo' | 'all'>('all');

  useEffect(() => {
    if (id) {
      loadBookingDetails();
    }
  }, [id]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      
      // Load booking details
      const { data: bookingData, error: bookingError } = await supabase
        .from('requests')
        .select(`
          *,
          products (
            title_ko,
            title_ja,
            description_ko,
            duration_minutes,
            price_adult_krw,
            price_child_krw
          )
        `)
        .eq('id', id)
        .single();

      if (bookingError) throw bookingError;
      setBooking(bookingData);

      // Load logs
      const { data: logsData, error: logsError } = await supabase
        .from('request_logs')
        .select('*')
        .eq('request_id', id)
        .order('created_at', { ascending: false });

      if (logsError) throw logsError;
      setLogs(logsData || []);

    } catch (error) {
      console.error('Error loading booking details:', error);
      alert('예약 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!booking) return;

    try {
      const { error } = await supabase
        .from('requests')
        .update({ status: newStatus })
        .eq('id', booking.id);

      if (error) throw error;

      // Reload booking details
      loadBookingDetails();
      alert('상태가 변경되었습니다.');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleAddMemo = async () => {
    if (!booking || !newMemo.trim()) return;

    try {
      setSavingMemo(true);
      
      const { error } = await supabase
        .from('request_logs')
        .insert({
          request_id: booking.id,
          action: 'admin_memo',
          notes: newMemo,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      setNewMemo('');
      loadBookingDetails();
    } catch (error) {
      console.error('Error adding memo:', error);
      alert('메모 추가 중 오류가 발생했습니다.');
    } finally {
      setSavingMemo(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('클립보드에 복사되었습니다.');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return ishigakiTheme.colors.semantic.warning;
      case 'confirmed': return ishigakiTheme.colors.semantic.success;
      case 'cancelled': return ishigakiTheme.colors.semantic.error;
      case 'paid': return ishigakiTheme.colors.brand.primary;
      default: return ishigakiTheme.colors.text.tertiary;
    }
  };

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>로딩 중...</LoadingSpinner>
      </PageContainer>
    );
  }

  if (!booking) {
    return (
      <PageContainer>
        <EmptyText>예약 정보를 찾을 수 없습니다.</EmptyText>
      </PageContainer>
    );
  }

  return (
    <>
      <Head>
        <title>예약 상세 - Ishigaki Connect Admin</title>
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
            <div>
              <Title>
                예약 상세
                <BookingId> #{booking.id.slice(0, 8)}</BookingId>
              </Title>
            </div>
            <IshigakiButton
              variant="sea"
              size="medium"
              onClick={() => router.push('/admin/bookings')}
            >
              목록으로
            </IshigakiButton>
          </Header>

          {/* 예약 상태 및 기본 정보 */}
          <Section>
            <SectionTitle>예약 정보</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>상태</InfoLabel>
                <InfoValue>
                  <StatusSelect 
                    value={booking.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    style={{ color: getStatusColor(booking.status) }}
                  >
                    <option value="new">신규</option>
                    <option value="inquiring">문의중</option>
                    <option value="pending_payment">결제대기</option>
                    <option value="paid">결제완료</option>
                    <option value="confirmed">확정</option>
                    <option value="rejected">거절</option>
                    <option value="cancelled">취소</option>
                  </StatusSelect>
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>예약일</InfoLabel>
                <InfoValue>{formatDate(booking.date)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>신청일</InfoLabel>
                <InfoValue>{formatDate(booking.created_at)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>총 금액</InfoLabel>
                <InfoValue>
                  <PriceHighlight>₩{booking.total_amount?.toLocaleString()}</PriceHighlight>
                </InfoValue>
              </InfoItem>
            </InfoGrid>
          </Section>

          {/* 고객 정보 */}
          <Section>
            <SectionTitle>고객 정보</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>이름</InfoLabel>
                <InfoValue>{booking.user_name}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>전화번호</InfoLabel>
                <InfoValue>
                  {booking.user_phone}
                  <CopyButton onClick={() => copyToClipboard(booking.user_phone)}>
                    복사
                  </CopyButton>
                </InfoValue>
              </InfoItem>
              {booking.user_email && (
                <InfoItem>
                  <InfoLabel>이메일</InfoLabel>
                  <InfoValue>
                    {booking.user_email}
                    <CopyButton onClick={() => copyToClipboard(booking.user_email!)}>
                      복사
                    </CopyButton>
                  </InfoValue>
                </InfoItem>
              )}
              {booking.user_kakao_id && (
                <InfoItem>
                  <InfoLabel>카카오톡 ID</InfoLabel>
                  <InfoValue>
                    {booking.user_kakao_id}
                    <CopyButton onClick={() => copyToClipboard(booking.user_kakao_id!)}>
                      복사
                    </CopyButton>
                  </InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </Section>

          {/* 상품 정보 */}
          <Section>
            <SectionTitle>상품 정보</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>상품명</InfoLabel>
                <InfoValue>{booking.products?.title_ko || '상품 정보 없음'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>인원</InfoLabel>
                <InfoValue>
                  성인 {booking.adult_count}명
                  {booking.child_count > 0 && `, 어린이 ${booking.child_count}명`}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>소요 시간</InfoLabel>
                <InfoValue>
                  {booking.products?.duration_minutes ? 
                    `${Math.floor(booking.products.duration_minutes / 60)}시간 ${booking.products.duration_minutes % 60}분` : 
                    '정보 없음'}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>가격</InfoLabel>
                <InfoValue>
                  성인 ₩{booking.products?.price_adult_krw?.toLocaleString()}/인
                  {booking.products?.price_child_krw && 
                    `, 어린이 ₩${booking.products.price_child_krw.toLocaleString()}/인`}
                </InfoValue>
              </InfoItem>
            </InfoGrid>
          </Section>

          {/* 특별 요청사항 */}
          {(booking.special_requests || booking.pickup_location) && (
            <Section>
              <SectionTitle>특별 요청사항</SectionTitle>
              <TextArea 
                value={booking.special_requests || ''}
                readOnly
                style={{ 
                  background: ishigakiTheme.colors.background.secondary,
                  cursor: 'default'
                }}
              />
              {booking.pickup_location && (
                <InfoItem style={{ marginTop: '16px' }}>
                  <InfoLabel>픽업 위치</InfoLabel>
                  <InfoValue>{booking.pickup_location}</InfoValue>
                </InfoItem>
              )}
            </Section>
          )}

          {/* 활동 기록 */}
          <Section>
            <SectionTitle>활동 기록</SectionTitle>
            
            {/* 탭 버튼 */}
            <TabContainer>
              <TabButton 
                $active={activeTab === 'all'}
                onClick={() => setActiveTab('all')}
              >
                전체 기록
              </TabButton>
              <TabButton 
                $active={activeTab === 'history'}
                onClick={() => setActiveTab('history')}
              >
                상태 변경
              </TabButton>
              <TabButton 
                $active={activeTab === 'memo'}
                onClick={() => setActiveTab('memo')}
              >
                관리자 메모
              </TabButton>
            </TabContainer>

            {/* 메모 입력 (메모 탭일 때만 표시) */}
            {(activeTab === 'memo' || activeTab === 'all') && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <MemoInput
                  type="text"
                  placeholder="메모를 입력하세요..."
                  value={newMemo}
                  onChange={(e) => setNewMemo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMemo()}
                />
                <IshigakiButton
                  variant="coral"
                  size="small"
                  onClick={handleAddMemo}
                  disabled={savingMemo || !newMemo.trim()}
                >
                  추가
                </IshigakiButton>
              </div>
            )}

            {/* 로그 목록 */}
            <MemoList>
              {(() => {
                let filteredLogs = logs;
                
                if (activeTab === 'history') {
                  filteredLogs = logs.filter(log => log.action === 'status_change');
                } else if (activeTab === 'memo') {
                  filteredLogs = logs.filter(log => log.action === 'admin_memo');
                }

                if (filteredLogs.length === 0) {
                  return (
                    <EmptyText>
                      {activeTab === 'history' ? '변경 이력이 없습니다.' :
                       activeTab === 'memo' ? '메모가 없습니다.' :
                       '활동 기록이 없습니다.'}
                    </EmptyText>
                  );
                }

                return filteredLogs.map(log => (
                  <MemoItem key={log.id}>
                    <MemoDate>
                      {formatDate(log.created_at)}
                      {log.action === 'status_change' && 
                        <span style={{ marginLeft: '8px', color: ishigakiTheme.colors.brand.primary }}>
                          [상태 변경]
                        </span>
                      }
                      {log.action === 'admin_memo' && 
                        <span style={{ marginLeft: '8px', color: ishigakiTheme.colors.semantic.success }}>
                          [메모]
                        </span>
                      }
                    </MemoDate>
                    <MemoText>{log.notes}</MemoText>
                  </MemoItem>
                ));
              })()}
            </MemoList>
          </Section>

          {/* 액션 버튼 */}
          <Section>
            <SectionTitle>빠른 작업</SectionTitle>
            <ActionButtons>
              {booking.status === 'new' && (
                <>
                  <IshigakiButton
                    variant="coral"
                    size="medium"
                    onClick={() => handleStatusChange('confirmed')}
                  >
                    예약 확정하기
                  </IshigakiButton>
                  <IshigakiButton
                    variant="sea"
                    size="medium"
                    onClick={() => handleStatusChange('rejected')}
                  >
                    예약 거절하기
                  </IshigakiButton>
                </>
              )}
              {booking.status === 'confirmed' && (
                <IshigakiButton
                  variant="sunset"
                  size="medium"
                  onClick={() => handleStatusChange('cancelled')}
                >
                  예약 취소하기
                </IshigakiButton>
              )}
              <IshigakiButton
                variant="sand"
                size="medium"
                onClick={() => window.print()}
              >
                인쇄하기
              </IshigakiButton>
            </ActionButtons>
          </Section>
        </Container>
      </PageContainer>
    </>
  );
}

export default function AdminBookingDetailPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminBookingDetailContent />
    </ProtectedRoute>
  );
}