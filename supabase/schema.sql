create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text not null,
  household_code text not null,
  avatar_url text,
  favorite_game text,
  bio text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists display_name text;
alter table public.profiles add column if not exists household_code text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists favorite_game text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists created_at timestamptz default timezone('utc', now());

update public.profiles
set
  username = coalesce(nullif(username, ''), split_part(id::text, '-', 1)),
  display_name = coalesce(nullif(display_name, ''), coalesce(nullif(username, ''), split_part(id::text, '-', 1))),
  household_code = coalesce(nullif(household_code, ''), 'sala-1')
where
  username is null
  or display_name is null
  or household_code is null
  or username = ''
  or display_name = ''
  or household_code = '';

alter table public.profiles alter column username set not null;
alter table public.profiles alter column display_name set not null;
alter table public.profiles alter column household_code set not null;
create unique index if not exists profiles_username_key on public.profiles (username);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  household_code text not null,
  game_title text not null,
  result text not null default 'vitoria',
  match_mode text not null default 'competitivo',
  xp_awarded integer not null default 0,
  happened_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  winner_user_id uuid references public.profiles (id) on delete set null,
  loser_user_id uuid references public.profiles (id) on delete set null,
  winner_name text,
  loser_name text,
  notes text
);

alter table public.matches add column if not exists user_id uuid;
alter table public.matches add column if not exists household_code text;
alter table public.matches add column if not exists game_title text;
alter table public.matches add column if not exists result text default 'vitoria';
alter table public.matches add column if not exists match_mode text default 'competitivo';
alter table public.matches add column if not exists xp_awarded integer default 0;
alter table public.matches add column if not exists happened_at timestamptz default timezone('utc', now());
alter table public.matches add column if not exists created_at timestamptz default timezone('utc', now());
alter table public.matches add column if not exists winner_user_id uuid;
alter table public.matches add column if not exists loser_user_id uuid;
alter table public.matches add column if not exists winner_name text;
alter table public.matches add column if not exists loser_name text;
alter table public.matches add column if not exists notes text;

create table if not exists public.playnite_games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  household_code text not null,
  external_id text,
  name text not null,
  source text,
  platform text,
  playtime_seconds bigint not null default 0,
  playtime_hours numeric(10,2) not null default 0,
  playtime_label text,
  last_activity_at timestamptz,
  last_activity_label text,
  added_at timestamptz,
  modified_at timestamptz,
  release_date date,
  completion_status text,
  user_score integer,
  community_score integer,
  genres text[] not null default '{}',
  tags text[] not null default '{}',
  developers text[] not null default '{}',
  description text,
  detail_path text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.playnite_games add column if not exists user_id uuid;
alter table public.playnite_games add column if not exists household_code text;
alter table public.playnite_games add column if not exists external_id text;
alter table public.playnite_games add column if not exists name text;
alter table public.playnite_games add column if not exists source text;
alter table public.playnite_games add column if not exists platform text;
alter table public.playnite_games add column if not exists playtime_seconds bigint default 0;
alter table public.playnite_games add column if not exists playtime_hours numeric(10,2) default 0;
alter table public.playnite_games add column if not exists playtime_label text;
alter table public.playnite_games add column if not exists last_activity_at timestamptz;
alter table public.playnite_games add column if not exists last_activity_label text;
alter table public.playnite_games add column if not exists added_at timestamptz;
alter table public.playnite_games add column if not exists modified_at timestamptz;
alter table public.playnite_games add column if not exists release_date date;
alter table public.playnite_games add column if not exists completion_status text;
alter table public.playnite_games add column if not exists user_score integer;
alter table public.playnite_games add column if not exists community_score integer;
alter table public.playnite_games add column if not exists genres text[] default '{}';
alter table public.playnite_games add column if not exists tags text[] default '{}';
alter table public.playnite_games add column if not exists developers text[] default '{}';
alter table public.playnite_games add column if not exists description text;
alter table public.playnite_games add column if not exists detail_path text;
alter table public.playnite_games add column if not exists created_at timestamptz default timezone('utc', now());

update public.playnite_games
set external_id = coalesce(nullif(external_id, ''), id::text)
where external_id is null or external_id = '';

create unique index if not exists playnite_games_user_external_id_key on public.playnite_games (user_id, external_id);

create table if not exists public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  household_code text not null,
  status text not null check (status in ('topo_jogar', 'online_now', 'marcado', 'ocupado')),
  game_title text,
  starts_at timestamptz not null default timezone('utc', now()),
  ends_at timestamptz,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.playnite_import_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  household_code text not null,
  imported_games_count integer not null default 0,
  source_type text not null default 'playnite_html_export',
  summary jsonb not null default '{}'::jsonb,
  imported_at timestamptz not null default timezone('utc', now())
);

create or replace function public.ensure_profile_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, household_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'household_code', 'sala-1')
  )
  on conflict (id) do update set
    username = excluded.username,
    display_name = excluded.display_name,
    household_code = excluded.household_code;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.ensure_profile_from_auth();

create or replace function public.current_household()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select p.household_code
  from public.profiles as p
  where p.id = auth.uid()
  limit 1
$$;

alter table public.profiles enable row level security;
alter table public.matches enable row level security;
alter table public.playnite_games enable row level security;
alter table public.availability_slots enable row level security;
alter table public.playnite_import_runs enable row level security;

drop policy if exists "profiles_select_household" on public.profiles;
create policy "profiles_select_household"
on public.profiles
for select
to authenticated
using (household_code = public.current_household());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "matches_select_household" on public.matches;
create policy "matches_select_household"
on public.matches
for select
to authenticated
using (household_code = public.current_household());

drop policy if exists "matches_manage_self" on public.matches;
create policy "matches_manage_self"
on public.matches
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and household_code = public.current_household());

drop policy if exists "playnite_games_select_household" on public.playnite_games;
create policy "playnite_games_select_household"
on public.playnite_games
for select
to authenticated
using (household_code = public.current_household());

drop policy if exists "playnite_games_manage_self" on public.playnite_games;
create policy "playnite_games_manage_self"
on public.playnite_games
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and household_code = public.current_household());

drop policy if exists "availability_slots_select_household" on public.availability_slots;
create policy "availability_slots_select_household"
on public.availability_slots
for select
to authenticated
using (household_code = public.current_household());

drop policy if exists "availability_slots_manage_self" on public.availability_slots;
create policy "availability_slots_manage_self"
on public.availability_slots
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and household_code = public.current_household());

drop policy if exists "playnite_import_runs_select_household" on public.playnite_import_runs;
create policy "playnite_import_runs_select_household"
on public.playnite_import_runs
for select
to authenticated
using (household_code = public.current_household());

drop policy if exists "playnite_import_runs_manage_self" on public.playnite_import_runs;
create policy "playnite_import_runs_manage_self"
on public.playnite_import_runs
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and household_code = public.current_household());

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

drop policy if exists "avatars_insert_self" on storage.objects;
create policy "avatars_insert_self"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "avatars_update_self" on storage.objects;
create policy "avatars_update_self"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "avatars_delete_self" on storage.objects;
create policy "avatars_delete_self"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);
