-- Ishigaki Connect Initial Database Schema
-- Phase 1: Foundation Setup

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- Core Tables

-- Shops (Tour operators)
create table if not exists shops (
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

-- Places (Meeting points, restaurants, etc.)
create table if not exists places (
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

-- Policies (Cancel, weather, refund, safety)
create table if not exists policies (
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

-- Products (Tours and activities)
create table if not exists products (
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

-- Create indexes for better performance
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_shop_id on products(shop_id);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_places_category on places(category);
create index if not exists idx_places_active on places(is_active);
create index if not exists idx_places_location on places using gist(ll_to_earth(lat, lng));

-- RLS Policies (Public read, admin write)

-- Shops: Public can read, only authenticated can write
create policy "Public can view shops"
  on shops for select
  using (true);

create policy "Admin can manage shops"
  on shops for all
  using (auth.role() = 'authenticated');

-- Places: Public can read, only authenticated can write
create policy "Public can view places"
  on places for select
  using (is_active = true);

create policy "Admin can manage places"
  on places for all
  using (auth.role() = 'authenticated');

-- Policies: Public can read
create policy "Public can view policies"
  on policies for select
  using (true);

create policy "Admin can manage policies"
  on policies for all
  using (auth.role() = 'authenticated');

-- Products: Public can read active products
create policy "Public can view active products"
  on products for select
  using (is_active = true);

create policy "Admin can manage products"
  on products for all
  using (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_shops_updated_at before update on shops
  for each row execute function update_updated_at_column();

create trigger update_places_updated_at before update on places
  for each row execute function update_updated_at_column();

create trigger update_policies_updated_at before update on policies
  for each row execute function update_updated_at_column();

create trigger update_products_updated_at before update on products
  for each row execute function update_updated_at_column();

-- Function to calculate nearby places (using Haversine formula)
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