-- Esquema opcional para conectar la tienda a Supabase.
-- Ejecutar en el SQL Editor de Supabase y crear el bucket público "product-images".

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

alter table public.products enable row level security;
alter table public.categories enable row level security;

-- Lectura pública del catálogo.
create policy "catalogo_lectura" on public.products for select using (true);
create policy "categorias_lectura" on public.categories for select using (true);

-- Escritura: con la anon key, el panel /admin puede crear/editar/borrar.
-- Si más adelante sumás Supabase Auth, reemplazá estas policies por reglas por usuario.
create policy "catalogo_escritura" on public.products for all using (true) with check (true);
create policy "categorias_escritura" on public.categories for all using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "fotos_lectura" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "fotos_escritura" on storage.objects
  for insert with check (bucket_id = 'product-images');
