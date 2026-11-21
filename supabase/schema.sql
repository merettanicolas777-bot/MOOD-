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

-- 6. Limpieza del catálogo demo de la marca anterior ----------------------
-- Si ya cargaste prendas reales, comentá este bloque antes de ejecutar.

delete from public.products
where name in (
  'Remera Oversize Off Black',
  'Remera Boxy Heavy Bone',
  'Buzo Hoodie Carbon',
  'Buzo Crewneck Fog',
  'Pantalón Cargo Utility',
  'Campera Puffer Nocturna',
  'Campera Bomber Sarga',
  'Gorra Curva Mood'
);

delete from public.categories
where name in ('Remeras', 'Buzos', 'Pantalones');

-- 7. Catálogo inicial (8 prendas de muestra) -----------------------------

insert into public.categories (name) values ('Remeras y Tops') on conflict (name) do nothing;
insert into public.categories (name) values ('Pantalones y Jeans') on conflict (name) do nothing;
insert into public.categories (name) values ('Vestidos y Conjuntos') on conflict (name) do nothing;
insert into public.categories (name) values ('Abrigos') on conflict (name) do nothing;
insert into public.categories (name) values ('Accesorios') on conflict (name) do nothing;

insert into public.products (name, price, category, description, fabric, fit, sizes, images, in_stock, featured, is_new, created_at)
select 'Vestido Knit Arena', 46900, 'Vestidos y Conjuntos', 'Vestido largo de tejido acanalado en tono arena. Calce suave que acompaña el cuerpo, mangas largas y cuello redondo. Un básico que pasa del día a la noche.', 'Tejido acanalado · 60% algodón / 40% poliéster', 'Calce al cuerpo · Largo midi', array['S', 'M', 'L', 'XL']::text[], array['/img/vestido-knit.jpg']::text[], true, true, true, '2026-11-20T12:00:00.000Z'
where not exists (select 1 from public.products where name = 'Vestido Knit Arena');
insert into public.products (name, price, category, description, fabric, fit, sizes, images, in_stock, featured, is_new, created_at)
select 'Conjunto Lino Salvia', 58900, 'Vestidos y Conjuntos', 'Conjunto de lino en verde salvia: camisa corta con amarre y pantalón wide leg. Liviano, ideal para media estación y para usar por separado.', 'Lino lavado · 55% lino / 45% viscosa', 'Relaxed · Pantalón wide leg', array['XS', 'S', 'M', 'L']::text[], array['/img/conjunto-lino.jpg']::text[], true, true, true, '2026-11-18T12:00:00.000Z'
where not exists (select 1 from public.products where name = 'Conjunto Lino Salvia');
insert into public.products (name, price, category, description, fabric, fit, sizes, images, in_stock, featured, is_new, created_at)
select 'Top Acanalado Blanco', 19900, 'Remeras y Tops', 'Top corto de punto acanalado, manga corta y escote redondo. Se lleva solo o debajo de blazers y camperas.', 'Punto acanalado elastizado', 'Ajustado · Tiro corto', array['XS', 'S', 'M', 'L']::text[], array['/img/top-acanalado.jpg']::text[], true, false, true, '2026-11-16T12:00:00.000Z'
where not exists (select 1 from public.products where name = 'Top Acanalado Blanco');
insert into public.products (name, price, category, description, fabric, fit, sizes, images, in_stock, featured, is_new, created_at)
select 'Jean Wide Light', 52900, 'Pantalones y Jeans', 'Jean de pierna ancha en denim claro con tiro alto y cintura cómoda. El que combina con todo y estiliza la silueta.', 'Denim de algodón con stretch', 'Tiro alto · Wide leg', array['S', 'M', 'L', 'XL']::text[], array['/img/jean-wide.jpg']::text[], true, false, false, '2026-11-12T12:00:00.000Z'
where not exists (select 1 from public.products where name = 'Jean Wide Light');
insert into public.products (name, price, category, description, fabric, fit, sizes, images, in_stock, featured, is_new, created_at)
select 'Abrigo Sastrero Camel', 89900, 'Abrigos', 'Tapado sastrero de lana en tono camel, cruzado y con bolsillos. Abriga sin sumar volumen y eleva cualquier look.', 'Mezcla de lana · Forrería interior', 'Recto · Largo debajo de la rodilla', array['S', 'M', 'L']::text[], array['/img/abrigo-camel.jpg']::text[], true, true, false, '2026-11-06T12:00:00.000Z'
where not exists (select 1 from public.products where name = 'Abrigo Sastrero Camel');
insert into public.products (name, price, category, description, fabric, fit, sizes, images, in_stock, featured, is_new, created_at)
select 'Bolso Raffia + Cadena', 26900, 'Accesorios', 'Bolso tejido en rafia con asas de cuero negro y cadena fina dorada. Talle único, cierre imantado y forro interior.', 'Rafia natural · Detalles de cuero', 'Talle único', array['Único']::text[], array['/img/accesorios.jpg']::text[], true, false, true, '2026-11-19T12:00:00.000Z'
where not exists (select 1 from public.products where name = 'Bolso Raffia + Cadena');
insert into public.products (name, price, category, description, fabric, fit, sizes, images, in_stock, featured, is_new, created_at)
select 'Remera Básica Algodón', 17900, 'Remeras y Tops', 'Remera de algodón peinado con calce relajado y ruedo recto. La base de todos los looks, en blanco roto.', 'Algodón peinado 24/1', 'Relaxed · Hombro caído', array['XS', 'S', 'M', 'L', 'XL']::text[], array['/img/top-acanalado.jpg']::text[], true, false, false, '2026-11-02T12:00:00.000Z'
where not exists (select 1 from public.products where name = 'Remera Básica Algodón');
insert into public.products (name, price, category, description, fabric, fit, sizes, images, in_stock, featured, is_new, created_at)
select 'Pantalón Sastrero Crema', 44900, 'Pantalones y Jeans', 'Pantalón sastrero de pinzas en crema, tiro alto y pierna amplia. Formal o informal, siempre prolijo.', 'Mezcla de lino y viscosa', 'Tiro alto · Pierna amplia', array['S', 'M', 'L', 'XL']::text[], array['/img/conjunto-lino.jpg']::text[], false, false, false, '2026-10-28T12:00:00.000Z'
where not exists (select 1 from public.products where name = 'Pantalón Sastrero Crema');
-- 8. Tu usuario admin --------------------------------------------------------
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
