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

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  household_code text not null,
  game_title text not null,
  result text not null check (result in ('vitoria', 'derrota')),
  match_mode text not null default 'competitivo',
  xp_awarded integer not null default 0,
  happened_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.playnite_games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  household_code text not null,
  name text not null,
  platform text,
  tags text[] not null default '{}',
  playtime_hours numeric(10,2) not null default 0,
  play_count integer not null default 0,
  source text not null default 'playnite_json',
  is_competitive boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.availability_status (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  household_code text not null,
  status text not null check (status in ('online', 'topo_jogar', 'ocupado', 'ausente')),
  game_title text,
  available_at timestamptz,
  note text,
  notify_house boolean not null default false,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.household_notifications (
  id uuid primary key default gen_random_uuid(),
  household_code text not null,
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  message text,
  game_title text,
  created_at timestamptz not null default timezone('utc', now())
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
  select household_code from public.profiles where id = auth.uid()
$$;

alter table public.profiles enable row level security;
alter table public.matches enable row level security;
alter table public.playnite_games enable row level security;
alter table public.availability_status enable row level security;
alter table public.household_notifications enable row level security;

drop policy if exists "profiles_select_household" on public.profiles;
create policy "profiles_select_household"
on public.profiles
for select
to authenticated
using (household_code = public.current_household());

drop policy if exists "profiles_upsert_self" on public.profiles;
create policy "profiles_upsert_self"
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

drop policy if exists "matches_read_household" on public.matches;
create policy "matches_read_household"
on public.matches
for select
to authenticated
using (household_code = public.current_household());

drop policy if exists "matches_insert_self" on public.matches;
create policy "matches_insert_self"
on public.matches
for insert
to authenticated
with check (user_id = auth.uid() and household_code = public.current_household());

drop policy if exists "playnite_read_household" on public.playnite_games;
create policy "playnite_read_household"
on public.playnite_games
for select
to authenticated
using (household_code = public.current_household());

drop policy if exists "playnite_manage_self" on public.playnite_games;
create policy "playnite_manage_self"
on public.playnite_games
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and household_code = public.current_household());

drop policy if exists "availability_read_household" on public.availability_status;
create policy "availability_read_household"
on public.availability_status
for select
to authenticated
using (household_code = public.current_household());

drop policy if exists "availability_manage_self" on public.availability_status;
create policy "availability_manage_self"
on public.availability_status
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and household_code = public.current_household());

drop policy if exists "notifications_read_household" on public.household_notifications;
create policy "notifications_read_household"
on public.household_notifications
for select
to authenticated
using (household_code = public.current_household());

drop policy if exists "notifications_insert_self" on public.household_notifications;
create policy "notifications_insert_self"
on public.household_notifications
for insert
to authenticated
with check (author_id = auth.uid() and household_code = public.current_household());

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "Avatar publico" on storage.objects;
create policy "Avatar publico"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

drop policy if exists "Avatar upload proprio" on storage.objects;
create policy "Avatar upload proprio"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Avatar update proprio" on storage.objects;
create policy "Avatar update proprio"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Avatar delete proprio" on storage.objects;
create policy "Avatar delete proprio"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);
