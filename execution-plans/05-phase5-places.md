# 📘 Phase 5: Places & Citizen Science (Week 10-11)

## 개요
Places Lite 시스템, 다이빙 로그 (시민과학), 후기 시스템, 운영 도구 고도화를 구현하여 사용자 경험을 향상시킵니다.

## 🎯 목표
- ✅ Places Lite 구현 (집합 장소 + 근처 맛집)
- ✅ 다이빙 로그 시스템 (시민과학 베타)
- ✅ 후기 및 Q&A 시스템
- ✅ 운영 도구 고도화
- ✅ 데이터 시각화 대시보드
- ✅ SEO 및 성능 최적화

## 📋 Task Breakdown

### Week 10: Places Lite & Reviews

#### Day 1-2: Places Data Management
```typescript
// services/places.ts
import { supabase } from '@/lib/supabase/client'
import { Place } from '@/types/database'

export class PlacesService {
  // Places 데이터 시딩
  async seedPlaces() {
    const placesData = await import('@/data/places_seed_json_v_0_ishigaki.json')
    
    for (const place of placesData.default) {
      await supabase.from('places').upsert({
        ...place,
        created_at: new Date(),
        updated_at: new Date()
      }, {
        onConflict: 'name_ko,name_ja'
      })
    }
  }
  
  // 근처 장소 검색 (거리 기반)
  async getNearbyPlaces(
    lat: number, 
    lng: number, 
    radiusKm: number = 1,
    category?: string
  ): Promise<Place[]> {
    // Haversine formula for distance calculation
    const { data } = await supabase.rpc('get_nearby_places', {
      center_lat: lat,
      center_lng: lng,
      radius_km: radiusKm,
      place_category: category
    })
    
    return data || []
  }
  
  // 장소 검증 및 업데이트
  async verifyPlace(placeId: string): Promise<void> {
    // Google Places API로 최신 정보 확인
    const googleData = await this.fetchGooglePlaceData(placeId)
    
    await supabase.from('places').update({
      google_rating: googleData.rating,
      hours: googleData.hours,
      photos: googleData.photos,
      last_verified_at: new Date()
    }).eq('id', placeId)
  }
  
  // 사용자 신고 처리
  async handlePlaceReport(report: {
    placeId: string
    type: 'closed' | 'moved' | 'incorrect' | 'other'
    details: string
    reportedBy: string
  }) {
    // 신고 저장
    await supabase.from('place_reports').insert(report)
    
    // 3건 이상 신고 시 자동 비활성화
    const { count } = await supabase
      .from('place_reports')
      .select('id', { count: 'exact' })
      .eq('place_id', report.placeId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // 30일 내
    
    if (count && count >= 3) {
      await supabase.from('places').update({
        is_active: false,
        deactivated_reason: 'multiple_reports'
      }).eq('id', report.placeId)
      
      // 관리자 알림
      await notifyAdmin('place_deactivated', { placeId: report.placeId, reportCount: count })
    }
  }
}

// Supabase RPC function for distance calculation
/*
create or replace function get_nearby_places(
  center_lat double precision,
  center_lng double precision,
  radius_km double precision,
  place_category text default null
)
returns table(
  id uuid,
  name_ko text,
  name_ja text,
  category text,
  distance_km double precision,
  lat double precision,
  lng double precision,
  google_rating numeric
)
language plpgsql
as $$
begin
  return query
  select 
    p.id,
    p.name_ko,
    p.name_ja,
    p.category,
    (6371 * acos(
      cos(radians(center_lat)) * cos(radians(p.lat)) *
      cos(radians(p.lng) - radians(center_lng)) +
      sin(radians(center_lat)) * sin(radians(p.lat))
    )) as distance_km,
    p.lat,
    p.lng,
    p.google_rating
  from places p
  where 
    p.is_active = true
    and (place_category is null or p.category = place_category)
    and (6371 * acos(
      cos(radians(center_lat)) * cos(radians(p.lat)) *
      cos(radians(p.lng) - radians(center_lng)) +
      sin(radians(center_lat)) * sin(radians(p.lat))
    )) <= radius_km
  order by distance_km asc;
end;
$$;
*/
```

#### Day 3: Places UI Components
```typescript
// components/places/PlacesSection.tsx
import { useState, useEffect } from 'react'
import { Place } from '@/types/database'
import { Card, Badge, Button, Text } from '@/components/ocean'
import { MapPin, Clock, Star, Navigation } from 'lucide-react'

export function PlacesSection({ 
  meetingPlaceId,
  nearbyPlaceIds 
}: { 
  meetingPlaceId?: string
  nearbyPlaceIds?: string[]
}) {
  const [meetingPlace, setMeetingPlace] = useState<Place | null>(null)
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([])
  
  useEffect(() => {
    loadPlaces()
  }, [meetingPlaceId, nearbyPlaceIds])
  
  const loadPlaces = async () => {
    if (meetingPlaceId) {
      const place = await getPlace(meetingPlaceId)
      setMeetingPlace(place)
    }
    
    if (nearbyPlaceIds?.length) {
      const places = await getPlaces(nearbyPlaceIds)
      setNearbyPlaces(places)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* 집합 장소 */}
      {meetingPlace && (
        <Card 
          style={{
            background: theme.colors.background.elevated,
            boxShadow: theme.shadows.md,
            borderLeft: `4px solid ${theme.colors.brand.primary}`
          }}
        >
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-primary" size={20} />
              <Text variant="h5" color={theme.colors.text.primary}>
                집합 장소
              </Text>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text variant="h6" className="mb-2">
                  {meetingPlace.name_ko}
                </Text>
                <Text variant="caption" color={theme.colors.text.tertiary}>
                  {meetingPlace.name_ja}
                </Text>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <Text variant="body2">
                      {meetingPlace.hours || '시간 정보 없음'}
                    </Text>
                  </div>
                  
                  {meetingPlace.note_ko && (
                    <Text variant="body2" color={theme.colors.text.secondary}>
                      💡 {meetingPlace.note_ko}
                    </Text>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => window.open(meetingPlace.map_link_google, '_blank')}
                  style={{
                    background: theme.colors.brand.primary,
                    color: 'white'
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <Navigation size={16} />
                  Google Maps로 보기
                </Button>
                
                <Button
                  onClick={() => window.open(meetingPlace.map_link_apple, '_blank')}
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                >
                  <Navigation size={16} />
                  Apple Maps로 보기
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* 근처 맛집 */}
      {nearbyPlaces.length > 0 && (
        <div>
          <Text variant="h5" className="mb-4">
            🍽️ 근처 추천 맛집
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nearbyPlaces.slice(0, 3).map((place) => (
              <Card 
                key={place.id}
                style={{
                  background: theme.colors.background.elevated,
                  boxShadow: theme.shadows.sm
                }}
                className="hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Text variant="h6" className="flex-1">
                      {place.name_ko}
                    </Text>
                    {place.google_rating && (
                      <Badge 
                        style={{
                          background: theme.colors.semantic.sunset,
                          color: 'white'
                        }}
                        className="flex items-center gap-1"
                      >
                        <Star size={12} />
                        {place.google_rating}
                      </Badge>
                    )}
                  </div>
                  
                  <Text variant="caption" color={theme.colors.text.tertiary}>
                    {place.name_ja}
                  </Text>
                  
                  {place.note_ko && (
                    <Text 
                      variant="body2" 
                      color={theme.colors.text.secondary}
                      className="mt-2"
                    >
                      {place.note_ko}
                    </Text>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(place.map_link_google, '_blank')}
                    className="mt-3 w-full"
                  >
                    지도에서 보기
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

#### Day 4-5: Review System
```typescript
// components/reviews/ReviewSection.tsx
import { useState } from 'react'
import { Review } from '@/types/database'
import { Card, Avatar, Rating, Button, TextArea } from '@/components/ocean'
import { ThumbsUp, Flag } from 'lucide-react'

export function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
    photos: [] as File[]
  })
  
  const handleSubmit = async () => {
    // 이미지 업로드
    const photoUrls = await uploadPhotos(newReview.photos)
    
    // 리뷰 저장
    await supabase.from('reviews').insert({
      product_id: productId,
      user_name: currentUser.name,
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      photos: photoUrls,
      verified_booking: true // 실제 예약 확인
    })
    
    // 리뷰 목록 새로고침
    await loadReviews()
    setShowForm(false)
  }
  
  const handleReport = async (reviewId: string, reason: string) => {
    await supabase.from('review_reports').insert({
      review_id: reviewId,
      reason,
      reported_by: currentUser.id
    })
    
    // 알림
    toast.success('신고가 접수되었습니다')
  }
  
  return (
    <div className="space-y-6">
      {/* 리뷰 통계 */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <Text variant="h4" className="flex items-center gap-2">
              4.8
              <Rating value={4.8} readonly />
            </Text>
            <Text variant="body2" color={theme.colors.text.secondary}>
              {reviews.length}개의 리뷰
            </Text>
          </div>
          
          <Button
            onClick={() => setShowForm(true)}
            style={{
              background: theme.colors.brand.primary,
              color: 'white'
            }}
          >
            리뷰 작성
          </Button>
        </div>
        
        {/* 평점 분포 */}
        <div className="mt-4 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <Text variant="body2" className="w-4">{star}</Text>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full"
                  style={{ 
                    width: `${getStarPercentage(star)}%`,
                    background: theme.colors.brand.primary
                  }}
                />
              </div>
              <Text variant="body2" className="w-12 text-right">
                {getStarCount(star)}
              </Text>
            </div>
          ))}
        </div>
      </Card>
      
      {/* 리뷰 작성 폼 */}
      {showForm && (
        <Card className="p-6">
          <Text variant="h5" className="mb-4">리뷰 작성</Text>
          
          <div className="space-y-4">
            <div>
              <Text variant="body2" className="mb-2">평점</Text>
              <Rating 
                value={newReview.rating}
                onChange={(v) => setNewReview({...newReview, rating: v})}
              />
            </div>
            
            <Input
              label="제목"
              value={newReview.title}
              onChange={(e) => setNewReview({...newReview, title: e.target.value})}
            />
            
            <TextArea
              label="내용"
              rows={4}
              value={newReview.content}
              onChange={(e) => setNewReview({...newReview, content: e.target.value})}
              placeholder="투어는 어떠셨나요?"
            />
            
            <ImageUpload
              multiple
              maxFiles={5}
              onChange={(files) => setNewReview({...newReview, photos: files})}
            />
            
            <div className="flex gap-2">
              <Button onClick={handleSubmit} variant="primary">
                등록
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                취소
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* 리뷰 목록 */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <Avatar 
                  src={review.user_avatar}
                  fallback={review.user_name[0]}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Text variant="h6">{review.user_name}</Text>
                    {review.verified_booking && (
                      <Badge variant="success" size="sm">
                        예약 확인됨
                      </Badge>
                    )}
                  </div>
                  <Rating value={review.rating} readonly size="sm" />
                  <Text variant="caption" color={theme.colors.text.tertiary}>
                    {formatDate(review.created_at)}
                  </Text>
                </div>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleReport(review.id, 'inappropriate')}
              >
                <Flag size={16} />
              </Button>
            </div>
            
            <div className="mt-4">
              <Text variant="h6">{review.title}</Text>
              <Text variant="body" className="mt-2">
                {review.content}
              </Text>
              
              {review.photos?.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {review.photos.map((photo, idx) => (
                    <img 
                      key={idx}
                      src={photo}
                      alt=""
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-4 mt-4">
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex items-center gap-1"
                >
                  <ThumbsUp size={16} />
                  도움이 됐어요 ({review.helpful_count || 0})
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### Week 11: Citizen Science & Analytics

#### Day 6-7: Diving Log System
```typescript
// components/diving/DiveLogForm.tsx
import { useState } from 'react'
import { Card, Input, Select, TextArea, Button, ImageUpload } from '@/components/ocean'
import { DiveLog } from '@/types/database'
import { DIVE_SPOTS, MARINE_SPECIES } from '@/data/diving'

export function DiveLogForm({ onSubmit }: { onSubmit: (log: DiveLog) => void }) {
  const [log, setLog] = useState<Partial<DiveLog>>({
    date: new Date(),
    spot: '',
    max_depth_m: 0,
    bottom_time_min: 0,
    temp_c: 0,
    visibility_m: 0,
    bleaching: 'none',
    species: [],
    notes: '',
    photos: []
  })
  
  return (
    <Card className="p-6">
      <Text variant="h5" className="mb-4">
        🤿 다이빙 로그 작성
      </Text>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 기본 정보 */}
        <DatePicker
          label="다이빙 날짜"
          value={log.date}
          onChange={(date) => setLog({...log, date})}
        />
        
        <Select
          label="다이빙 포인트"
          options={DIVE_SPOTS.map(spot => ({
            value: spot.id,
            label: `${spot.name_ko} (${spot.name_ja})`
          }))}
          onChange={(spot) => setLog({...log, spot})}
        />
        
        {/* 다이빙 데이터 */}
        <Input
          type="number"
          label="최대 수심 (m)"
          value={log.max_depth_m}
          onChange={(e) => setLog({...log, max_depth_m: Number(e.target.value)})}
        />
        
        <Input
          type="number"
          label="잠수 시간 (분)"
          value={log.bottom_time_min}
          onChange={(e) => setLog({...log, bottom_time_min: Number(e.target.value)})}
        />
        
        <Input
          type="number"
          label="수온 (°C)"
          value={log.temp_c}
          onChange={(e) => setLog({...log, temp_c: Number(e.target.value)})}
        />
        
        <Input
          type="number"
          label="시야 (m)"
          value={log.visibility_m}
          onChange={(e) => setLog({...log, visibility_m: Number(e.target.value)})}
        />
        
        {/* 환경 관찰 */}
        <Select
          label="산호 백화 정도"
          options={[
            { value: 'none', label: '없음' },
            { value: 'mild', label: '경미 (10% 미만)' },
            { value: 'moderate', label: '보통 (10-50%)' },
            { value: 'severe', label: '심각 (50% 이상)' }
          ]}
          onChange={(bleaching) => setLog({...log, bleaching})}
        />
        
        {/* 생물 관찰 */}
        <div className="col-span-2">
          <Text variant="body2" className="mb-2">관찰한 생물</Text>
          <SpeciesSelector
            selected={log.species || []}
            onChange={(species) => setLog({...log, species})}
          />
        </div>
        
        {/* 메모 */}
        <div className="col-span-2">
          <TextArea
            label="다이빙 메모"
            rows={4}
            value={log.notes}
            onChange={(e) => setLog({...log, notes: e.target.value})}
            placeholder="특별한 관찰, 경험, 느낌 등을 기록해주세요"
          />
        </div>
        
        {/* 사진 업로드 */}
        <div className="col-span-2">
          <ImageUpload
            label="수중 사진"
            multiple
            maxFiles={10}
            onChange={(files) => setLog({...log, photos: files})}
          />
        </div>
        
        {/* 공개 설정 */}
        <div className="col-span-2">
          <Checkbox
            label="다른 다이버들과 로그 공유"
            checked={log.is_public}
            onChange={(checked) => setLog({...log, is_public: checked})}
          />
        </div>
      </div>
      
      <div className="flex gap-2 mt-6">
        <Button
          onClick={() => onSubmit(log as DiveLog)}
          style={{
            background: theme.colors.semantic.tropical,
            color: 'white'
          }}
        >
          로그 저장
        </Button>
        <Button variant="outline">
          취소
        </Button>
      </div>
    </Card>
  )
}

// components/diving/SpeciesSelector.tsx
export function SpeciesSelector({ 
  selected, 
  onChange 
}: { 
  selected: string[]
  onChange: (species: string[]) => void 
}) {
  const categories = {
    '대형 생물': ['만타', '상어', '거북이', '돌고래'],
    '산호': ['테이블산호', '사슴뿔산호', '뇌산호', '연산호'],
    '물고기': ['흰동가리', '나폴레옹피시', '바라쿠다', '참치'],
    '기타': ['해파리', '문어', '오징어', '새우']
  }
  
  return (
    <div className="space-y-4">
      {Object.entries(categories).map(([category, species]) => (
        <div key={category}>
          <Text variant="caption" className="mb-2">{category}</Text>
          <div className="flex flex-wrap gap-2">
            {species.map((s) => (
              <Badge
                key={s}
                onClick={() => {
                  if (selected.includes(s)) {
                    onChange(selected.filter(x => x !== s))
                  } else {
                    onChange([...selected, s])
                  }
                }}
                style={{
                  background: selected.includes(s) 
                    ? theme.colors.semantic.tropical 
                    : theme.colors.background.secondary,
                  color: selected.includes(s) ? 'white' : theme.colors.text.primary,
                  cursor: 'pointer'
                }}
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

#### Day 8-9: Analytics Dashboard
```typescript
// components/admin/AnalyticsDashboard.tsx
import { useState, useEffect } from 'react'
import { Card, Select, DateRangePicker } from '@/components/ocean'
import { LineChart, BarChart, PieChart, HeatMap } from '@/components/charts'

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    new Date()
  ])
  const [metrics, setMetrics] = useState<any>({})
  
  useEffect(() => {
    loadMetrics()
  }, [dateRange])
  
  const loadMetrics = async () => {
    const data = await getAnalytics(dateRange[0], dateRange[1])
    setMetrics(data)
  }
  
  return (
    <div className="space-y-6">
      {/* 필터 */}
      <Card className="p-4">
        <div className="flex gap-4">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <Button onClick={loadMetrics}>
            새로고침
          </Button>
        </div>
      </Card>
      
      {/* KPI 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="총 예약"
          value={metrics.totalBookings}
          change={metrics.bookingChange}
          icon="📊"
        />
        <KPICard
          title="전환율"
          value={`${metrics.conversionRate}%`}
          change={metrics.conversionChange}
          icon="🎯"
        />
        <KPICard
          title="평균 응답 시간"
          value={`${metrics.avgResponseTime}분`}
          change={metrics.responseTimeChange}
          icon="⏱️"
        />
        <KPICard
          title="NPS Score"
          value={metrics.npsScore}
          change={metrics.npsChange}
          icon="😊"
        />
      </div>
      
      {/* 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 예약 추이 */}
        <Card className="p-6">
          <Text variant="h6" className="mb-4">예약 추이</Text>
          <LineChart
            data={metrics.bookingTrend}
            xKey="date"
            yKeys={['bookings', 'inquiries']}
            colors={[theme.colors.brand.primary, theme.colors.semantic.coral]}
          />
        </Card>
        
        {/* 카테고리별 예약 */}
        <Card className="p-6">
          <Text variant="h6" className="mb-4">카테고리별 예약</Text>
          <PieChart
            data={metrics.categoryBreakdown}
            dataKey="count"
            nameKey="category"
            colors={[
              theme.colors.brand.primary,
              theme.colors.semantic.coral,
              theme.colors.semantic.tropical,
              theme.colors.semantic.sunset
            ]}
          />
        </Card>
        
        {/* 시간대별 활동 */}
        <Card className="p-6">
          <Text variant="h6" className="mb-4">시간대별 활동</Text>
          <HeatMap
            data={metrics.activityHeatmap}
            xKey="hour"
            yKey="dayOfWeek"
            valueKey="count"
          />
        </Card>
        
        {/* 취소 사유 */}
        <Card className="p-6">
          <Text variant="h6" className="mb-4">취소 사유 분석</Text>
          <BarChart
            data={metrics.cancellationReasons}
            xKey="reason"
            yKey="count"
            color={theme.colors.semantic.coral}
          />
        </Card>
      </div>
      
      {/* 다이빙 로그 통계 (시민과학) */}
      <Card className="p-6">
        <Text variant="h6" className="mb-4">🤿 다이빙 로그 통계</Text>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Text variant="caption">평균 수온</Text>
            <Text variant="h4">{metrics.avgWaterTemp}°C</Text>
          </div>
          <div>
            <Text variant="caption">평균 시야</Text>
            <Text variant="h4">{metrics.avgVisibility}m</Text>
          </div>
          <div>
            <Text variant="caption">백화 관찰</Text>
            <Text variant="h4">{metrics.bleachingRate}%</Text>
          </div>
        </div>
        
        {/* 종 관찰 빈도 */}
        <div className="mt-4">
          <Text variant="body2" className="mb-2">자주 관찰된 생물 TOP 10</Text>
          <div className="flex flex-wrap gap-2">
            {metrics.topSpecies?.map((species: any) => (
              <Badge key={species.name}>
                {species.name} ({species.count})
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
```

#### Day 10: SEO & Performance
```typescript
// app/(public)/products/[id]/page.tsx
import { Metadata } from 'next'
import { getProduct } from '@/services/products'

// Dynamic metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const product = await getProduct(params.id)
  
  return {
    title: `${product.title_ko} | 이시가키 커넥트`,
    description: product.description_ko,
    openGraph: {
      title: product.title_ko,
      description: product.description_ko,
      images: product.images?.[0] ? [product.images[0]] : [],
      locale: 'ko_KR',
      alternateLocale: 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title_ko,
      description: product.description_ko,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
    alternates: {
      canonical: `https://ishigaki-connect.com/products/${product.id}`,
      languages: {
        'ko-KR': `https://ishigaki-connect.com/ko/products/${product.id}`,
        'ja-JP': `https://ishigaki-connect.com/ja/products/${product.id}`,
      }
    }
  }
}

// Sitemap generation
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { getAllProducts } from '@/services/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts()
  
  const productUrls = products.map((product) => ({
    url: `https://ishigaki-connect.com/products/${product.id}`,
    lastModified: product.updated_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        ko: `https://ishigaki-connect.com/ko/products/${product.id}`,
        ja: `https://ishigaki-connect.com/ja/products/${product.id}`,
      }
    }
  }))
  
  return [
    {
      url: 'https://ishigaki-connect.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://ishigaki-connect.com/products',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls
  ]
}

// Performance optimizations
// next.config.js
module.exports = {
  images: {
    domains: ['storage.googleapis.com', 'ishigaki-connect.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
}
```

## 🔧 Database Updates

```sql
-- Reviews and Q&A
create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  booking_id uuid references bookings(id),
  user_name text not null,
  user_email text,
  rating integer check (rating between 1 and 5),
  title text,
  content text,
  photos text[],
  verified_booking boolean default false,
  helpful_count integer default 0,
  is_visible boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table review_reports (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references reviews(id),
  reason text,
  details text,
  reported_by text,
  resolved boolean default false,
  created_at timestamptz default now()
);

-- Diving logs (Citizen Science)
create table dive_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  user_nickname text,
  spot text,
  spot_coordinates point,
  date date,
  time time,
  max_depth_m numeric(4,1),
  bottom_time_min integer,
  temp_c numeric(3,1),
  visibility_m numeric(3,1),
  current text check (current in ('none','weak','moderate','strong')),
  bleaching text check (bleaching in ('none','mild','moderate','severe')),
  species text[],
  notes text,
  photos text[],
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Place reports
create table place_reports (
  id uuid primary key default gen_random_uuid(),
  place_id uuid references places(id),
  type text check (type in ('closed','moved','incorrect','other')),
  details text,
  reported_by text,
  resolved boolean default false,
  created_at timestamptz default now()
);

-- Analytics events
create table analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  event_category text,
  event_label text,
  event_value numeric,
  user_id text,
  session_id text,
  page_url text,
  referrer text,
  user_agent text,
  ip_address inet,
  created_at timestamptz default now()
);

-- Indexes
create index idx_reviews_product on reviews(product_id, is_visible);
create index idx_reviews_rating on reviews(rating);
create index idx_dive_logs_date on dive_logs(date desc);
create index idx_dive_logs_spot on dive_logs(spot);
create index idx_analytics_events_type on analytics_events(event_type, created_at);
```

## ✅ Deliverables Checklist

### Places System
- [ ] Places data seeding
- [ ] Nearby places search
- [ ] Places UI components
- [ ] Report handling
- [ ] Verification system

### Review System
- [ ] Review submission
- [ ] Photo uploads
- [ ] Rating display
- [ ] Report mechanism
- [ ] Moderation tools

### Citizen Science
- [ ] Dive log form
- [ ] Species selector
- [ ] Data visualization
- [ ] Public sharing
- [ ] Export functionality

### Analytics
- [ ] KPI dashboard
- [ ] Charts and graphs
- [ ] Real-time metrics
- [ ] Export reports
- [ ] Custom date ranges

## 🧪 Testing Requirements

### Functional Tests
- [ ] Places search accuracy
- [ ] Review submission flow
- [ ] Image upload handling
- [ ] Dive log validation
- [ ] Analytics calculations

### Performance Tests
- [ ] Page load speed
- [ ] Image optimization
- [ ] Query performance
- [ ] Cache effectiveness

## 📝 Key Considerations

### Data Quality
- Regular place verification
- Review authenticity checks
- Dive log validation
- Species data accuracy

### User Experience
- Mobile-responsive design
- Fast search results
- Easy photo uploads
- Intuitive forms

### SEO
- Dynamic metadata
- Structured data
- Sitemap generation
- Multi-language support

## 🔄 Next Steps (Phase 6 Preview)
- Final testing
- Performance optimization
- Security audit
- Launch preparation

## 📚 Resources
- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)
- [Web Vitals](https://web.dev/vitals/)
- [Chart.js](https://www.chartjs.org/)

---

**Status**: Ready to implement
**Duration**: 2 weeks
**Dependencies**: Phase 4 completion
**Next Phase**: [Phase 6 - Launch Preparation](./06-phase6-launch.md)