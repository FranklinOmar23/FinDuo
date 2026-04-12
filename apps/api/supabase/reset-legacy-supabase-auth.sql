-- ADVERTENCIA:
-- Este script elimina el esquema viejo ligado a auth.users/profiles
-- para dejar la base compatible con la auth propia del backend.
-- Úsalo solo si todavía no necesitas conservar datos previos.

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

drop policy if exists "ver propio perfil" on public.profiles;
drop policy if exists "editar propio perfil" on public.profiles;
drop policy if exists "ver mis parejas" on public.couple_members;
drop policy if exists "unirme a pareja" on public.couple_members;
drop policy if exists "ver pareja" on public.couples;
drop policy if exists "crear pareja" on public.couples;
drop policy if exists "editar pareja" on public.couples;
drop policy if exists "ver aportes" on public.contributions;
drop policy if exists "agregar aporte" on public.contributions;
drop policy if exists "ver gastos" on public.expenses;
drop policy if exists "agregar gasto" on public.expenses;
drop policy if exists "ver metas" on public.savings_goals;
drop policy if exists "gestionar metas" on public.savings_goals;

drop table if exists public.couple_members cascade;
drop table if exists public.contributions cascade;
drop table if exists public.expenses cascade;
drop table if exists public.savings_goals cascade;
drop table if exists public.couples cascade;
drop table if exists public.profiles cascade;
drop table if exists public.app_users cascade;

create extension if not exists pgcrypto;

create table public.app_users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  password_hash text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index app_users_email_lower_key on public.app_users (lower(email));

create table public.couples (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.app_users(id) on delete cascade,
  invite_code text not null,
  is_solo boolean not null default false,
  savings_percent numeric(5,2) not null default 10 check (savings_percent between 0 and 100),
  created_at timestamptz not null default timezone('utc', now())
);

create unique index couples_invite_code_key on public.couples (invite_code);

create table public.couple_members (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references public.app_users(id) on delete cascade,
  role text not null check (role in ('owner', 'partner')),
  created_at timestamptz not null default timezone('utc', now())
);

create unique index couple_members_user_id_key on public.couple_members (user_id);
create unique index couple_members_couple_user_key on public.couple_members (couple_id, user_id);

create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references public.app_users(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  period text not null,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references public.app_users(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  category text not null default 'otros',
  note text,
  expense_date date not null default current_date,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  name text not null,
  target_amount numeric(12,2) not null check (target_amount > 0),
  current_amount numeric(12,2) not null default 0 check (current_amount >= 0),
  deadline date,
  created_at timestamptz not null default timezone('utc', now())
);