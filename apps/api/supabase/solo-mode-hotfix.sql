create extension if not exists pgcrypto;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  password_hash text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists app_users_email_lower_key on public.app_users (lower(email));

alter table if exists public.couples
  add column if not exists is_solo boolean;

update public.couples
set is_solo = false
where is_solo is null;

alter table if exists public.couples
  alter column is_solo set default false;

alter table if exists public.couples
  alter column is_solo set not null;

create unique index if not exists couples_invite_code_key on public.couples (invite_code);
create unique index if not exists couple_members_user_id_key on public.couple_members (user_id);
create unique index if not exists couple_members_couple_user_key on public.couple_members (couple_id, user_id);