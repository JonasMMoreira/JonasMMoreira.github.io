import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const config = window.APP_CONFIG ?? {};
const configReady =
  typeof config.supabaseUrl === "string" &&
  config.supabaseUrl.startsWith("https://") &&
  typeof config.supabaseAnonKey === "string" &&
  config.supabaseAnonKey.length > 20 &&
  !config.supabaseUrl.includes("YOUR-PROJECT") &&
  !config.supabaseAnonKey.includes("YOUR-ANON-KEY");

const supabase = configReady
  ? createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      }
    })
  : null;

const state = {
  session: null,
  profile: null,
  profiles: [],
  availabilitySlots: [],
  matches: [],
  games: [],
  importRuns: [],
  refreshTimer: null,
  schemaWarningShown: false,
  libraryQuery: ""
};

const refs = {
  configBanner: document.querySelector("#config-banner"),
  authPanel: document.querySelector("#auth-panel"),
  appShell: document.querySelector("#app-shell"),
  logoutButton: document.querySelector("#logout-button"),
  authChip: document.querySelector("#auth-chip"),
  authChipAvatar: document.querySelector("#auth-chip-avatar"),
  authChipName: document.querySelector("#auth-chip-name"),
  authChipHouse: document.querySelector("#auth-chip-house"),
  loginForm: document.querySelector("#login-form"),
  registerForm: document.querySelector("#register-form"),
  navTabs: [...document.querySelectorAll("[data-tab]")],
  goTabButtons: [...document.querySelectorAll("[data-go-tab]")],
  panels: [...document.querySelectorAll(".tab-panel")],
  statOnlineToday: document.querySelector("#stat-online-today"),
  statOnlineTodayMeta: document.querySelector("#stat-online-today-meta"),
  statNextSession: document.querySelector("#stat-next-session"),
  statNextSessionMeta: document.querySelector("#stat-next-session-meta"),
  statKing: document.querySelector("#stat-king"),
  statKingMeta: document.querySelector("#stat-king-meta"),
  statSync: document.querySelector("#stat-sync"),
  statSyncMeta: document.querySelector("#stat-sync-meta"),
  homeAvailabilityPreview: document.querySelector("#home-availability-preview"),
  pulseGrid: document.querySelector("#pulse-grid"),
  onlineNowList: document.querySelector("#online-now-list"),
  nextSessionsList: document.querySelector("#next-sessions-list"),
  homeMatchFeed: document.querySelector("#home-match-feed"),
  recentActivityList: document.querySelector("#recent-activity-list"),
  availabilityForm: document.querySelector("#availability-form"),
  availabilityStart: document.querySelector("#availability-start"),
  availabilityEnd: document.querySelector("#availability-end"),
  availabilityList: document.querySelector("#availability-list"),
  matchForm: document.querySelector("#match-form"),
  matchGame: document.querySelector("#match-game"),
  matchWinner: document.querySelector("#match-winner"),
  matchLoser: document.querySelector("#match-loser"),
  matchPlayedAt: document.querySelector("#match-played-at"),
  leaderboardList: document.querySelector("#leaderboard-list"),
  matchHistoryList: document.querySelector("#match-history-list"),
  playniteForm: document.querySelector("#playnite-form"),
  playniteFolder: document.querySelector("#playnite-folder"),
  exportBackupButton: document.querySelector("#export-backup-button"),
  syncHistoryList: document.querySelector("#sync-history-list"),
  playniteHistoryList: document.querySelector("#playnite-history-list"),
  librarySearch: document.querySelector("#library-search"),
  libraryGrid: document.querySelector("#library-grid"),
  profileAvatar: document.querySelector("#profile-avatar"),
  profileTitle: document.querySelector("#profile-title"),
  profileSubtitle: document.querySelector("#profile-subtitle"),
  profileForm: document.querySelector("#profile-form"),
  profileUsername: document.querySelector("#profile-username"),
  profileDisplayName: document.querySelector("#profile-display-name"),
  profileHousehold: document.querySelector("#profile-household"),
  profileFavoriteGame: document.querySelector("#profile-favorite-game"),
  profileBio: document.querySelector("#profile-bio"),
  avatarInput: document.querySelector("#avatar-input"),
  gameTitles: document.querySelector("#game-titles"),
  toastRegion: document.querySelector("#toast-region")
};

init();

async function init() {
  bindEvents();
  setDefaultDateInputs();

  if (!configReady) {
    refs.configBanner.classList.remove("hidden");
    return;
  }

  const { data } = await supabase.auth.getSession();
  state.session = data.session;
  await handleSessionChanged(state.session);

  supabase.auth.onAuthStateChange(async (_event, session) => {
    state.session = session;
    await handleSessionChanged(session);
  });
}

function bindEvents() {
  refs.navTabs.forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.tab));
  });

  refs.goTabButtons.forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.goTab));
  });

  refs.loginForm.addEventListener("submit", onLogin);
  refs.registerForm.addEventListener("submit", onRegister);
  refs.logoutButton.addEventListener("click", onLogout);
  refs.availabilityForm.addEventListener("submit", onAvailabilitySubmit);
  refs.matchForm.addEventListener("submit", onMatchSubmit);
  refs.playniteForm.addEventListener("submit", onPlayniteImport);
  refs.exportBackupButton.addEventListener("click", onExportBackup);
  refs.librarySearch.addEventListener("input", (event) => {
    state.libraryQuery = event.currentTarget.value.trim().toLowerCase();
    renderLibraryGrid();
  });
  refs.profileForm.addEventListener("submit", onProfileSubmit);
  refs.avatarInput.addEventListener("change", onAvatarSelected);
}

async function handleSessionChanged(session) {
  const loggedIn = Boolean(session?.user);

  refs.authPanel.classList.toggle("hidden", loggedIn);
  refs.appShell.classList.toggle("hidden", !loggedIn);
  refs.logoutButton.classList.toggle("hidden", !loggedIn);
  refs.authChip.classList.toggle("hidden", !loggedIn);

  if (!loggedIn) {
    stopPolling();
    state.profile = null;
    state.profiles = [];
    state.availabilitySlots = [];
    state.matches = [];
    state.games = [];
    state.importRuns = [];
    renderAll();
    return;
  }

  setTab("home");
  await ensureProfileRow();
  await loadAppData();
  startPolling();
}

function startPolling() {
  stopPolling();
  state.refreshTimer = window.setInterval(async () => {
    if (state.session?.user) {
      await loadAppData({ silent: true });
    }
  }, 60000);
}

function stopPolling() {
  if (state.refreshTimer) {
    window.clearInterval(state.refreshTimer);
    state.refreshTimer = null;
  }
}

function setTab(tabName) {
  refs.navTabs.forEach((button) => button.classList.toggle("active", button.dataset.tab === tabName));
  refs.panels.forEach((panel) => panel.classList.toggle("active", panel.id === `${tabName}-tab`));
}

async function onLogin(event) {
  event.preventDefault();
  if (!supabase) {
    showToast("Supabase nao configurado", "Preencha o config.js antes de tentar entrar.");
    return;
  }
  const formData = new FormData(event.currentTarget);
  const username = sanitizeUsername(formData.get("username"));
  const password = String(formData.get("password") ?? "");

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: buildInternalEmail(username),
      password
    });

    if (error) {
      throw error;
    }

    event.currentTarget.reset();
    showToast("Sessao iniciada", `Bem-vindo de volta, ${username}.`);
  } catch (error) {
    showToast("Falha no login", friendlyError(error));
  }
}

async function onRegister(event) {
  event.preventDefault();
  if (!supabase) {
    showToast("Supabase nao configurado", "Preencha o config.js antes de criar conta.");
    return;
  }
  const formData = new FormData(event.currentTarget);
  const username = sanitizeUsername(formData.get("username"));
  const displayName = sanitizeText(formData.get("displayName"), 40);
  const householdCode = sanitizeHousehold(formData.get("householdCode"));
  const password = String(formData.get("password") ?? "");

  if (!username || !displayName || !householdCode) {
    showToast("Cadastro incompleto", "Preencha usuario, nome exibido e codigo da casa.");
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: buildInternalEmail(username),
      password,
      options: {
        data: {
          username,
          display_name: displayName,
          household_code: householdCode
        }
      }
    });

    if (error) {
      throw error;
    }

    if (!data.session) {
      showToast("Conta criada", "Cadastro criado, mas o projeto ainda pede confirmacao de email no Supabase.");
    } else {
      showToast("Conta criada", `${displayName} entrou na casa ${householdCode}.`);
    }

    event.currentTarget.reset();
  } catch (error) {
    showToast("Falha no cadastro", friendlyError(error));
  }
}

async function onLogout() {
  if (!supabase) {
    return;
  }
  const { error } = await supabase.auth.signOut();
  if (error) {
    showToast("Falha ao sair", friendlyError(error));
    return;
  }

  showToast("Sessao encerrada", "Ate a proxima jogatina.");
}

async function ensureProfileRow() {
  const user = state.session?.user;
  if (!user) {
    return;
  }

  const metadata = user.user_metadata ?? {};
  const username = sanitizeUsername(metadata.username || user.email?.split("@")[0] || "jogador");
  const displayName = sanitizeText(metadata.display_name || username, 40);
  const householdCode = sanitizeHousehold(metadata.household_code || "sala-1");

  const payload = {
    id: user.id,
    username,
    display_name: displayName,
    household_code: householdCode
  };

  const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
  if (error) {
    showToast("Perfil inicial", friendlyError(error));
  }
}

async function loadAppData(options = {}) {
  if (!state.session?.user) {
    return;
  }

  const profileResult = await supabase.from("profiles").select("*").eq("id", state.session.user.id).single();
  if (profileResult.error) {
    showToast("Falha ao carregar perfil", friendlyError(profileResult.error));
    return;
  }

  state.profile = profileResult.data;

  const householdCode = state.profile.household_code;
  const [profiles, availabilitySlots, matches, games, importRuns] = await Promise.all([
    safeSelect("profiles", supabase.from("profiles").select("*").eq("household_code", householdCode).order("display_name")),
    safeSelect(
      "availability_slots",
      supabase.from("availability_slots").select("*").eq("household_code", householdCode).order("starts_at")
    ),
    safeSelect(
      "matches",
      supabase.from("matches").select("*").eq("household_code", householdCode).order("happened_at", { ascending: false }).limit(80)
    ),
    safeSelect(
      "playnite_games",
      supabase.from("playnite_games").select("*").eq("household_code", householdCode).order("last_activity_at", { ascending: false })
    ),
    safeSelect(
      "playnite_import_runs",
      supabase.from("playnite_import_runs").select("*").eq("household_code", householdCode).order("imported_at", { ascending: false }).limit(12)
    )
  ]);

  state.profiles = profiles;
  state.availabilitySlots = availabilitySlots;
  state.matches = matches;
  state.games = games;
  state.importRuns = importRuns;

  renderAll();

  if (!options.silent) {
    showToast("GameHub atualizado", "Dados sincronizados com o Supabase.");
  }
}

async function safeSelect(tableName, queryPromise) {
  const { data, error } = await queryPromise;
  if (error) {
    if (!state.schemaWarningShown) {
      state.schemaWarningShown = true;
      showToast("Schema pendente", `Rode o schema atualizado do Supabase para liberar a tabela ${tableName}.`);
    }
    return [];
  }
  return data ?? [];
}

function renderAll() {
  renderAuthChip();
  renderSummary();
  renderHeroAvailabilityPreview();
  renderPulse();
  renderOnlineNow();
  renderNextSessions();
  renderHomeMatchFeed();
  renderRecentActivity();
  renderAvailabilityList();
  renderLeaderboard();
  renderMatchHistory();
  renderSyncHistory();
  renderPlayniteHistory();
  renderLibraryGrid();
  renderProfile();
  populateProfileSelects();
  populateGameDataList();
}

function renderAuthChip() {
  if (!state.profile) {
    refs.authChipAvatar.src = placeholderAvatar();
    refs.authChipName.textContent = "Jogador";
    refs.authChipHouse.textContent = "Casa";
    return;
  }

  refs.authChipAvatar.src = state.profile.avatar_url || placeholderAvatar(state.profile.display_name);
  refs.authChipName.textContent = state.profile.display_name;
  refs.authChipHouse.textContent = `Casa ${state.profile.household_code}`;
}

function renderSummary() {
  const todayEntries = getUpcomingAvailability(24);
  const onlineNow = getOnlineNowEntries();
  const nextSession = todayEntries[0];
  const ranking = buildRanking();
  const king = ranking[0];
  const latestRun = state.importRuns[0];

  refs.statOnlineToday.textContent = String(onlineNow.length);
  refs.statOnlineTodayMeta.textContent = onlineNow.length
    ? `${onlineNow[0].display_name} e a galera ja deram sinal`
    : "Sem marcacoes ainda.";

  refs.statNextSession.textContent = nextSession ? formatShortDateTime(nextSession.starts_at) : "Sem horario";
  refs.statNextSessionMeta.textContent = nextSession
    ? `${nextSession.display_name} quer jogar ${nextSession.game_title || "algo da biblioteca"}`
    : "Preencha a agenda para aparecer aqui.";

  refs.statKing.textContent = king ? king.name : "Sem dados";
  refs.statKingMeta.textContent = king ? `${king.wins} vitorias e ${king.losses} derrotas` : "Registre partidas para abrir o ranking.";

  refs.statSync.textContent = latestRun ? formatRelative(latestRun.imported_at) : "Nunca";
  refs.statSyncMeta.textContent = latestRun
    ? `${latestRun.imported_games_count || 0} jogos sincronizados na ultima importacao`
    : "Importe a pasta exportada para sincronizar.";
}

function renderHeroAvailabilityPreview() {
  const entries = getUpcomingAvailability(48).slice(0, 3);
  refs.homeAvailabilityPreview.innerHTML = entries.length
    ? entries.map(renderAvailabilityItem).join("")
    : emptyCard("Ninguem marcou horario ainda", "Quando a galera preencher a agenda, o radar da casa aparece aqui.");
}

function renderPulse() {
  const onlineNow = getOnlineNowEntries().length;
  const upcoming = getUpcomingAvailability(72).length;
  const recentActivity = state.games.filter((game) => game.last_activity_at).length;
  const ranking = buildRanking();
  const totalPlaytimeSeconds = state.games.reduce((sum, game) => sum + Number(game.playtime_seconds ?? 0), 0);

  const cards = [
    {
      label: "Jogando ou quase",
      value: `${onlineNow}`,
      meta: onlineNow ? "A casa esta se organizando agora." : "Ninguem sinalizou disponibilidade neste instante."
    },
    {
      label: "Horarios marcados",
      value: `${upcoming}`,
      meta: upcoming ? "Existem combinados futuros ja salvos." : "A agenda precisa de horario e dia marcados."
    },
    {
      label: "Partidas registradas",
      value: `${state.matches.length}`,
      meta: ranking.length ? `${ranking[0].name} lidera a Arena atualmente.` : "Quando as partidas entrarem, o pulso competitivo aparece aqui."
    },
    {
      label: "Historico Playnite",
      value: formatDuration(totalPlaytimeSeconds),
      meta: recentActivity ? `${recentActivity} jogos com atividade importada.` : "Importe o export HTML do Playnite para preencher a memoria da biblioteca."
    }
  ];

  refs.pulseGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="pulse-card">
          <p>${escapeHtml(card.label)}</p>
          <strong>${escapeHtml(card.value)}</strong>
          <small>${escapeHtml(card.meta)}</small>
        </article>
      `
    )
    .join("");
}

function renderOnlineNow() {
  const entries = getOnlineNowEntries();
  refs.onlineNowList.innerHTML = entries.length
    ? entries.map(renderAvailabilityItem).join("")
    : emptyCard("Ninguem online agora", "Use a agenda para dizer quando vai entrar ou quando topa jogar.");
}

function renderNextSessions() {
  const entries = getUpcomingAvailability(120).slice(0, 8);
  refs.nextSessionsList.innerHTML = entries.length
    ? entries.map(renderAvailabilityItem).join("")
    : emptyCard("Sem horarios salvos", "Marque dia e hora certinhos para facilitar a jogatina.");
}

function renderHomeMatchFeed() {
  refs.homeMatchFeed.innerHTML = state.matches.length
    ? state.matches.slice(0, 6).map(renderMatchItem).join("")
    : emptyCard("Nenhuma partida registrada", "Quando alguem vencer, o historico da Arena aparece aqui.");
}

function renderRecentActivity() {
  const recentGames = getRecentGames().slice(0, 6);
  refs.recentActivityList.innerHTML = recentGames.length
    ? recentGames.map(renderGameHistoryItem).join("")
    : emptyCard("Historico Playnite vazio", "Sincronize a pasta exportada para mostrar o que voce jogou recentemente.");
}

function renderAvailabilityList() {
  const entries = getUpcomingAvailability(240);
  refs.availabilityList.innerHTML = entries.length
    ? entries.map(renderAvailabilityItem).join("")
    : emptyCard("Agenda vazia", "Cadastre horarios com dia e hora para a casa se organizar.");
}

function renderLeaderboard() {
  const ranking = buildRanking();
  refs.leaderboardList.innerHTML = ranking.length
    ? ranking.map(renderRankingItem).join("")
    : emptyCard("Ranking vazio", "A Arena precisa de partidas para descobrir quem manda no sofa.");
}

function renderMatchHistory() {
  refs.matchHistoryList.innerHTML = state.matches.length
    ? state.matches.slice(0, 20).map(renderMatchItem).join("")
    : emptyCard("Sem historico de partidas", "Use o formulario ao lado para registrar vencedores e derrotados.");
}

function renderSyncHistory() {
  refs.syncHistoryList.innerHTML = state.importRuns.length
    ? state.importRuns.map(renderSyncRunItem).join("")
    : emptyCard("Nenhuma sincronizacao", "A primeira importacao da pasta HTML do Playnite aparece aqui.");
}

function renderPlayniteHistory() {
  const recentGames = getRecentGames().slice(0, 20);
  refs.playniteHistoryList.innerHTML = recentGames.length
    ? recentGames.map(renderGameHistoryItem).join("")
    : emptyCard("Sem atividade importada", "Quando o Playnite entrar no site, o historico da biblioteca aparece aqui.");
}

function renderLibraryGrid() {
  const items = state.games.filter(matchesLibraryQuery).slice(0, 120);
  refs.libraryGrid.innerHTML = items.length
    ? items.map(renderLibraryCard).join("")
    : emptyCard("Nenhum jogo encontrado", "Ajuste a busca ou sincronize uma biblioteca do Playnite.");
}

function renderProfile() {
  if (!state.profile) {
    refs.profileAvatar.src = placeholderAvatar();
    refs.profileTitle.textContent = "Seu card gamer";
    refs.profileSubtitle.textContent = "Atualize sua identidade da casa.";
    return;
  }

  refs.profileAvatar.src = state.profile.avatar_url || placeholderAvatar(state.profile.display_name);
  refs.profileTitle.textContent = state.profile.display_name;
  refs.profileSubtitle.textContent = `@${state.profile.username} na casa ${state.profile.household_code}`;
  refs.profileUsername.value = state.profile.username || "";
  refs.profileDisplayName.value = state.profile.display_name || "";
  refs.profileHousehold.value = state.profile.household_code || "";
  refs.profileFavoriteGame.value = state.profile.favorite_game || "";
  refs.profileBio.value = state.profile.bio || "";
}

function populateProfileSelects() {
  const profileOptions = state.profiles.length ? state.profiles : [];
  const options = profileOptions.length
    ? profileOptions
        .map((profile) => `<option value="${escapeHtmlAttr(profile.id)}">${escapeHtml(profile.display_name)}</option>`)
        .join("")
    : '<option value="">Nenhum jogador</option>';

  refs.matchWinner.innerHTML = options;
  refs.matchLoser.innerHTML = options;

  if (profileOptions.length) {
    const winnerId = profileOptions.find((profile) => profile.id === state.profile?.id)?.id || profileOptions[0].id;
    refs.matchWinner.value = winnerId;

    const fallbackLoser = profileOptions.find((profile) => profile.id !== winnerId) || profileOptions[0];
    refs.matchLoser.value = fallbackLoser.id;
  }
}

function populateGameDataList() {
  const uniqueNames = [...new Set(state.games.map((game) => game.name).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right, "pt-BR")
  );

  refs.gameTitles.innerHTML = uniqueNames
    .map((name) => `<option value="${escapeHtmlAttr(name)}"></option>`)
    .join("");
}

async function onAvailabilitySubmit(event) {
  event.preventDefault();

  if (!state.profile) {
    return;
  }

  const formData = new FormData(event.currentTarget);
  const startsAt = String(formData.get("startsAt") ?? "");
  const endsAt = String(formData.get("endsAt") ?? "");
  const payload = {
    user_id: state.profile.id,
    household_code: state.profile.household_code,
    status: String(formData.get("status") ?? "topo_jogar"),
    game_title: sanitizeText(formData.get("gameTitle"), 80) || null,
    starts_at: new Date(startsAt).toISOString(),
    ends_at: endsAt ? new Date(endsAt).toISOString() : null,
    note: sanitizeText(formData.get("note"), 180) || null
  };

  const { error } = await supabase.from("availability_slots").insert(payload);
  if (error) {
    showToast("Falha ao salvar agenda", friendlyError(error));
    return;
  }

  event.currentTarget.reset();
  setDefaultDateInputs();
  showToast("Agenda salva", "Seu horario foi compartilhado com a casa.");
  await loadAppData({ silent: true });
}

async function onMatchSubmit(event) {
  event.preventDefault();

  if (!state.profile) {
    return;
  }

  const formData = new FormData(event.currentTarget);
  const winnerUserId = String(formData.get("winnerUserId") ?? "");
  const loserUserId = String(formData.get("loserUserId") ?? "");

  if (!winnerUserId || !loserUserId || winnerUserId === loserUserId) {
    showToast("Partida invalida", "Escolha um vencedor e um derrotado diferentes.");
    return;
  }

  const profilesById = mapProfilesById();
  const winner = profilesById.get(winnerUserId);
  const loser = profilesById.get(loserUserId);

  const payload = {
    user_id: state.profile.id,
    household_code: state.profile.household_code,
    game_title: sanitizeText(formData.get("gameTitle"), 80),
    result: "vitoria",
    match_mode: "competitivo",
    xp_awarded: 0,
    happened_at: new Date(String(formData.get("playedAt"))).toISOString(),
    winner_user_id: winnerUserId,
    loser_user_id: loserUserId,
    winner_name: winner?.display_name || "Jogador",
    loser_name: loser?.display_name || "Jogador",
    notes: sanitizeText(formData.get("notes"), 180) || null
  };

  const { error } = await supabase.from("matches").insert(payload);
  if (error) {
    showToast("Falha ao registrar partida", friendlyError(error));
    return;
  }

  event.currentTarget.reset();
  refs.matchPlayedAt.value = toDatetimeLocal(new Date());
  showToast("Partida registrada", `${payload.winner_name} venceu ${payload.loser_name}.`);
  await loadAppData({ silent: true });
}

async function onPlayniteImport(event) {
  event.preventDefault();

  if (!state.profile) {
    return;
  }

  const files = [...(refs.playniteFolder.files ?? [])];
  if (!files.length) {
    showToast("Pasta faltando", "Selecione a pasta exportada do Playnite.");
    return;
  }

  try {
    const importedGames = await parsePlayniteExport(files, state.profile);
    if (!importedGames.length) {
      showToast("Importacao vazia", "Nao consegui encontrar jogos validos no export HTML.");
      return;
    }

    const currentMine = state.games.filter((game) => game.user_id === state.profile.id);
    const currentById = new Map(currentMine.map((game) => [game.external_id, game]));
    const importedIds = new Set(importedGames.map((game) => game.external_id));
    const removed = currentMine.filter((game) => !importedIds.has(game.external_id));
    const addedCount = importedGames.filter((game) => !currentById.has(game.external_id)).length;
    const updatedCount = importedGames.filter((game) => {
      const previous = currentById.get(game.external_id);
      if (!previous) {
        return false;
      }
      return (
        Number(previous.playtime_seconds ?? 0) !== Number(game.playtime_seconds ?? 0) ||
        String(previous.last_activity_at ?? "") !== String(game.last_activity_at ?? "")
      );
    }).length;

    if (removed.length) {
      const deleteResult = await supabase
        .from("playnite_games")
        .delete()
        .eq("user_id", state.profile.id)
        .in("external_id", removed.map((game) => game.external_id));
      if (deleteResult.error) {
        throw deleteResult.error;
      }
    }

    const upsertResult = await supabase.from("playnite_games").upsert(importedGames, {
      onConflict: "user_id,external_id"
    });

    if (upsertResult.error) {
      throw upsertResult.error;
    }

    const importRun = {
      user_id: state.profile.id,
      household_code: state.profile.household_code,
      imported_games_count: importedGames.length,
      source_type: "playnite_html_export",
      summary: {
        added: addedCount,
        updated: updatedCount,
        removed: removed.length
      }
    };

    const runResult = await supabase.from("playnite_import_runs").insert(importRun);
    if (runResult.error) {
      throw runResult.error;
    }

    refs.playniteForm.reset();
    showToast("Playnite sincronizado", `${importedGames.length} jogos importados para o GameHub.`);
    await loadAppData({ silent: true });
  } catch (error) {
    showToast("Falha na sincronizacao", friendlyError(error));
  }
}

async function onProfileSubmit(event) {
  event.preventDefault();

  if (!state.profile) {
    return;
  }

  const formData = new FormData(event.currentTarget);
  const payload = {
    id: state.profile.id,
    username: state.profile.username,
    display_name: sanitizeText(formData.get("displayName"), 40),
    household_code: sanitizeHousehold(formData.get("householdCode")),
    favorite_game: sanitizeText(formData.get("favoriteGame"), 80) || null,
    bio: sanitizeText(formData.get("bio"), 180) || null,
    avatar_url: state.profile.avatar_url || null
  };

  const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
  if (error) {
    showToast("Falha ao salvar perfil", friendlyError(error));
    return;
  }

  showToast("Perfil salvo", "Seu card gamer foi atualizado.");
  await loadAppData({ silent: true });
}

async function onAvatarSelected(event) {
  const file = event.target.files?.[0];
  if (!file || !state.profile) {
    return;
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const filePath = `${state.profile.id}/${Date.now()}.${extension}`;

  const uploadResult = await supabase.storage.from("avatars").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true
  });

  if (uploadResult.error) {
    showToast("Falha no upload", friendlyError(uploadResult.error));
    return;
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  const updateResult = await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", state.profile.id);
  if (updateResult.error) {
    showToast("Falha ao salvar avatar", friendlyError(updateResult.error));
    return;
  }

  event.target.value = "";
  showToast("Avatar atualizado", "Sua foto de perfil ja foi salva.");
  await loadAppData({ silent: true });
}

function onExportBackup() {
  if (!state.profile) {
    return;
  }

  const backup = {
    exported_at: new Date().toISOString(),
    household_code: state.profile.household_code,
    profiles: state.profiles,
    availability_slots: state.availabilitySlots,
    matches: state.matches,
    playnite_games: state.games,
    playnite_import_runs: state.importRuns
  };

  downloadJsonFile(`gamehub-backup-${state.profile.household_code}.json`, backup);
  showToast("Backup pronto", "Baixei um snapshot do GameHub em JSON.");
}

async function parsePlayniteExport(files, profile) {
  const rootIndexFile = pickRootIndexFile(files);
  if (!rootIndexFile) {
    throw new Error("Nao encontrei o index.html principal dentro da pasta exportada.");
  }

  const filesByName = new Map(files.map((file) => [file.name.toLowerCase(), file]));
  const indexHtml = await rootIndexFile.text();
  const documentNode = new DOMParser().parseFromString(indexHtml, "text/html");
  const rows = [...documentNode.querySelectorAll("td.tdname")]
    .map((cell) => cell.closest("tr"))
    .filter(Boolean);

  const games = await Promise.all(
    rows.map(async (row) => {
      const cells = [...row.querySelectorAll("td")];
      const nameLink = row.querySelector("td.tdname a");
      const detailPath = nameLink?.getAttribute("href") || "";
      const externalId = detailPath.replace(".html", "").trim();
      const name = decodeHtml(nameLink?.textContent?.trim() || "");
      const indexData = {
        lastActivityLabel: decodeHtml(cells[3]?.textContent?.trim() || ""),
        addedLabel: decodeHtml(cells[4]?.textContent?.trim() || ""),
        playtimeLabel: decodeHtml(cells[5]?.textContent?.trim() || ""),
        source: decodeHtml(cells[6]?.textContent?.trim() || ""),
        platform: decodeHtml(cells[7]?.textContent?.trim() || "")
      };

      const detailFile = filesByName.get(detailPath.toLowerCase());
      const detailData = detailFile ? await parsePlayniteDetailFile(detailFile) : {};

      const playtimeLabel = detailData.playtimeLabel || indexData.playtimeLabel;
      const lastActivityLabel = detailData.lastActivityLabel || indexData.lastActivityLabel;
      const addedLabel = detailData.addedLabel || indexData.addedLabel;

      return {
        user_id: profile.id,
        household_code: profile.household_code,
        external_id: externalId || sanitizeUsername(name),
        name,
        source: detailData.source || indexData.source || null,
        platform: detailData.platform || indexData.platform || null,
        playtime_seconds: parseDurationToSeconds(playtimeLabel),
        playtime_hours: secondsToHours(parseDurationToSeconds(playtimeLabel)),
        playtime_label: playtimeLabel || null,
        last_activity_at: parsePtDateTime(detailData.lastActivityRaw || lastActivityLabel),
        last_activity_label: lastActivityLabel || null,
        added_at: parsePtDateTime(detailData.addedRaw || addedLabel),
        modified_at: parsePtDateTime(detailData.modifiedRaw || ""),
        release_date: parsePtDate(detailData.releaseDateRaw || ""),
        completion_status: detailData.completionStatus || null,
        user_score: toNullableNumber(detailData.userScore),
        community_score: toNullableNumber(detailData.communityScore),
        genres: detailData.genres || [],
        tags: detailData.tags || [],
        developers: detailData.developers || [],
        description: detailData.description || null,
        detail_path: detailPath || null
      };
    })
  );

  return games.filter((game) => game.name);
}

function pickRootIndexFile(files) {
  return [...files]
    .filter((file) => file.name.toLowerCase() === "index.html")
    .sort((left, right) => (left.webkitRelativePath || left.name).length - (right.webkitRelativePath || right.name).length)[0];
}

async function parsePlayniteDetailFile(file) {
  const html = await file.text();
  const documentNode = new DOMParser().parseFromString(html, "text/html");
  const rows = [...documentNode.querySelectorAll(".detailstable tr")];
  const details = {};

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 2) {
      return;
    }

    const key = normalizeKey(cells[0].textContent || "");
    const value = decodeHtml(cells[1].textContent?.replace(/\s+\n/g, "\n").trim() || "");
    details[key] = value;
  });

  const description = decodeHtml(documentNode.querySelector(".description")?.textContent?.trim() || "");

  return {
    playtimeLabel: details["tempo de jogo"] || "",
    lastActivityRaw: details["ultima atividade"] || details["última atividade"] || "",
    lastActivityLabel: details["ultima atividade"] || details["última atividade"] || "",
    addedRaw: details["adicionado"] || "",
    modifiedRaw: details["modificado"] || "",
    completionStatus: details["status de conclusao"] || details["status de conclusão"] || "",
    source: details["fonte"] || "",
    platform: details["plataforma"] || "",
    releaseDateRaw: details["data de lancamento"] || details["data de lançamento"] || "",
    communityScore: details["pontuacao da comunidade"] || details["pontuação da comunidade"] || "",
    userScore: details["pontuacao do usuario"] || details["pontuação do usuário"] || "",
    genres: splitMultilineValue(details["genero"] || details["gênero"] || ""),
    developers: splitMultilineValue(details["desenvolvedor"] || ""),
    tags: splitMultilineValue(details["tag"] || ""),
    description: description.slice(0, 320)
  };
}

function getUpcomingAvailability(hoursAhead) {
  const now = Date.now();
  const limit = now + hoursAhead * 60 * 60 * 1000;
  const profilesById = mapProfilesById();

  return state.availabilitySlots
    .map((entry) => ({
      ...entry,
      display_name: profilesById.get(entry.user_id)?.display_name || "Jogador"
    }))
    .filter((entry) => {
      const start = new Date(entry.starts_at).getTime();
      const end = entry.ends_at ? new Date(entry.ends_at).getTime() : start + 2 * 60 * 60 * 1000;
      return end >= now - 30 * 60 * 1000 && start <= limit;
    })
    .sort((left, right) => new Date(left.starts_at).getTime() - new Date(right.starts_at).getTime());
}

function getOnlineNowEntries() {
  const now = Date.now();
  const profilesById = mapProfilesById();

  return state.availabilitySlots
    .map((entry) => ({
      ...entry,
      display_name: profilesById.get(entry.user_id)?.display_name || "Jogador"
    }))
    .filter((entry) => {
      const start = new Date(entry.starts_at).getTime();
      const end = entry.ends_at ? new Date(entry.ends_at).getTime() : start + 2 * 60 * 60 * 1000;
      return start <= now && end >= now && ["online_now", "topo_jogar", "marcado"].includes(entry.status);
    })
    .sort((left, right) => new Date(left.starts_at).getTime() - new Date(right.starts_at).getTime());
}

function getRecentGames() {
  return [...state.games]
    .filter((game) => game.last_activity_at)
    .sort((left, right) => new Date(right.last_activity_at).getTime() - new Date(left.last_activity_at).getTime());
}

function buildRanking() {
  const rankingMap = new Map(
    state.profiles.map((profile) => [
      profile.id,
      {
        id: profile.id,
        name: profile.display_name,
        wins: 0,
        losses: 0,
        favoriteGame: profile.favorite_game || ""
      }
    ])
  );

  state.matches.forEach((match) => {
    if (match.winner_user_id) {
      const winner = rankingMap.get(match.winner_user_id);
      if (winner) {
        winner.wins += 1;
      }
    }
    if (match.loser_user_id) {
      const loser = rankingMap.get(match.loser_user_id);
      if (loser) {
        loser.losses += 1;
      }
    }
  });

  return [...rankingMap.values()].sort((left, right) => {
    if (right.wins !== left.wins) {
      return right.wins - left.wins;
    }
    return left.losses - right.losses;
  });
}

function renderAvailabilityItem(entry) {
  return `
    <article class="stack-item">
      <span class="status-pill ${escapeHtmlAttr(entry.status)}">${escapeHtml(statusLabel(entry.status))}</span>
      <strong>${escapeHtml(entry.display_name || "Jogador")}</strong>
      <span>${escapeHtml(entry.game_title || "Sem jogo definido")}</span>
      <small>${escapeHtml(formatSlotRange(entry.starts_at, entry.ends_at))}</small>
      ${entry.note ? `<small>${escapeHtml(entry.note)}</small>` : ""}
    </article>
  `;
}

function renderMatchItem(match) {
  const winner = match.winner_name || mapProfilesById().get(match.winner_user_id)?.display_name || "Jogador";
  const loser = match.loser_name || mapProfilesById().get(match.loser_user_id)?.display_name || "Jogador";

  return `
    <article class="stack-item">
      <strong>${escapeHtml(match.game_title || "Partida")}</strong>
      <span>${escapeHtml(winner)} venceu ${escapeHtml(loser)}</span>
      <small>${escapeHtml(formatDateTime(match.happened_at))}</small>
      ${match.notes ? `<small>${escapeHtml(match.notes)}</small>` : ""}
    </article>
  `;
}

function renderRankingItem(entry, index) {
  const title = index === 0 ? "Rei do sofa" : `Top ${index + 1}`;
  return `
    <article class="stack-item">
      <strong>${index + 1}. ${escapeHtml(entry.name)}</strong>
      <span>${entry.wins} vitorias | ${entry.losses} derrotas</span>
      <small>${escapeHtml(entry.favoriteGame || title)}</small>
    </article>
  `;
}

function renderSyncRunItem(run) {
  const summary = run.summary || {};
  return `
    <article class="stack-item">
      <strong>${escapeHtml(formatDateTime(run.imported_at))}</strong>
      <span>${run.imported_games_count || 0} jogos sincronizados</span>
      <small>Novos: ${summary.added || 0} | Atualizados: ${summary.updated || 0} | Removidos: ${summary.removed || 0}</small>
    </article>
  `;
}

function renderGameHistoryItem(game) {
  return `
    <article class="stack-item">
      <strong>${escapeHtml(game.name)}</strong>
      <span>${escapeHtml(game.platform || "Plataforma nao informada")}</span>
      <small>${escapeHtml(game.last_activity_at ? formatDateTime(game.last_activity_at) : game.last_activity_label || "Sem ultima atividade")}</small>
      <small>${escapeHtml(game.playtime_label || formatDuration(Number(game.playtime_seconds ?? 0)))}</small>
    </article>
  `;
}

function renderLibraryCard(game) {
  const chips = [game.platform, game.source, ...(game.genres || []).slice(0, 2)].filter(Boolean);
  return `
    <article class="library-card">
      <strong>${escapeHtml(game.name)}</strong>
      <span>${escapeHtml(game.description || "Importado do export HTML do Playnite.")}</span>
      <div class="library-meta">
        ${chips.map((chip) => `<span class="pill">${escapeHtml(chip)}</span>`).join("")}
      </div>
      <small>Tempo de jogo: ${escapeHtml(game.playtime_label || formatDuration(Number(game.playtime_seconds ?? 0)))}</small>
      <small>Ultima atividade: ${escapeHtml(game.last_activity_at ? formatDateTime(game.last_activity_at) : game.last_activity_label || "Sem registro")}</small>
    </article>
  `;
}

function matchesLibraryQuery(game) {
  if (!state.libraryQuery) {
    return true;
  }

  const haystack = [
    game.name,
    game.platform,
    game.source,
    ...(game.genres || []),
    ...(game.tags || []),
    ...(game.developers || [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(state.libraryQuery);
}

function mapProfilesById() {
  return new Map(state.profiles.map((profile) => [profile.id, profile]));
}

function setDefaultDateInputs() {
  refs.availabilityStart.value = toDatetimeLocal(new Date());
  refs.availabilityEnd.value = toDatetimeLocal(new Date(Date.now() + 2 * 60 * 60 * 1000));
  refs.matchPlayedAt.value = toDatetimeLocal(new Date());
}

function buildInternalEmail(username) {
  return `${username}@gamehub.local`;
}

function sanitizeUsername(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 24);
}

function sanitizeHousehold(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 18);
}

function sanitizeText(value, maxLength) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function splitMultilineValue(value) {
  return value
    .split(/\n+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeKey(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function toNullableNumber(value) {
  const digits = String(value ?? "").replace(/[^\d.-]/g, "");
  if (!digits) {
    return null;
  }
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDurationToSeconds(label) {
  const text = String(label ?? "").trim().toLowerCase();
  if (!text || text.includes("nao jogado") || text.includes("não jogado")) {
    return 0;
  }

  let total = 0;
  const day = text.match(/(\d+)\s*d/);
  const hour = text.match(/(\d+)\s*h/);
  const minute = text.match(/(\d+)\s*m/);
  const second = text.match(/(\d+)\s*s/);

  if (day) {
    total += Number(day[1]) * 86400;
  }
  if (hour) {
    total += Number(hour[1]) * 3600;
  }
  if (minute) {
    total += Number(minute[1]) * 60;
  }
  if (second) {
    total += Number(second[1]);
  }

  return total;
}

function secondsToHours(seconds) {
  return Number((Number(seconds || 0) / 3600).toFixed(2));
}

function parsePtDateTime(value) {
  const text = String(value ?? "").trim();
  const match = text.match(/(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (!match) {
    return null;
  }

  const [, dd, mm, yyyy, hh = "0", min = "0", ss = "0"] = match;
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min), Number(ss));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parsePtDate(value) {
  const iso = parsePtDateTime(value);
  return iso ? iso.slice(0, 10) : null;
}

function formatShortDateTime(isoString) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(isoString));
}

function formatDateTime(isoString) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(isoString));
}

function formatSlotRange(startsAt, endsAt) {
  const start = new Date(startsAt);
  const base = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(start);

  if (!endsAt) {
    return base;
  }

  const end = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(endsAt));

  return `${base} ate ${end}`;
}

function formatRelative(isoString) {
  const timestamp = new Date(isoString).getTime();
  if (!timestamp) {
    return "agora";
  }

  const deltaMinutes = Math.round((Date.now() - timestamp) / 60000);
  if (deltaMinutes < 1) {
    return "agora";
  }
  if (deltaMinutes < 60) {
    return `${deltaMinutes} min atras`;
  }
  const hours = Math.round(deltaMinutes / 60);
  if (hours < 24) {
    return `${hours} h atras`;
  }
  const days = Math.round(hours / 24);
  return `${days} dia${days === 1 ? "" : "s"} atras`;
}

function formatDuration(totalSeconds) {
  const seconds = Number(totalSeconds || 0);
  if (!seconds) {
    return "0m";
  }

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days) {
    return `${days}d ${hours}h`;
  }
  if (hours) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function statusLabel(status) {
  const labels = {
    topo_jogar: "Topo jogar",
    online_now: "Online agora",
    marcado: "Horario marcado",
    ocupado: "Ocupado"
  };
  return labels[status] || "Indefinido";
}

function toDatetimeLocal(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

function placeholderAvatar(seed = "GH") {
  const safeSeed = encodeURIComponent(String(seed).slice(0, 2).toUpperCase());
  return `https://api.dicebear.com/9.x/initials/svg?seed=${safeSeed}&backgroundColor=6ce0b6,76a8ff,ffd56a`;
}

function downloadJsonFile(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function friendlyError(error) {
  return error?.message || "Algo deu errado. Confira o schema e tente novamente.";
}

function showToast(title, message) {
  const toast = document.createElement("article");
  toast.className = "toast";
  toast.innerHTML = `<strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p>`;
  refs.toastRegion.appendChild(toast);
  window.setTimeout(() => toast.remove(), 4200);
}

function emptyCard(title, body) {
  return `<article class="empty-card"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(body)}</p></article>`;
}

function decodeHtml(value) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = String(value ?? "");
  return textarea.value;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeHtmlAttr(value) {
  return escapeHtml(value);
}
