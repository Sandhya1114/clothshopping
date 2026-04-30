create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  category text not null check (category in ('men', 'women', 'kids', 'accessories')),
  image_url text not null,
  stock integer not null default 0 check (stock >= 0),
  sizes text[] not null default '{}'
);

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  customer_name text not null,
  address text not null,
  phone text not null,
  items jsonb not null,
  total_price numeric(10, 2) not null check (total_price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id bigint generated always as identity primary key,
  full_name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_price on public.products (price);
create index if not exists idx_orders_created_at on public.orders (created_at desc);
create unique index if not exists idx_users_email on public.users (email);
