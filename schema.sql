-- Database-ready schema (PostgreSQL/Supabase friendly)
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text unique not null,
  category_id uuid references categories(id),
  description text,
  mrp numeric(12,2) not null check (mrp >= 0),
  selling_price numeric(12,2) not null check (selling_price >= 0),
  stock integer default 0 check (stock >= 0),
  image_url text,
  featured boolean default false,
  new_arrival boolean default false,
  flash_sale boolean default false,
  preorder boolean default false,
  expected_arrival date,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  image_url text not null,
  sort_order integer default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

create table if not exists users (
  id uuid primary key,
  name text,
  email text,
  phone text,
  role text not null default 'customer' check (role in ('customer','admin')),
  status text not null default 'active' check (status in ('active','blocked')),
  created_at timestamptz default now()
);

create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references carts(id) on delete cascade,
  product_id uuid references products(id),
  quantity integer not null check (quantity > 0),
  selected_size text,
  selected_color text,
  unit_price numeric(12,2) not null,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references users(id),
  subtotal numeric(12,2) not null,
  discount numeric(12,2) default 0,
  coupon_discount numeric(12,2) default 0,
  delivery_charge numeric(12,2) default 0,
  total_amount numeric(12,2) not null,
  payment_method text,
  payment_status text default 'Pending',
  order_status text default 'Pending',
  delivery_name text,
  delivery_phone text,
  delivery_address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  product_image text,
  quantity integer not null,
  unit_price numeric(12,2) not null,
  selected_size text,
  selected_color text,
  subtotal numeric(12,2) not null
);

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  discount_type text not null,
  discount_value numeric(12,2) not null,
  start_date timestamptz,
  end_date timestamptz,
  apply_to text default 'selected_products',
  status text default 'Active',
  homepage_visible boolean default true,
  created_at timestamptz default now()
);

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null,
  discount_value numeric(12,2) not null,
  minimum_order numeric(12,2) default 0,
  maximum_discount numeric(12,2),
  usage_limit integer,
  used_count integer default 0,
  start_date timestamptz,
  end_date timestamptz,
  status text default 'Active',
  created_at timestamptz default now()
);

create table if not exists order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  status text not null,
  note text,
  changed_by uuid references users(id),
  created_at timestamptz default now()
);
