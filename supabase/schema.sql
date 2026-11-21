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

-- Usuarios con permiso de administración (el resto solo puede mirar).
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- 2. Rol de admin ------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 3. Permisos de tablas ------------------------------------------------------

grant usage on schema public to anon, authenticated;

revoke all on public.products from anon;
revoke all on public.categories from anon;

grant select on public.products to anon, authenticated;
grant select on public.categories to anon, authenticated;
grant select on public.admins to authenticated;

grant insert, update, delete on public.products to authenticated;
grant insert, update, delete on public.categories to authenticated;

-- 4. Seguridad a nivel de fila ----------------------------------------------

alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.admins enable row level security;

drop policy if exists "catalogo_lectura" on public.products;
drop policy if exists "catalogo_escritura" on public.products;
drop policy if exists "categorias_lectura" on public.categories;
drop policy if exists "categorias_escritura" on public.categories;
drop policy if exists "admins_lectura" on public.admins;

-- Cualquiera puede ver el catálogo.
create policy "catalogo_lectura" on public.products
  for select to anon, authenticated using (true);

create policy "categorias_lectura" on public.categories
  for select to anon, authenticated using (true);

-- Solo un admin puede crear, editar o borrar.
create policy "catalogo_escritura" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "categorias_escritura" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Cada admin puede leer su propia fila (el panel la usa para validar el rol).
create policy "admins_lectura" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- 5. Bucket de imágenes ------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "fotos_lectura" on storage.objects;
drop policy if exists "fotos_escritura" on storage.objects;
drop policy if exists "fotos_update" on storage.objects;
drop policy if exists "fotos_delete" on storage.objects;

create policy "fotos_lectura" on storage.objects
  for select to public using (bucket_id = 'product-images');

create policy "fotos_escritura" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());

create policy "fotos_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "fotos_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- 6. Tu usuario admin --------------------------------------------------------
--
-- a) En Supabase: Authentication → Users → "Add user".
--    Cargá el correo y la contraseña y marcá "Auto Confirm User".
-- b) Volvé acá y ejecutá (cambiando el correo):
--
--    insert into public.admins (user_id, email)
--    select id, email from auth.users where email = 'tu@correo.com'
--    on conflict (user_id) do nothing;
--
-- Con eso entrás en /admin con ese correo y contraseña.
