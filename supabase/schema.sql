-- ==============================================================================
-- ORÇAMENTO PESSOAL - SCHEMA SUPABASE & POSTGRESQL
-- ==============================================================================
-- Execute este script no SQL Editor do seu projeto Supabase.
-- Ele cria todas as tabelas, índices, políticas de RLS e triggers de boas-vindas.

-- 1. EXTENSÕES
create extension if not exists "uuid-ossp";

-- 2. TABELA DE PERFIS (profiles)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  currency text default 'BRL' not null,
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. TABELA DE CATEGORIAS (categories)
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete restrict not null,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  icon text default 'tag' not null,
  color text default '#6366f1' not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  deleted_at timestamptz default null
);

-- 4. TABELA DE CONTAS / CARTEIRAS (accounts)
create table if not exists public.accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete restrict not null,
  name text not null,
  type text default 'checking' not null check (type in ('checking', 'savings', 'wallet', 'investment')),
  initial_balance numeric(14,2) default 0.00 not null,
  color text default '#0ea5e9' not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  deleted_at timestamptz default null
);

-- 5. TABELA DE TRANSAÇÕES (transactions)
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete restrict not null,
  account_id uuid references public.accounts(id) on delete restrict not null,
  category_id uuid references public.categories(id) on delete set null,
  amount numeric(14,2) not null check (amount > 0),
  type text not null check (type in ('income', 'expense', 'transfer')),
  description text not null,
  date date default current_date not null,
  status text default 'completed' not null check (status in ('completed', 'pending')),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  deleted_at timestamptz default null
);

-- 6. TABELA DE ORÇAMENTOS MENSAIS (budgets)
create table if not exists public.budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete restrict not null,
  category_id uuid references public.categories(id) on delete restrict not null,
  month smallint not null check (month between 1 and 12),
  year integer not null check (year between 2000 and 2100),
  amount_limit numeric(14,2) not null check (amount_limit > 0),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  deleted_at timestamptz default null,
  constraint unique_user_category_month_year unique (user_id, category_id, month, year)
);

-- ==============================================================================
-- ÍNDICES DE PERFORMANCE (FILTRO NÃO-DESTRUTIVO DE SOFT DELETE)
-- ==============================================================================
create index if not exists idx_transactions_active on public.transactions(user_id, date desc) where deleted_at is null;
create index if not exists idx_transactions_account on public.transactions(account_id) where deleted_at is null;
create index if not exists idx_transactions_category on public.transactions(category_id) where deleted_at is null;
create index if not exists idx_budgets_active on public.budgets(user_id, year, month) where deleted_at is null;
create index if not exists idx_categories_active on public.categories(user_id) where deleted_at is null;
create index if not exists idx_accounts_active on public.accounts(user_id) where deleted_at is null;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - ISOLAMENTO TOTAL POR USUÁRIO
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.accounts enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;

-- Políticas para profiles
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

-- Políticas para categories
create policy "Users can view own active categories"
  on public.categories for select
  to authenticated
  using ((select auth.uid()) = user_id and deleted_at is null);

create policy "Users can insert own categories"
  on public.categories for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own categories"
  on public.categories for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Salvaguarda Regras 1 & 3: Bloqueio de Hard Delete físico direto no banco
create policy "Disallow physical delete on categories"
  on public.categories for delete
  to authenticated
  using (false);

-- Políticas para accounts
create policy "Users can view own active accounts"
  on public.accounts for select
  to authenticated
  using ((select auth.uid()) = user_id and deleted_at is null);

create policy "Users can insert own accounts"
  on public.accounts for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own accounts"
  on public.accounts for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Salvaguarda Regras 1 & 3: Bloqueio de Hard Delete físico direto no banco
create policy "Disallow physical delete on accounts"
  on public.accounts for delete
  to authenticated
  using (false);

-- Políticas para transactions
create policy "Users can view own active transactions"
  on public.transactions for select
  to authenticated
  using ((select auth.uid()) = user_id and deleted_at is null);

create policy "Users can insert own transactions"
  on public.transactions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own transactions"
  on public.transactions for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Salvaguarda Regras 1 & 3: Bloqueio de Hard Delete físico direto no banco
create policy "Disallow physical delete on transactions"
  on public.transactions for delete
  to authenticated
  using (false);

-- Políticas para budgets
create policy "Users can view own active budgets"
  on public.budgets for select
  to authenticated
  using ((select auth.uid()) = user_id and deleted_at is null);

create policy "Users can insert own budgets"
  on public.budgets for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own budgets"
  on public.budgets for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Salvaguarda Regras 1 & 3: Bloqueio de Hard Delete físico direto no banco
create policy "Disallow physical delete on budgets"
  on public.budgets for delete
  to authenticated
  using (false);

-- ==============================================================================
-- TRIGGER AUTOMÁTICO: NOVO USUÁRIO -> PERFIL + DADOS PADRÃO
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  account_id uuid;
begin
  -- 1. Cria o perfil do usuário
  insert into public.profiles (id, full_name, currency)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Usuário'), 'BRL');

  -- 2. Cria uma conta bancária inicial padrão
  insert into public.accounts (user_id, name, type, initial_balance, color)
  values (new.id, 'Conta Principal', 'checking', 0.00, '#0ea5e9')
  returning id into account_id;

  -- 3. Cria categorias padrão de despesas
  insert into public.categories (user_id, name, type, icon, color) values
    (new.id, 'Alimentação', 'expense', 'utensils', '#ef4444'),
    (new.id, 'Moradia', 'expense', 'home', '#f97316'),
    (new.id, 'Transporte', 'expense', 'car', '#eab308'),
    (new.id, 'Lazer', 'expense', 'film', '#a855f7'),
    (new.id, 'Saúde', 'expense', 'heart-pulse', '#ec4899'),
    (new.id, 'Educação', 'expense', 'graduation-cap', '#3b82f6'),
    (new.id, 'Outros', 'expense', 'more-horizontal', '#64748b');

  -- 4. Cria categorias padrão de receitas
  insert into public.categories (user_id, name, type, icon, color) values
    (new.id, 'Salário', 'income', 'briefcase', '#10b981'),
    (new.id, 'Investimentos', 'income', 'trending-up', '#06b6d4'),
    (new.id, 'Renda Extra', 'income', 'plus-circle', '#84cc16');

  return new;
end;
$$;

-- Registra a trigger na tabela auth.users do Supabase
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
