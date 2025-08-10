-- Phase 2: Core Booking System Tables

-- Request statuses enum for better type safety
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
create table if not exists requests (
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
create table if not exists request_logs (
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

-- Admin users table (extends auth.users)
create table if not exists admin_users (
  id uuid primary key references auth.users(id),
  role text check (role in ('super_admin', 'admin', 'manager')) default 'manager',
  shop_id uuid references shops(id),
  permissions jsonb default '{}',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_requests_status on requests(status);
create index if not exists idx_requests_date on requests(date);
create index if not exists idx_requests_created on requests(created_at desc);
create index if not exists idx_requests_product on requests(product_id);
create index if not exists idx_request_logs_request on request_logs(request_id);
create index if not exists idx_request_logs_created on request_logs(created_at desc);
create index if not exists idx_admin_users_shop on admin_users(shop_id);

-- RLS Policies for requests
alter table requests enable row level security;

-- Public can create requests
create policy "Anyone can create booking requests" on requests
  for insert to anon, authenticated
  with check (true);

-- Public can view their own requests (by phone number or email)
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

-- RLS Policies for request_logs
alter table request_logs enable row level security;

-- Anyone can view logs for their requests
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

-- RLS Policies for admin_users
alter table admin_users enable row level security;

-- Only super admins can view/modify admin users
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

-- Functions

-- Update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_requests_updated_at
  before update on requests
  for each row
  execute function update_updated_at();

create trigger update_admin_users_updated_at
  before update on admin_users
  for each row
  execute function update_updated_at();

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