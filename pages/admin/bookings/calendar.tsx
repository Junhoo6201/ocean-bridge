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
  date: string;
  adult_count: number;
  child_count: number;
  total_amount: number;
  status: 'new' | 'inquiring' | 'pending_payment' | 'paid' | 'confirmed' | 'rejected' | 'cancelled';
  products?: {
    title_ko: string;
  };
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  bookings: BookingRequest[];
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

const CalendarControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MonthButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 8px;
  background: ${ishigakiTheme.colors.background.elevated};
  color: ${ishigakiTheme.colors.text.primary};
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: ${ishigakiTheme.colors.background.hover};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CurrentMonth = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
  min-width: 200px;
  text-align: center;
`;

const Legend = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.secondary};
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.color};
`;

const CalendarGrid = styled.div`
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${ishigakiTheme.colors.border.light};
`;

const CalendarHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: ${ishigakiTheme.colors.background.secondary};
`;

const DayHeader = styled.div`
  padding: 16px 12px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.secondary};
  border-right: 1px solid ${ishigakiTheme.colors.border.light};
  
  &:last-child {
    border-right: none;
  }
`;

const CalendarBody = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const CalendarCell = styled.div<{ $isCurrentMonth: boolean; $isToday: boolean }>`
  min-height: 120px;
  padding: 8px;
  border-right: 1px solid ${ishigakiTheme.colors.border.light};
  border-bottom: 1px solid ${ishigakiTheme.colors.border.light};
  background: ${props => 
    props.$isCurrentMonth 
      ? ishigakiTheme.colors.background.elevated 
      : `${ishigakiTheme.colors.background.secondary}50`
  };
  
  ${props => props.$isToday && `
    background: ${ishigakiTheme.colors.brand.primary}08;
    border-color: ${ishigakiTheme.colors.brand.primary}40;
  `}
  
  &:nth-child(7n) {
    border-right: none;
  }
`;

const DateNumber = styled.div<{ $isCurrentMonth: boolean; $isToday: boolean }>`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => 
    props.$isCurrentMonth 
      ? props.$isToday 
        ? ishigakiTheme.colors.brand.primary
        : ishigakiTheme.colors.text.primary
      : ishigakiTheme.colors.text.tertiary
  };
`;

const BookingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const BookingItem = styled.div<{ $status: string }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  background: ${props => {
    switch (props.$status) {
      case 'new': return `${ishigakiTheme.colors.semantic.warning}20`;
      case 'confirmed': return `${ishigakiTheme.colors.semantic.success}20`;
      case 'cancelled': return `${ishigakiTheme.colors.semantic.error}20`;
      case 'paid': return `${ishigakiTheme.colors.brand.primary}20`;
      default: return `${ishigakiTheme.colors.text.tertiary}20`;
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'new': return ishigakiTheme.colors.semantic.warning;
      case 'confirmed': return ishigakiTheme.colors.semantic.success;
      case 'cancelled': return ishigakiTheme.colors.semantic.error;
      case 'paid': return ishigakiTheme.colors.brand.primary;
      default: return ishigakiTheme.colors.text.tertiary;
    }
  }};
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
  font-size: 16px;
  color: ${ishigakiTheme.colors.text.secondary};
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 12px;
  padding: 16px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${ishigakiTheme.colors.brand.primary};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${ishigakiTheme.colors.text.secondary};
  font-weight: 500;
`;

function AdminBookingsCalendarContent() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [monthStats, setMonthStats] = useState({
    total: 0,
    new: 0,
    confirmed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    loadBookings();
  }, [currentDate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      
      // Get first and last day of current month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          products (
            title_ko
          )
        `)
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0])
        .order('date');

      if (error) throw error;

      setBookings(data || []);
      generateCalendarDays(data || []);
      
      // Calculate stats for current month
      const stats = {
        total: data?.length || 0,
        new: data?.filter(b => b.status === 'new').length || 0,
        confirmed: data?.filter(b => b.status === 'confirmed').length || 0,
        cancelled: data?.filter(b => b.status === 'cancelled').length || 0,
      };
      setMonthStats(stats);

    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarDays = (monthBookings: BookingRequest[]) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and what day of week it is
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Go to Sunday
    
    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    
    // Generate 6 weeks (42 days)
    for (let i = 0; i < 42; i++) {
      const dateString = current.toISOString().split('T')[0];
      const dayBookings = monthBookings.filter(booking => booking.date === dateString);
      
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        bookings: dayBookings,
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    setCalendarDays(days);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleBookingClick = (booking: BookingRequest) => {
    router.push(`/admin/bookings/${booking.id}`);
  };

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long'
    });
  };

  const dayHeaders = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <>
      <Head>
        <title>예약 캘린더 - Ishigaki Connect Admin</title>
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
            <Title>예약 캘린더</Title>
            <IshigakiButton
              variant="coral"
              size="medium"
              onClick={() => router.push('/admin/bookings')}
            >
              목록 보기
            </IshigakiButton>
          </Header>

          {/* 월별 통계 */}
          <Stats>
            <StatCard>
              <StatNumber>{monthStats.total}</StatNumber>
              <StatLabel>이달 전체</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{monthStats.new}</StatNumber>
              <StatLabel>신규</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{monthStats.confirmed}</StatNumber>
              <StatLabel>확정</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{monthStats.cancelled}</StatNumber>
              <StatLabel>취소</StatLabel>
            </StatCard>
          </Stats>

          {/* 캘린더 컨트롤 */}
          <CalendarControls>
            <MonthNavigation>
              <MonthButton onClick={() => navigateMonth('prev')}>
                ← 이전
              </MonthButton>
              <CurrentMonth>
                {formatMonthYear(currentDate)}
              </CurrentMonth>
              <MonthButton onClick={() => navigateMonth('next')}>
                다음 →
              </MonthButton>
              <MonthButton onClick={goToToday}>
                오늘
              </MonthButton>
            </MonthNavigation>

            <Legend>
              <LegendItem>
                <LegendColor color={ishigakiTheme.colors.semantic.warning} />
                신규
              </LegendItem>
              <LegendItem>
                <LegendColor color={ishigakiTheme.colors.brand.primary} />
                결제완료
              </LegendItem>
              <LegendItem>
                <LegendColor color={ishigakiTheme.colors.semantic.success} />
                확정
              </LegendItem>
              <LegendItem>
                <LegendColor color={ishigakiTheme.colors.semantic.error} />
                취소
              </LegendItem>
            </Legend>
          </CalendarControls>

          {/* 캘린더 */}
          {loading ? (
            <LoadingSpinner>로딩 중...</LoadingSpinner>
          ) : (
            <CalendarGrid>
              <CalendarHeader>
                {dayHeaders.map((day, index) => (
                  <DayHeader key={index}>{day}</DayHeader>
                ))}
              </CalendarHeader>
              
              <CalendarBody>
                {calendarDays.map((day, index) => (
                  <CalendarCell 
                    key={index}
                    $isCurrentMonth={day.isCurrentMonth}
                    $isToday={isToday(day.date)}
                  >
                    <DateNumber 
                      $isCurrentMonth={day.isCurrentMonth}
                      $isToday={isToday(day.date)}
                    >
                      {day.date.getDate()}
                    </DateNumber>
                    
                    <BookingsList>
                      {day.bookings.slice(0, 3).map((booking, bookingIndex) => (
                        <BookingItem
                          key={bookingIndex}
                          $status={booking.status}
                          onClick={() => handleBookingClick(booking)}
                          title={`${booking.user_name} - ${booking.products?.title_ko || '상품 정보 없음'}`}
                        >
                          {booking.user_name} {booking.adult_count + booking.child_count}명
                        </BookingItem>
                      ))}
                      {day.bookings.length > 3 && (
                        <BookingItem $status="more" onClick={() => {}}>
                          +{day.bookings.length - 3}개 더
                        </BookingItem>
                      )}
                    </BookingsList>
                  </CalendarCell>
                ))}
              </CalendarBody>
            </CalendarGrid>
          )}
        </Container>
      </PageContainer>
    </>
  );
}

export default function AdminBookingsCalendarPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminBookingsCalendarContent />
    </ProtectedRoute>
  );
}