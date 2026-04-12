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

create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.app_users(id) on delete cascade,
  invite_code text not null,
  savings_percent numeric(5,2) not null default 10,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists couples_invite_code_key on public.couples (invite_code);

create table if not exists public.couple_members (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references public.app_users(id) on delete cascade,
  role text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists couple_members_user_id_key on public.couple_members (user_id);
create unique index if not exists couple_members_couple_user_key on public.couple_members (couple_id, user_id);

create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references public.app_users(id) on delete cascade,
  amount numeric(12,2) not null,
  period text not null,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references public.app_users(id) on delete cascade,
  amount numeric(12,2) not null,
  category text not null,
  note text,
  expense_date date not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  name text not null,
  target_amount numeric(12,2) not null,
  current_amount numeric(12,2) not null default 0,
  deadline date,
  created_at timestamptz not null default timezone('utc', now())
);