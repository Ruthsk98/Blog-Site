-- Run this whole script in Supabase > SQL Editor.
create extension if not exists "pgcrypto";

-- 1. PROFILES ---------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and is_admin = true);
$$;

-- 2. CATEGORIES -------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);
insert into public.categories (name, slug) values
  ('Tech','tech'), ('Design','design'), ('Tutorials','tutorials')
on conflict do nothing;

-- 3. POSTS ------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image text,
  video_url text,
  category_id uuid references public.categories(id) on delete set null,
  published boolean not null default false,
  likes integer not null default 0,
  author_id uuid references public.profiles(id) on delete set null default auth.uid(),
  deleted_at timestamptz,               -- soft delete
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_published_idx on public.posts (published, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

-- Public like counter (anon can't update posts directly)
create or replace function public.increment_likes(p_slug text)
returns integer language sql security definer set search_path = public as $$
  update public.posts set likes = likes + 1
  where slug = p_slug and published and deleted_at is null
  returning likes;
$$;
grant execute on function public.increment_likes(text) to anon, authenticated;

-- 4. CONTACT MESSAGES -------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  message text not null check (char_length(message) between 1 and 5000),
  created_at timestamptz not null default now()
);

-- 5. ROW LEVEL SECURITY -----------------------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.contact_messages enable row level security;

create policy "profiles: own row readable" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles: own row updatable" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and is_admin = (select p.is_admin from public.profiles p where p.id = auth.uid()));

create policy "categories: public read" on public.categories for select using (true);
create policy "categories: admin write" on public.categories for all using (public.is_admin()) with check (public.is_admin());

create policy "posts: public reads published" on public.posts for select using (published = true and deleted_at is null);
create policy "posts: admin full access" on public.posts for all using (public.is_admin()) with check (public.is_admin());

create policy "contact: anyone can send" on public.contact_messages for insert with check (true);
create policy "contact: admin reads" on public.contact_messages for select using (public.is_admin());

-- 6. STORAGE ----------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-media', 'blog-media', true, 52428800,
        array['image/png','image/jpeg','image/webp','image/gif','video/mp4','video/webm'])
on conflict (id) do nothing;

create policy "blog-media: public read" on storage.objects for select using (bucket_id = 'blog-media');
create policy "blog-media: admin insert" on storage.objects for insert with check (bucket_id = 'blog-media' and public.is_admin());
create policy "blog-media: admin update" on storage.objects for update using (bucket_id = 'blog-media' and public.is_admin());
create policy "blog-media: admin delete" on storage.objects for delete using (bucket_id = 'blog-media' and public.is_admin());

-- 7. AFTER CREATING YOUR ADMIN USER (Authentication > Users > Add user), run:
-- update public.profiles set is_admin = true where id = (select id from auth.users where email = 'YOU@EXAMPLE.COM');
