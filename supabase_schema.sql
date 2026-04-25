-- =============================================
-- PLAYHUB - Schema Supabase
-- Execute no SQL Editor do Supabase Dashboard
-- =============================================

-- Extensão para UUIDs
create extension if not exists "uuid-ossp";

-- =============================================
-- TABELA: profiles (usuários da casa)
-- =============================================
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  nickname text unique not null,
  password_hash text not null, -- bcrypt hash
  avatar_url text,
  color text default '#00e5ff', -- cor do avatar
  xp integer default 0,
  level integer default 1,
  wins integer default 0,
  losses integer default 0,
  total_hours numeric(6,1) default 0,
  status text default 'offline' check (status in ('online','disponivel','jogando','offline')),
  status_game text,
  status_time text,
  last_seen timestamptz default now(),
  created_at timestamptz default now()
);

-- =============================================
-- TABELA: games (biblioteca de jogos)
-- =============================================
create table public.games (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  cover_emoji text default '🎮',
  genre text,
  is_coop boolean default false,
  is_competitive boolean default false,
  created_at timestamptz default now()
);

-- Jogos padrão
insert into public.games (name, cover_emoji, genre, is_coop, is_competitive) values
  ('Counter-Strike 2', '🎯', 'FPS', false, true),
  ('Valorant', '🏹', 'FPS', false, true),
  ('Minecraft', '⛏️', 'Sandbox', true, false),
  ('Rocket League', '🚀', 'Sports', false, true),
  ('Elden Ring', '⚔️', 'RPG', true, false),
  ('It Takes Two', '🤝', 'Co-op', true, false),
  ('Overcooked 2', '🍳', 'Co-op', true, false),
  ('FIFA 24', '⚽', 'Sports', false, true),
  ('Mario Kart 8', '🏎️', 'Racing', false, true),
  ('Among Us', '🚀', 'Social', false, false),
  ('Stardew Valley', '🌾', 'Simulation', true, false),
  ('Hollow Knight', '🦋', 'Platformer', false, false);

-- =============================================
-- TABELA: sessions (sessões "Partiu Jogar?")
-- =============================================
create table public.sessions (
  id uuid primary key default uuid_generate_v4(),
  host_id uuid references public.profiles(id) on delete cascade,
  game_id uuid references public.games(id),
  game_name text not null,
  scheduled_time text not null,
  mode text default 'casual' check (mode in ('casual','competitivo')),
  max_players integer default 4,
  message text,
  status text default 'aberta' check (status in ('aberta','em_jogo','encerrada')),
  created_at timestamptz default now()
);

-- =============================================
-- TABELA: session_players (quem entrou na sessão)
-- =============================================
create table public.session_players (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.sessions(id) on delete cascade,
  player_id uuid references public.profiles(id) on delete cascade,
  joined_at timestamptz default now(),
  unique(session_id, player_id)
);

-- =============================================
-- TABELA: matches (registro de partidas)
-- =============================================
create table public.matches (
  id uuid primary key default uuid_generate_v4(),
  game_id uuid references public.games(id),
  game_name text not null,
  mode text default 'casual' check (mode in ('casual','competitivo')),
  duration_minutes integer default 0,
  played_at timestamptz default now(),
  notes text,
  created_by uuid references public.profiles(id)
);

-- =============================================
-- TABELA: match_players (resultados por jogador)
-- =============================================
create table public.match_players (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references public.matches(id) on delete cascade,
  player_id uuid references public.profiles(id) on delete cascade,
  result text check (result in ('vitoria','derrota','empate','nao_competitivo')),
  xp_earned integer default 0,
  unique(match_id, player_id)
);

-- =============================================
-- TABELA: notifications
-- =============================================
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  to_player_id uuid references public.profiles(id) on delete cascade,
  from_player_id uuid references public.profiles(id),
  type text not null, -- 'session_invite','match_recorded','challenge_complete'
  message text not null,
  session_id uuid references public.sessions(id),
  read boolean default false,
  created_at timestamptz default now()
);

-- =============================================
-- TABELA: challenges (desafios semanais)
-- =============================================
create table public.challenges (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  type text not null, -- 'wins','hours','sessions','coop'
  target integer not null,
  xp_reward integer default 100,
  week_start date default date_trunc('week', current_date),
  active boolean default true
);

insert into public.challenges (title, description, type, target, xp_reward) values
  ('Rei do Sofá', 'Vença 5 partidas essa semana', 'wins', 5, 150),
  ('Maratonista', 'Jogue 10 horas no total', 'hours', 10, 200),
  ('Sociável', 'Entre em 3 sessões de outros jogadores', 'sessions', 3, 100);

-- =============================================
-- TABELA: challenge_progress
-- =============================================
create table public.challenge_progress (
  id uuid primary key default uuid_generate_v4(),
  challenge_id uuid references public.challenges(id),
  player_id uuid references public.profiles(id),
  current integer default 0,
  completed boolean default false,
  completed_at timestamptz,
  unique(challenge_id, player_id)
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.session_players enable row level security;
alter table public.matches enable row level security;
alter table public.match_players enable row level security;
alter table public.notifications enable row level security;
alter table public.games enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_progress enable row level security;

-- Políticas abertas para leitura (casa fechada)
create policy "Leitura pública profiles" on public.profiles for select using (true);
create policy "Leitura pública sessions" on public.sessions for select using (true);
create policy "Leitura pública session_players" on public.session_players for select using (true);
create policy "Leitura pública matches" on public.matches for select using (true);
create policy "Leitura pública match_players" on public.match_players for select using (true);
create policy "Leitura pública games" on public.games for select using (true);
create policy "Leitura pública challenges" on public.challenges for select using (true);
create policy "Leitura pública challenge_progress" on public.challenge_progress for select using (true);
create policy "Leitura pública notifications" on public.notifications for select using (true);

-- Políticas de escrita (via anon key - sem auth do Supabase)
create policy "Insert profiles" on public.profiles for insert with check (true);
create policy "Update profiles" on public.profiles for update using (true);
create policy "Insert sessions" on public.sessions for insert with check (true);
create policy "Update sessions" on public.sessions for update using (true);
create policy "Delete sessions" on public.sessions for delete using (true);
create policy "Insert session_players" on public.session_players for insert with check (true);
create policy "Delete session_players" on public.session_players for delete using (true);
create policy "Insert matches" on public.matches for insert with check (true);
create policy "Insert match_players" on public.match_players for insert with check (true);
create policy "Insert notifications" on public.notifications for insert with check (true);
create policy "Update notifications" on public.notifications for update using (true);
create policy "Insert challenge_progress" on public.challenge_progress for insert with check (true);
create policy "Update challenge_progress" on public.challenge_progress for update using (true);

-- =============================================
-- STORAGE: avatars bucket
-- =============================================
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
create policy "Avatar upload" on storage.objects for insert with check (bucket_id = 'avatars');
create policy "Avatar public read" on storage.objects for select using (bucket_id = 'avatars');
create policy "Avatar update" on storage.objects for update using (bucket_id = 'avatars');
