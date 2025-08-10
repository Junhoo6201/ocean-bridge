-- ============================================
-- Ishigaki Connect Database Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- Clean up existing tables if any
DROP TABLE IF EXISTS request_logs CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS policies CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS shops CASCADE;
DROP TYPE IF EXISTS request_status CASCADE;

-- ============================================
-- Phase 1: Core Tables
-- ============================================

-- Shops table
create table shops (
  id uuid primary key default gen_random_uuid(),
  name_ko text not null,
  name_ja text not null,
  description_ko text,
  description_ja text,
  address text,
  phone text,
  email text unique,
  kakao_id text unique,
  line_id text unique,
  website text,
  business_hours jsonb,
  bank_account jsonb,
  commission_rate decimal(5,2) default 20.00,
  is_verified boolean default false,
  is_active boolean default true,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Places table (meeting points, restaurants, etc)
create table places (
  id uuid primary key default gen_random_uuid(),
  name_ko text not null,
  name_ja text not null,
  type text check (type in ('meeting_point', 'restaurant', 'hotel', 'landmark', 'parking')),
  description_ko text,
  description_ja text,
  address text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  google_map_url text,
  images jsonb default '[]',
  metadata jsonb default '{}',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Policies table
create table policies (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('cancel', 'weather', 'refund', 'safety', 'age', 'health')),
  title_ko text not null,
  title_ja text not null,
  content_ko text not null,
  content_ja text not null,
  priority integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Products table
create table products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade,
  
  -- Basic info
  title_ko text not null,
  title_ja text not null,
  description_ko text,
  description_ja text,
  category text check (category in ('diving', 'snorkel', 'sup', 'kayak', 'fishing', 'tour', 'stargazing', 'glassboat', 'iriomote', 'other')),
  
  -- Details
  duration_minutes integer,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced', 'all')),
  min_participants integer default 1,
  max_participants integer,
  age_limit_min integer,
  age_limit_max integer,
  
  -- Pricing
  price_adult_krw integer,
  price_child_krw integer,
  price_adult_jpy integer,
  price_child_jpy integer,
  
  -- Location
  meeting_point_id uuid references places(id),
  meeting_point_detail_ko text,
  meeting_point_detail_ja text,
  nearby_place_ids jsonb default '[]',
  
  -- What's included/excluded
  includes_ko jsonb default '[]',
  includes_ja jsonb default '[]',
  excludes_ko jsonb default '[]',
  excludes_ja jsonb default '[]',
  preparation_ko jsonb default '[]',
  preparation_ja jsonb default '[]',
  
  -- Policies
  cancel_policy_id uuid references policies(id),
  weather_policy_id uuid references policies(id),
  refund_policy_id uuid references policies(id),
  
  -- Media
  images jsonb default '[]',
  videos jsonb default '[]',
  
  -- Status
  is_active boolean default true,
  is_popular boolean default false,
  display_order integer default 0,
  
  -- Metadata
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- Phase 2: Booking System Tables
-- ============================================

-- Request statuses enum
create type request_status as enum (
  'new',
  'inquiring',
  'pending_payment',
  'paid',
  'confirmed',
  'rejected',
  'cancelled'
);

-- Booking requests table
create table requests (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete restrict,
  
  -- User information
  user_name text not null,
  user_phone text not null,
  user_email text,
  user_kakao_id text,
  
  -- Booking details
  date date not null,
  adult_count integer not null default 1 check (adult_count > 0),
  child_count integer default 0 check (child_count >= 0),
  special_requests text,
  pickup_location text,
  
  -- Status tracking
  status request_status default 'new',
  thread_id text, -- Kakao thread ID
  
  -- Pricing
  total_amount integer,
  currency text default 'KRW',
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Constraints
  constraint valid_date check (date >= current_date),
  constraint valid_total check (adult_count + child_count > 0)
);

-- Request status change logs
create table request_logs (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references requests(id) on delete cascade,
  action text not null,
  previous_status request_status,
  new_status request_status,
  user_id uuid references auth.users(id),
  notes text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Admin users table
create table admin_users (
  id uuid primary key references auth.users(id),
  role text check (role in ('super_admin', 'admin', 'manager')) default 'manager',
  shop_id uuid references shops(id),
  permissions jsonb default '{}',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- Indexes
-- ============================================

-- Shops indexes
create index idx_shops_active on shops(is_active);
create index idx_shops_verified on shops(is_verified);

-- Places indexes
create index idx_places_type on places(type);
create index idx_places_active on places(is_active);
create index idx_places_location on places(latitude, longitude);

-- Products indexes
create index idx_products_shop on products(shop_id);
create index idx_products_category on products(category);
create index idx_products_active on products(is_active);
create index idx_products_popular on products(is_popular);
create index idx_products_price on products(price_adult_krw);

-- Requests indexes
create index idx_requests_status on requests(status);
create index idx_requests_date on requests(date);
create index idx_requests_created on requests(created_at desc);
create index idx_requests_product on requests(product_id);

-- Request logs indexes
create index idx_request_logs_request on request_logs(request_id);
create index idx_request_logs_created on request_logs(created_at desc);

-- Admin users indexes
create index idx_admin_users_shop on admin_users(shop_id);

-- ============================================
-- RLS Policies
-- ============================================

-- Enable RLS
alter table shops enable row level security;
alter table places enable row level security;
alter table policies enable row level security;
alter table products enable row level security;
alter table requests enable row level security;
alter table request_logs enable row level security;
alter table admin_users enable row level security;

-- Public read access for active shops
create policy "Public can view active shops" on shops
  for select to anon, authenticated
  using (is_active = true and is_verified = true);

-- Public read access for active places
create policy "Public can view active places" on places
  for select to anon, authenticated
  using (is_active = true);

-- Public read access for active policies
create policy "Public can view active policies" on policies
  for select to anon, authenticated
  using (is_active = true);

-- Public read access for active products
create policy "Public can view active products" on products
  for select to anon, authenticated
  using (is_active = true);

-- Public can create requests
create policy "Anyone can create booking requests" on requests
  for insert to anon, authenticated
  with check (true);

-- Public can view their own requests
create policy "Users can view own requests" on requests
  for select to anon, authenticated
  using (
    user_phone = current_setting('app.user_phone', true) or
    user_email = auth.email() or
    exists (
      select 1 from admin_users 
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

-- Admins can update requests
create policy "Admins can update requests" on requests
  for update to authenticated
  using (
    exists (
      select 1 from admin_users 
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

-- Users can view logs for their requests
create policy "Users can view logs for own requests" on request_logs
  for select to anon, authenticated
  using (
    exists (
      select 1 from requests 
      where requests.id = request_logs.request_id
      and (
        requests.user_phone = current_setting('app.user_phone', true) or
        requests.user_email = auth.email()
      )
    ) or
    exists (
      select 1 from admin_users 
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

-- Only admins can create logs
create policy "Admins can create logs" on request_logs
  for insert to authenticated
  with check (
    exists (
      select 1 from admin_users 
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

-- Super admins manage admin users
create policy "Super admins manage admin users" on admin_users
  for all to authenticated
  using (
    exists (
      select 1 from admin_users 
      where admin_users.id = auth.uid() 
      and admin_users.role = 'super_admin'
      and admin_users.is_active = true
    )
  );

-- Admins can view their own profile
create policy "Admins can view own profile" on admin_users
  for select to authenticated
  using (id = auth.uid());

-- ============================================
-- Functions
-- ============================================

-- Update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_shops_updated_at before update on shops
  for each row execute function update_updated_at();
create trigger update_places_updated_at before update on places
  for each row execute function update_updated_at();
create trigger update_policies_updated_at before update on policies
  for each row execute function update_updated_at();
create trigger update_products_updated_at before update on products
  for each row execute function update_updated_at();
create trigger update_requests_updated_at before update on requests
  for each row execute function update_updated_at();
create trigger update_admin_users_updated_at before update on admin_users
  for each row execute function update_updated_at();

-- Function to get nearby places using Haversine formula
create or replace function get_nearby_places(
  lat decimal,
  lng decimal,
  radius_km integer default 5
)
returns setof places as $$
begin
  return query
  select *
  from places
  where is_active = true
    and (
      6371 * acos(
        cos(radians(lat)) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(lng)) +
        sin(radians(lat)) * sin(radians(latitude))
      )
    ) <= radius_km
  order by
    6371 * acos(
      cos(radians(lat)) * cos(radians(latitude)) *
      cos(radians(longitude) - radians(lng)) +
      sin(radians(lat)) * sin(radians(latitude))
    );
end;
$$ language plpgsql;

-- Function to log request status changes
create or replace function log_request_status_change()
returns trigger as $$
begin
  if old.status is distinct from new.status then
    insert into request_logs (
      request_id,
      action,
      previous_status,
      new_status,
      user_id,
      notes
    ) values (
      new.id,
      'status_change',
      old.status,
      new.status,
      auth.uid(),
      'Status changed from ' || old.status || ' to ' || new.status
    );
  end if;
  return new;
end;
$$ language plpgsql;

-- Trigger for logging status changes
create trigger log_request_status_changes
  after update on requests
  for each row
  execute function log_request_status_change();

-- Function to calculate total amount
create or replace function calculate_booking_total(
  p_product_id uuid,
  p_adult_count integer,
  p_child_count integer
)
returns integer as $$
declare
  v_product products;
  v_total integer;
begin
  select * into v_product from products where id = p_product_id;
  
  if not found then
    raise exception 'Product not found';
  end if;
  
  v_total := (v_product.price_adult_krw * p_adult_count) + 
             (coalesce(v_product.price_child_krw, v_product.price_adult_krw) * p_child_count);
  
  return v_total;
end;
$$ language plpgsql;

-- Function to get request statistics
create or replace function get_request_stats(
  p_shop_id uuid default null,
  p_start_date date default current_date - interval '30 days',
  p_end_date date default current_date
)
returns table (
  total_requests bigint,
  new_requests bigint,
  confirmed_requests bigint,
  cancelled_requests bigint,
  total_revenue bigint,
  average_booking_value numeric
) as $$
begin
  return query
  select
    count(*)::bigint as total_requests,
    count(*) filter (where r.status = 'new')::bigint as new_requests,
    count(*) filter (where r.status = 'confirmed')::bigint as confirmed_requests,
    count(*) filter (where r.status = 'cancelled')::bigint as cancelled_requests,
    coalesce(sum(r.total_amount) filter (where r.status in ('paid', 'confirmed')), 0)::bigint as total_revenue,
    coalesce(avg(r.total_amount) filter (where r.status in ('paid', 'confirmed')), 0)::numeric as average_booking_value
  from requests r
  left join products p on r.product_id = p.id
  where r.created_at between p_start_date and p_end_date
    and (p_shop_id is null or p.shop_id = p_shop_id);
end;
$$ language plpgsql;

-- ============================================
-- Initial Seed Data
-- ============================================

-- Insert sample shops
INSERT INTO shops (name_ko, name_ja, description_ko, description_ja, email, phone, is_verified, is_active) VALUES
('오션 다이브 센터', 'オーシャンダイブセンター', '이시가키 최고의 다이빙 전문샵', '石垣島最高のダイビング専門店', 'info@oceandive.com', '0980-88-1234', true, true),
('블루 마린 스포츠', 'ブルーマリンスポーツ', 'SUP와 카약 전문 해양 스포츠샵', 'SUPとカヤック専門の海洋スポーツショップ', 'info@bluemarine.com', '0980-88-5678', true, true),
('이리오모테 어드벤처', '西表アドベンチャー', '이리오모테섬 정글 투어 전문', '西表島ジャングルツアー専門', 'info@iriomote.com', '0980-85-1234', true, true);

-- Insert places
INSERT INTO places (name_ko, name_ja, type, description_ko, description_ja, address, latitude, longitude) VALUES
('카비라만 주차장', '川平湾駐車場', 'meeting_point', '카비라만 입구의 무료 주차장', '川平湾入口の無料駐車場', '沖縄県石垣市川平', 24.4532, 124.1458),
('이시가키 항구', '石垣港', 'meeting_point', '이시가키 중심부 항구', '石垣中心部の港', '沖縄県石垣市美崎町', 24.3347, 124.1559),
('카비라 가든', '川平ガーデン', 'restaurant', '현지 해산물 요리 전문점', '地元の海鮮料理専門店', '沖縄県石垣市川平', 24.4550, 124.1470);

-- Insert policies
INSERT INTO policies (type, title_ko, title_ja, content_ko, content_ja, priority) VALUES
('cancel', '표준 취소 정책', '標準キャンセルポリシー', 
'• 3일 전까지: 전액 환불
• 2일 전: 50% 환불
• 1일 전: 30% 환불
• 당일: 환불 불가', 
'• 3日前まで: 全額返金
• 2日前: 50%返金
• 1日前: 30%返金
• 当日: 返金不可', 1),
('weather', '기상 취소 정책', '気象キャンセルポリシー',
'• 태풍 경보: 전액 환불 또는 일정 변경
• 파도 높이 3m 이상: 전액 환불', 
'• 台風警報: 全額返金または日程変更
• 波高3m以上: 全額返金', 1);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT INSERT ON requests, request_logs TO anon;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;