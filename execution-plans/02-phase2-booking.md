# 📘 Phase 2: Core Booking System (Week 3-5)

## 개요
핵심 예약 시스템을 구축하는 단계로, 상품 카탈로그, 예약 요청 폼, 관리자 대시보드, 정책 관리 시스템을 구현합니다.

## 🎯 목표
- ✅ 상품 카탈로그 시스템 구현 (CRUD + 필터링)
- ✅ 예약 요청 폼 및 프로세스 구축
- ✅ 관리자 대시보드 기초 구현
- ✅ 정책 관리 시스템 (취소/환불/기상)
- ✅ 상태 관리 및 전이 로직

## 📋 Task Breakdown

### Week 3: Product Catalog System

#### Day 1-2: Product Display Components
```typescript
// components/products/ProductCard.tsx
import { Card, Text, Button, Badge } from '@/components/ocean'
import { Product } from '@/types/database'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'

export function ProductCard({ product }: { product: Product }) {
  const { t, i18n } = useTranslation()
  const isKorean = i18n.language === 'ko'
  
  return (
    <Card
      style={{
        background: theme.colors.background.elevated,
        boxShadow: theme.shadows.md,
        borderRadius: '16px',
        overflow: 'hidden'
      }}
    >
      <div className="relative h-48 w-full">
        <Image
          src={product.images?.[0] || '/images/placeholder.jpg'}
          alt={isKorean ? product.title_ko : product.title_ja}
          fill
          className="object-cover"
        />
        {product.category === 'diving' && (
          <Badge
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: theme.colors.semantic.coral,
              color: 'white'
            }}
          >
            {t('products.popular')}
          </Badge>
        )}
      </div>
      
      <div className="p-6">
        <Text variant="h5" color={theme.colors.text.primary}>
          {isKorean ? product.title_ko : product.title_ja}
        </Text>
        
        <div className="flex gap-2 mt-2">
          <Badge variant="ocean">
            {product.duration_minutes} {t('common.minutes')}
          </Badge>
          <Badge variant="sand">
            {t(`difficulty.${product.difficulty}`)}
          </Badge>
        </div>
        
        <Text 
          variant="body" 
          color={theme.colors.text.secondary}
          className="mt-3 line-clamp-2"
        >
          {isKorean ? product.description_ko : product.description_ja}
        </Text>
        
        <div className="mt-4 flex justify-between items-center">
          <Text variant="h6" color={theme.colors.text.primary}>
            ₩{product.price_adult_krw?.toLocaleString()}
          </Text>
          <Button
            style={{
              background: theme.colors.brand.primary,
              color: 'white'
            }}
          >
            {t('common.viewDetails')}
          </Button>
        </div>
      </div>
    </Card>
  )
}
```

#### Day 3: Product Filtering & Search
```typescript
// components/products/ProductFilter.tsx
import { useState } from 'react'
import { Select, Checkbox, Button } from '@/components/ocean'

interface FilterState {
  category: string[]
  difficulty: string[]
  priceRange: [number, number]
  duration: string
}

export function ProductFilter({ onFilter }: { onFilter: (filters: FilterState) => void }) {
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    difficulty: [],
    priceRange: [0, 500000],
    duration: 'all'
  })
  
  // Filter UI implementation
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Category checkboxes */}
      {/* Difficulty selection */}
      {/* Price range slider */}
      {/* Duration dropdown */}
    </div>
  )
}
```

#### Day 4-5: Product Detail Page
```typescript
// app/(public)/products/[id]/page.tsx
import { Product, Shop, Policy, Place } from '@/types/database'
import { ProductGallery } from '@/components/products/ProductGallery'
import { BookingForm } from '@/components/booking/BookingForm'
import { PolicySection } from '@/components/products/PolicySection'
import { NearbyPlaces } from '@/components/places/NearbyPlaces'

export default async function ProductDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const product = await getProduct(params.id)
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section with Gallery */}
      <ProductGallery images={product.images} />
      
      {/* Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          {/* Title & Description */}
          {/* Includes/Excludes */}
          {/* Meeting Point */}
          {/* Preparation */}
          
          <PolicySection 
            cancelPolicy={product.cancel_policy}
            weatherPolicy={product.weather_policy}
          />
        </div>
        
        <div className="lg:col-span-1">
          {/* Sticky Booking Card */}
          <div className="sticky top-24">
            <BookingForm product={product} />
          </div>
        </div>
      </div>
      
      {/* Nearby Places */}
      <NearbyPlaces placeIds={product.nearby_place_ids} />
    </div>
  )
}
```

### Week 4: Booking Request System

#### Day 6-7: Booking Form Implementation
```typescript
// components/booking/BookingForm.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Input, TextArea, Button, Select } from '@/components/ocean'
import { createBookingRequest } from '@/services/booking'

interface BookingFormData {
  date: Date
  adultCount: number
  childCount: number
  name: string
  phone: string
  kakaoId?: string
  specialRequests?: string
  pickupLocation?: string
}

export function BookingForm({ product }: { product: Product }) {
  const [formData, setFormData] = useState<BookingFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const request = await createBookingRequest({
        product_id: product.id,
        ...formData
      })
      
      // Redirect to confirmation page
      router.push(`/booking/confirm/${request.id}`)
    } catch (error) {
      console.error('Booking request failed:', error)
      // Show error message
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        {/* Date Selection */}
        <Calendar
          minDate={new Date()}
          maxDate={/* 3 months from now */}
          onChange={(date) => setFormData({...formData, date})}
        />
        
        {/* Participant Count */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Select
            label="성인"
            options={/* 1-10 */}
            onChange={(v) => setFormData({...formData, adultCount: v})}
          />
          <Select
            label="어린이"
            options={/* 0-10 */}
            onChange={(v) => setFormData({...formData, childCount: v})}
          />
        </div>
        
        {/* Contact Info */}
        <Input
          label="이름"
          required
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        
        <Input
          label="연락처"
          type="tel"
          required
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
        
        <Input
          label="카카오톡 ID (선택)"
          onChange={(e) => setFormData({...formData, kakaoId: e.target.value})}
        />
        
        {/* Special Requests */}
        <TextArea
          label="특별 요청사항"
          placeholder="픽업 장소, 알레르기, 특별한 요구사항 등"
          onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
        />
        
        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          loading={isSubmitting}
          style={{
            background: theme.colors.brand.primary,
            color: 'white',
            marginTop: '24px'
          }}
        >
          예약 요청하기
        </Button>
      </form>
    </Card>
  )
}
```

#### Day 8: Request Status Management
```typescript
// services/booking.ts
import { supabase } from '@/lib/supabase/client'

export type RequestStatus = 
  | 'new'
  | 'inquiring' 
  | 'pending_payment'
  | 'paid'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'

export async function createBookingRequest(data: BookingRequestData) {
  const { data: request, error } = await supabase
    .from('requests')
    .insert({
      ...data,
      status: 'new',
      created_at: new Date().toISOString()
    })
    .select()
    .single()
    
  if (error) throw error
  
  // Trigger Kakao thread creation
  await createKakaoThread(request.id)
  
  return request
}

export async function updateRequestStatus(
  requestId: string, 
  status: RequestStatus
) {
  // Validate status transition
  const validTransitions = {
    'new': ['inquiring', 'rejected'],
    'inquiring': ['pending_payment', 'rejected'],
    'pending_payment': ['paid', 'cancelled'],
    'paid': ['confirmed', 'cancelled'],
    // ...
  }
  
  // Update status with validation
}
```

#### Day 9-10: Admin Dashboard Base
```typescript
// app/(admin)/admin/page.tsx
import { RequestsTable } from '@/components/admin/RequestsTable'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { QuickActions } from '@/components/admin/QuickActions'

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const recentRequests = await getRecentRequests()
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">관리자 대시보드</h1>
      
      {/* Stats Cards */}
      <DashboardStats stats={stats} />
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Recent Requests */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">최근 예약 요청</h2>
        </CardHeader>
        <CardContent>
          <RequestsTable requests={recentRequests} />
        </CardContent>
      </Card>
    </div>
  )
}
```

### Week 5: Policy Management & Integration

#### Day 11-12: Policy CRUD
```typescript
// app/(admin)/admin/policies/page.tsx
import { PolicyEditor } from '@/components/admin/PolicyEditor'
import { PolicyList } from '@/components/admin/PolicyList'

export default function PoliciesPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PolicyList />
      <PolicyEditor />
    </div>
  )
}

// components/admin/PolicyEditor.tsx
export function PolicyEditor({ policy }: { policy?: Policy }) {
  const [formData, setFormData] = useState({
    type: policy?.type || 'cancel',
    title_ko: policy?.title_ko || '',
    title_ja: policy?.title_ja || '',
    content_ko: policy?.content_ko || '',
    content_ja: policy?.content_ja || '',
  })
  
  // Policy templates
  const templates = {
    cancel: {
      ko: 'D-3까지 무료 취소, D-2~D-1 50%, 당일 100%',
      ja: '3日前まで無料キャンセル、2-1日前50%、当日100%'
    },
    weather: {
      ko: '기상 악화로 인한 취소 시 전액 환불 또는 일정 변경',
      ja: '悪天候による中止の場合、全額返金または日程変更'
    }
  }
  
  // Auto-translate functionality
  const handleAutoTranslate = async () => {
    const translated = await translateText(formData.content_ko, 'ko', 'ja')
    setFormData({...formData, content_ja: translated})
  }
  
  return (
    // Policy editor form
  )
}
```

#### Day 13: Product Management Interface
```typescript
// app/(admin)/admin/products/page.tsx
import { ProductForm } from '@/components/admin/ProductForm'
import { ProductsTable } from '@/components/admin/ProductsTable'

// components/admin/ProductForm.tsx
export function ProductForm({ product }: { product?: Product }) {
  // Multi-language fields
  // Image upload
  // Place selection for meeting point
  // Policy assignment
  // Pricing configuration
}
```

#### Day 14-15: Testing & Integration
```typescript
// tests/booking.test.ts
describe('Booking System', () => {
  test('Create booking request', async () => {
    // Test request creation
    // Test status transitions
    // Test validation rules
  })
  
  test('Admin dashboard operations', async () => {
    // Test stats calculation
    // Test filtering
    // Test status updates
  })
})
```

## 🔧 Database Updates

```sql
-- Additional tables for Phase 2
create table requests (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  user_name text not null,
  user_phone text not null,
  user_email text,
  user_kakao_id text,
  date date not null,
  adult_count integer not null default 1,
  child_count integer default 0,
  special_requests text,
  pickup_location text,
  status text check (status in ('new','inquiring','pending_payment','paid','confirmed','rejected','cancelled')) default 'new',
  thread_id text, -- Kakao thread ID
  total_amount integer,
  currency text default 'KRW',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table request_logs (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references requests(id),
  action text not null,
  previous_status text,
  new_status text,
  user_id uuid,
  notes text,
  created_at timestamptz default now()
);

-- Indexes
create index idx_requests_status on requests(status);
create index idx_requests_date on requests(date);
create index idx_requests_created on requests(created_at desc);
```

## ✅ Deliverables Checklist

### Frontend Components
- [ ] ProductCard component
- [ ] ProductFilter component  
- [ ] ProductDetail page
- [ ] BookingForm component
- [ ] Admin RequestsTable
- [ ] Admin DashboardStats
- [ ] PolicyEditor component
- [ ] ProductForm component

### Backend Services
- [ ] Product CRUD operations
- [ ] Booking request creation
- [ ] Status transition logic
- [ ] Policy management
- [ ] Dashboard statistics
- [ ] Auto-translation service

### Admin Features
- [ ] Dashboard overview
- [ ] Request management
- [ ] Product management
- [ ] Policy management
- [ ] Basic reporting

## 🧪 Testing Requirements

### Unit Tests
- [ ] Product filtering logic
- [ ] Booking form validation
- [ ] Status transition rules
- [ ] Price calculation

### Integration Tests
- [ ] Complete booking flow
- [ ] Admin operations
- [ ] Policy application
- [ ] Multi-language switching

### E2E Tests
- [ ] User booking journey
- [ ] Admin workflow
- [ ] Error handling

## 📝 Key Considerations

### Performance
- Implement ISR for product pages
- Use React Query for caching
- Optimize image loading
- Paginate admin tables

### UX
- Clear booking flow
- Helpful error messages
- Loading states
- Success confirmations

### Data Integrity
- Validate all inputs
- Log all status changes
- Backup critical data
- Handle edge cases

## 🔄 Next Steps (Phase 3 Preview)
- Kakao Channel integration
- LINE Messaging API setup
- Bidirectional message bridge
- Template system

## 📚 Resources
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Query](https://tanstack.com/query)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

---

**Status**: Ready to implement
**Duration**: 3 weeks
**Dependencies**: Phase 1 completion
**Next Phase**: [Phase 3 - Messaging Bridge](./03-phase3-messaging.md)