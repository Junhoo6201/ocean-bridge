# 📘 Phase 1: Foundation Setup (Week 1-2)

## 개요
프로젝트의 기초를 설정하는 단계로, Supabase 백엔드, Next.js 프론트엔드, Ocean Component System, 인증 시스템, 다국어 지원을 구축합니다.

## 🎯 목표
- ✅ Supabase 프로젝트 및 데이터베이스 스키마 설정
- ✅ Next.js 14 App Router 프로젝트 구조 확립  
- ✅ Ocean Component System (Ishigaki Theme) 통합
- ✅ 인증 시스템 구현 (관리자용)
- ✅ 다국어(ko/ja) 시스템 설정

## 📋 Task Breakdown

### Week 1: Backend & Infrastructure

#### Day 1-2: Supabase Setup
```sql
-- 1. Supabase 프로젝트 생성
-- 2. 데이터베이스 스키마 생성

-- Core Tables
create table shops (
  id uuid primary key default gen_random_uuid(),
  name_ko text not null,
  name_ja text not null,
  line_id text,
  phone text,
  email text,
  pickup_policy jsonb,
  verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table places (
  id uuid primary key default gen_random_uuid(),
  name_ko text not null,
  name_ja text not null,
  category text check (category in ('meeting','food','transport')),
  lat double precision not null,
  lng double precision not null,
  address_ja text,
  map_link_google text,
  map_link_apple text,
  hours jsonb,
  note_ko text,
  note_ja text,
  photos text[],
  google_rating numeric(2,1),
  source_tags text[],
  last_verified_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table policies (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('cancel','weather','refund','safety')),
  title_ko text not null,
  title_ja text not null,
  content_ko text not null,
  content_ja text not null,
  version text,
  effective_date date,
  last_checked_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade,
  title_ko text not null,
  title_ja text not null,
  description_ko text,
  description_ja text,
  category text check (category in ('diving','snorkel','sup','kayak','stargazing','glassboat','iriomote','other')),
  duration_minutes integer,
  difficulty text check (difficulty in ('beginner','intermediate','advanced','all')),
  price_adult_krw integer,
  price_child_krw integer,
  min_participants integer default 1,
  max_participants integer,
  includes_ko text[],
  includes_ja text[],
  excludes_ko text[],
  excludes_ja text[],
  meeting_place_id uuid references places(id),
  meeting_point_ko text,
  meeting_point_ja text,
  meeting_map_url text,
  nearby_place_ids uuid[],
  age_limit_min integer,
  age_limit_max integer,
  insurance_note_ko text,
  insurance_note_ja text,
  cancel_policy_id uuid references policies(id),
  weather_policy_id uuid references policies(id),
  preparation_ko text[],
  preparation_ja text[],
  images text[],
  is_active boolean default true,
  display_order integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table shops enable row level security;
alter table places enable row level security;
alter table policies enable row level security;
alter table products enable row level security;

-- Create indexes
create index idx_products_category on products(category);
create index idx_products_shop_id on products(shop_id);
create index idx_products_active on products(is_active);
create index idx_places_category on places(category);
create index idx_places_active on places(is_active);
```

#### Day 3: Authentication Setup
```typescript
// supabase/functions/setup-auth/index.ts
import { createClient } from '@supabase/supabase-js'

// Admin user creation
// Role-based access control setup
// JWT configuration
```

#### Day 4-5: Edge Functions Setup
```typescript
// supabase/functions/translate/index.ts
// DeepL API integration for auto-translation

// supabase/functions/seed-data/index.ts  
// Initial data seeding from places JSON
```

### Week 2: Frontend Setup

#### Day 6-7: Next.js Project Structure
```bash
# Project initialization
npx create-next-app@latest ocean --typescript --tailwind --app

# Install dependencies
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
pnpm add next-i18next react-i18next i18next
pnpm add framer-motion @radix-ui/react-*
pnpm add -D @types/node
```

```typescript
// app/layout.tsx
import { IshigakiThemeProvider } from '@/components/theme'
import { SupabaseProvider } from '@/components/providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <SupabaseProvider>
          <IshigakiThemeProvider>
            {children}
          </IshigakiThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
```

#### Day 8-9: Ocean Component Integration
```typescript
// components/ocean/index.ts
// Import and configure Ocean components with Ishigaki theme

// styles/ishigaki-theme.ts
export const ishigakiTheme = {
  colors: {
    brand: {
      primary: '#26D0CE',    // Bright turquoise
      secondary: '#1AC8DB',  // Sky aqua
      accent: '#7FDBFF',     // Soft cyan
      highlight: '#B3ECFF',  // Pale sky
    },
    semantic: {
      coral: '#FF8787',      // Activities
      sand: '#FFF4E6',       // Comfort
      sunset: '#FFB347',     // Premium
      tropical: '#4ECDC4',   // Eco-tours
      pearl: '#F7F7F7',      // Neutral
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F8FFFE',
      tertiary: '#F0FFFE',
      elevated: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#546E7A',
      tertiary: '#78909C',
      muted: '#B0BEC5',
    }
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
    md: '0 4px 16px rgba(0, 0, 0, 0.12)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.16)',
    soft: '0 2px 20px rgba(38, 208, 206, 0.15)',
  }
}
```

#### Day 10: i18n Setup
```typescript
// lib/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Language resources
const resources = {
  ko: {
    translation: {
      common: {
        book: '예약하기',
        cancel: '취소',
        confirm: '확인',
        // ...
      },
      products: {
        diving: '다이빙',
        snorkel: '스노클링',
        // ...
      }
    }
  },
  ja: {
    translation: {
      common: {
        book: '予約する',
        cancel: 'キャンセル',
        confirm: '確認',
        // ...
      }
    }
  }
}

// public/locales/ko/common.json
// public/locales/ja/common.json
```

## 🔧 구현 상세

### 1. 환경 변수 설정
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
DEEPL_API_KEY=your-deepl-key
```

### 2. Supabase Client Setup
```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### 3. Type Definitions
```typescript
// types/database.ts
export interface Shop {
  id: string
  name_ko: string
  name_ja: string
  line_id?: string
  phone?: string
  email?: string
  // ...
}

export interface Product {
  id: string
  shop_id: string
  title_ko: string
  title_ja: string
  category: ProductCategory
  // ...
}

export type ProductCategory = 
  | 'diving' 
  | 'snorkel' 
  | 'sup' 
  | 'kayak' 
  | 'stargazing' 
  | 'glassboat' 
  | 'iriomote'
  | 'other'
```

### 4. Initial Pages Structure
```
app/
├── (public)/
│   ├── page.tsx              # Landing page
│   ├── products/
│   │   └── page.tsx          # Product catalog
│   └── about/
│       └── page.tsx          # About page
├── (admin)/
│   ├── admin/
│   │   ├── layout.tsx        # Admin layout with auth
│   │   ├── page.tsx          # Admin dashboard
│   │   ├── products/
│   │   ├── shops/
│   │   └── policies/
└── api/
    ├── auth/
    └── webhook/
```

## ✅ Deliverables Checklist

### Backend
- [ ] Supabase project created
- [ ] Database schema implemented
- [ ] RLS policies configured
- [ ] Authentication system ready
- [ ] Edge functions deployed
- [ ] Initial data seeded

### Frontend
- [ ] Next.js project structured
- [ ] Ocean Components integrated
- [ ] Ishigaki theme applied
- [ ] i18n system configured
- [ ] TypeScript types defined
- [ ] Basic routing setup

### DevOps
- [ ] Environment variables configured
- [ ] Git repository initialized
- [ ] Vercel project connected
- [ ] CI/CD pipeline basic setup

## 🧪 Testing Checklist

### Unit Tests
- [ ] Database connection test
- [ ] Auth flow test
- [ ] Translation function test
- [ ] Component rendering test

### Integration Tests
- [ ] Supabase client operations
- [ ] i18n switching
- [ ] Theme application

## 📝 Notes & Considerations

### Security
- Enable RLS on all tables
- Use service role key only in server-side code
- Implement rate limiting on Edge Functions

### Performance
- Use ISR for product pages
- Implement proper caching strategies
- Optimize image loading

### Accessibility
- Ensure color contrast meets WCAG AA
- Add proper ARIA labels
- Support keyboard navigation

## 🔄 Next Steps (Phase 2 Preview)
- Implement product CRUD operations
- Build reservation request form
- Create admin dashboard
- Set up policy management

## 📚 Resources
- [Supabase Quickstart](https://supabase.com/docs/guides/with-nextjs)
- [Next.js i18n](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Ocean Component Docs](internal-docs)

---

**Status**: Ready to implement
**Duration**: 2 weeks
**Dependencies**: None
**Next Phase**: [Phase 2 - Core Booking System](./02-phase2-booking.md)