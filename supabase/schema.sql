-- Run this in Supabase SQL Editor

create table public.products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  category text not null,
  buying_price numeric(10,2) not null check (buying_price > 0),
  selling_price numeric(10,2) not null check (selling_price > 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  created_at timestamptz default now() not null
);

create table public.sales (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  total_revenue numeric(10,2) not null default 0,
  total_cost numeric(10,2) not null default 0,
  total_profit numeric(10,2) not null default 0,
  created_at timestamptz default now() not null
);

create table public.sale_items (
  id uuid default gen_random_uuid() primary key,
  sale_id uuid references public.sales(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  buying_price numeric(10,2) not null,
  selling_price numeric(10,2) not null,
  profit numeric(10,2) not null
);

alter table public.products enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;

create policy "Users manage own products"
  on public.products for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own sales"
  on public.sales for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users view sale items through sales"
  on public.sale_items for all
  using (
    exists (
      select 1 from public.sales
      where sales.id = sale_items.sale_id
      and sales.user_id = auth.uid()
    )
  );

create index idx_products_user_id on public.products(user_id);
create index idx_sales_user_id on public.sales(user_id);
create index idx_sales_created_at on public.sales(created_at desc);
create index idx_sale_items_sale_id on public.sale_items(sale_id);
