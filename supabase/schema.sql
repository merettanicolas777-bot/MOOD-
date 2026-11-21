-- Esquema de Mood Indumentaria en Supabase.
-- Ejecutá TODO este archivo en el SQL Editor del proyecto (es idempotente:
-- se puede correr las veces que haga falta). Después recargá el panel /admin.

-- 1. Tablas -----------------------------------------------------------------

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null default 0,
  category text not null,
  description text default '',
  fabric text default '',
  fit text default '',
  sizes text[] not null default '{}',
  images text[] not null default '{}',
  in_stock boolean not null default true,
  featured boolean not null default false,
  is_new boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- 2. Permisos para la clave pública (era lo que faltaba) ---------------------

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.products to anon, authenticated;
grant select, insert, update, delete on public.categories to anon, authenticated;

-- 3. Seguridad a nivel de fila ----------------------------------------------

alter table public.products enable row level security;
alter table public.categories enable row level security;

drop policy if exists "catalogo_lectura" on public.products;
drop policy if exists "catalogo_escritura" on public.products;
drop policy if exists "categorias_lectura" on public.categories;
drop policy if exists "categorias_escritura" on public.categories;

create policy "catalogo_lectura" on public.products
  for select using (true);
create policy "catalogo_escritura" on public.products
  for all using (true) with check (true);

create policy "categorias_lectura" on public.categories
  for select using (true);
create policy "categorias_escritura" on public.categories
  for all using (true) with check (true);

-- 4. Bucket de imágenes ------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "fotos_lectura" on storage.objects;
drop policy if exists "fotos_escritura" on storage.objects;
drop policy if exists "fotos_update" on storage.objects;
drop policy if exists "fotos_delete" on storage.objects;

create policy "fotos_lectura" on storage.objects
  for select to anon, authenticated using (bucket_id = 'product-images');

create policy "fotos_escritura" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'product-images');

create policy "fotos_update" on storage.objects
  for update to anon, authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

create policy "fotos_delete" on storage.objects
  for delete to anon, authenticated using (bucket_id = 'product-images');
