import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const config = window.APP_CONFIG ?? {};
const configReady =
  typeof config.supabaseUrl === "string" &&
  config.supabaseUrl.startsWith("https://") &&
  !config.supabaseUrl.includes("YOUR-PROJECT") &&
  typeof config.supabaseAnonKey === "string" &&
  !config.supabaseAnonKey.includes("YOUR-ANON-KEY");

const supabase = configReady
  ? createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      }
    })
  : null;

const XP_RULES = {
  win: 120,
  loss: 45,
  casualPerHour: 8
};

const state = {
  session: null,
  profile: null,
  householdProfiles: [],
  matches: [],
  games: [],
  availability: [],
  notifications: [],
  refreshTimer: null
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
  goTabButtons: [...document.querySelectorAll("[data-go-tab]")],
  loginForm: document.querySelector("#login-form"),
  registerForm: document.querySelector("#register-form"),
  tabs: [...document.querySelectorAll(".tab")],
  panels: [...document.querySelectorAll(".tab-panel")],
  statKing: document.querySelector("#stat-king"),
  statKingMeta: document.querySelector("#stat-king-meta"),
  statMarathon: document.querySelector("#stat-marathon"),
  statMarathonMeta: document.querySelector("#stat-marathon-meta"),
  statXp: document.querySelector("#stat-xp"),
  statXpMeta: document.querySelector("#stat-xp-meta"),
  statOnline: document.querySelector("#stat-online"),
  statOnlineMeta: document.querySelector("#stat-online-meta"),
  statCompetitiveGames: document.querySelector("#stat-competitive-games"),
  statCompetitiveGamesMeta: document.querySelector("#stat-competitive-games-meta"),
  statHouseHours: document.querySelector("#stat-house-hours"),
  statHouseHoursMeta: document.querySelector("#stat-house-hours-meta"),
  leaderboard: document.querySelector("#leaderboard"),
  libraryPreview: document.querySelector("#library-preview"),
  housePulse: document.querySelector("#house-pulse"),
  achievementList: document.querySelector("#achievement-list"),
  lineupList: document.querySelector("#lineup-list"),
  notificationsFeed: document.querySelector("#notifications-feed"),
  arenaGames: document.querySelector("#arena-games"),
  matchForm: document.querySelector("#match-form"),
  matchGame: document.querySelector("#match-game"),
  matchHistory: document.querySelector("#match-history"),
  availabilityForm: document.querySelector("#availability-form"),
  availabilityList: document.querySelector("#availability-list"),
  heroAvailability: document.querySelector("#hero-availability"),
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
  playniteForm: document.querySelector("#playnite-form"),
  playniteFile: document.querySelector("#playnite-file"),
  downloadSampleButton: document.querySelector("#download-sample-button"),
  exportBackupButton: document.querySelector("#export-backup-button"),
  toastRegion: document.querySelector("#toast-region")
};

init();

async function init() {
  bindEvents();

  if (!configReady) {
    refs.configBanner.classList.remove("hidden");
    refs.appShell.classList.remove("hidden");
    setTab("setup");
    showToast("Configuracao pendente", "Preencha o config.js para ligar o Supabase.");
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
  refs.tabs.forEach((tab) => {
    tab.addEventListener("click", () => setTab(tab.dataset.tab));
  });
  refs.goTabButtons.forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.goTab));
  });

  refs.loginForm.addEventListener("submit", onLogin);
  refs.registerForm.addEventListener("submit", onRegister);
  refs.logoutButton.addEventListener("click", onLogout);
  refs.matchForm.addEventListener("submit", onMatchSubmit);
  refs.availabilityForm.addEventListener("submit", onAvailabilitySubmit);
  refs.profileForm.addEventListener("submit", onProfileSubmit);
  refs.avatarInput.addEventListener("change", onAvatarSelected);
  refs.playniteForm.addEventListener("submit", onPlayniteImport);
  refs.downloadSampleButton.addEventListener("click", onDownloadSample);
  refs.exportBackupButton.addEventListener("click", onExportBackup);
}

async function handleSessionChanged(session) {
  const loggedIn = Boolean(session?.user);

  refs.authPanel.classList.toggle("hidden", loggedIn);
  refs.appShell.classList.toggle("hidden", !loggedIn);
  refs.logoutButton.classList.toggle("hidden", !loggedIn);
  refs.authChip.classList.toggle("hidden", !loggedIn);

  if (!loggedIn) {
    if (state.refreshTimer) {
      window.clearInterval(state.refreshTimer);
      state.refreshTimer = null;
    }
    state.profile = null;
    state.householdProfiles = [];
    state.matches = [];
    state.games = [];
    state.availability = [];
    state.notifications = [];
    renderAll();
    return;
  }

  setTab("dashboard");
  await ensureProfileRow();
  await loadAppData();
  startPolling();
}

function startPolling() {
  if (state.refreshTimer) {
    window.clearInterval(state.refreshTimer);
  }

  state.refreshTimer = window.setInterval(async () => {
    if (!state.session?.user) {
      return;
    }
    await loadAppData({ silent: true });
  }, 45000);
}

function setTab(tabName) {
  refs.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === tabName));
  refs.panels.forEach((panel) => panel.classList.toggle("active", panel.id === `${tabName}-tab`));
}

async function onLogin(event) {
  event.preventDefault();
  if (!supabase) {
    showToast("Sem configuracao", "Preencha o config.js antes de tentar entrar.");
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
    showToast("Bem-vindo de volta", `Sessao iniciada para ${username}.`);
  } catch (error) {
    showToast("Falha ao entrar", friendlyError(error));
  }
}

async function onRegister(event) {
  event.preventDefault();
  if (!supabase) {
    showToast("Sem configuracao", "Preencha o config.js antes de criar conta.");
    return;
  }

  const formData = new FormData(event.currentTarget);
  const username = sanitizeUsername(formData.get("username"));
  const displayName = sanitizeText(formData.get("displayName"), 40);
  const householdCode = sanitizeHousehold(formData.get("householdCode"));
  const password = String(formData.get("password") ?? "");

  if (!username || !displayName || !householdCode) {
    showToast("Dados incompletos", "Preencha usuario, nome exibido e codigo da casa.");
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
      showToast(
        "Conta criada",
        "A conta foi criada, mas o projeto ainda exige confirmacao de email. Desative isso no Supabase Auth."
      );
    } else {
      showToast("Conta criada", `${displayName} entrou na sala da casa ${householdCode}.`);
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

  showToast("Sessao encerrada", "Ate a proxima rodada.");
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

  const userId = state.session.user.id;
  const { data: myProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError) {
    showToast("Falha ao carregar perfil", friendlyError(profileError));
    return;
  }

  state.profile = myProfile;

  const householdCode = myProfile.household_code;

  const [profilesResult, matchesResult, gamesResult, availabilityResult, notificationsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("household_code", householdCode).order("display_name"),
    supabase.from("matches").select("*").eq("household_code", householdCode).order("happened_at", { ascending: false }),
    supabase.from("playnite_games").select("*").eq("household_code", householdCode).order("playtime_hours", { ascending: false }),
    supabase.from("availability_status").select("*").eq("household_code", householdCode).order("updated_at", { ascending: false }),
    supabase.from("household_notifications").select("*").eq("household_code", householdCode).order("created_at", { ascending: false }).limit(8)
  ]);

  if (profilesResult.error || matchesResult.error || gamesResult.error || availabilityResult.error || notificationsResult.error) {
    showToast("Falha ao carregar dados", "Confira as tabelas e policies do Supabase.");
    return;
  }

  state.householdProfiles = profilesResult.data ?? [];
  state.matches = matchesResult.data ?? [];
  state.games = gamesResult.data ?? [];
  state.availability = availabilityResult.data ?? [];
  state.notifications = notificationsResult.data ?? [];

  renderAll();

  if (!options.silent) {
    showToast("Painel atualizado", "Dados sincronizados com o Supabase.");
  }
}

function renderAll() {
  renderAuthChip();
  renderSummary();
  renderLeaderboard();
  renderLibrary();
  renderHousePulse();
  renderAchievements();
  renderLineup();
  renderNotifications();
  renderArena();
  renderMatches();
  renderAvailability();
  renderProfile();
}

function renderAuthChip() {
  if (!state.profile) {
    refs.authChipName.textContent = "Jogador";
    refs.authChipHouse.textContent = "Casa";
    refs.authChipAvatar.src = placeholderAvatar();
    return;
  }

  refs.authChipName.textContent = state.profile.display_name;
  refs.authChipHouse.textContent = `Casa ${state.profile.household_code}`;
  refs.authChipAvatar.src = state.profile.avatar_url || placeholderAvatar(state.profile.display_name);
}

function renderSummary() {
  const ranking = buildRanking();
  const king = ranking[0];
  const marathon = [...ranking].sort((left, right) => right.hours - left.hours)[0];
  const myStats = ranking.find((entry) => entry.id === state.profile?.id);
  const onlineEntries = state.availability.filter((entry) =>
    ["online", "topo_jogar"].includes(entry.status)
  );
  const competitiveGames = getCompetitiveGames();
  const totalHours = state.games.reduce((sum, game) => sum + Number(game.playtime_hours ?? 0), 0);

  refs.statKing.textContent = king ? king.name : "Sem dados";
  refs.statKingMeta.textContent = king ? `${king.wins} vitorias na Arena` : "Registre partidas para iniciar o ranking.";
  refs.statMarathon.textContent = marathon ? marathon.name : "Sem dados";
  refs.statMarathonMeta.textContent = marathon ? `${formatHours(marathon.hours)} acumuladas` : "Importe a biblioteca do Playnite.";
  refs.statXp.textContent = `${Math.round(myStats?.xp ?? 0)} XP`;
  refs.statXpMeta.textContent = myStats
    ? `${myStats.wins} vitorias e ${formatHours(myStats.hours)} na biblioteca`
    : "Vitorias rendem mais, maratonas completam a barra.";
  refs.statOnline.textContent = `${onlineEntries.length} pessoa${onlineEntries.length === 1 ? "" : "s"}`;
  refs.statOnlineMeta.textContent = onlineEntries.length
    ? `Ultima atualizacao da casa: ${formatRelative(onlineEntries[0].updated_at)}`
    : "Atualize o seu status para chamar a galera.";
  refs.statCompetitiveGames.textContent = `${competitiveGames.length} jogo${competitiveGames.length === 1 ? "" : "s"}`;
  refs.statCompetitiveGamesMeta.textContent = competitiveGames.length
    ? `${competitiveGames[0].name} lidera a Arena mais recente`
    : "Arena abastecida pela importacao do Playnite.";
  refs.statHouseHours.textContent = formatHours(totalHours);
  refs.statHouseHoursMeta.textContent = totalHours
    ? `${state.games.length} jogos sincronizados pela casa`
    : "A maratona coletiva aparece aqui.";
}

function renderLeaderboard() {
  const ranking = buildRanking();
  refs.leaderboard.innerHTML = ranking.length
    ? ranking
        .map(
          (entry, index) => `
            <article class="leaderboard-entry">
              <div class="entry-main">
                <strong>${index + 1}. ${escapeHtml(entry.name)}</strong>
                <span>${entry.wins} vitorias | ${formatHours(entry.hours)} | ${Math.round(entry.xp)} XP</span>
              </div>
              <div class="entry-meta">
                <span class="score-badge">${entry.statusLabel}</span>
              </div>
            </article>
          `
        )
        .join("")
    : emptyState("Sem ranking ainda", "A casa precisa de partidas e biblioteca para gerar o placar.");
}

function renderLibrary() {
  const preview = state.games.slice(0, 6);
  refs.libraryPreview.innerHTML = preview.length
    ? preview
        .map(
          (game) => `
            <article class="library-item">
              <div class="library-copy">
                <strong>${escapeHtml(game.name)}</strong>
                <span>${(game.tags ?? []).join(", ") || "Sem tags"}</span>
              </div>
              <div class="entry-meta">
                <strong>${formatHours(Number(game.playtime_hours ?? 0))}</strong>
                <span>${game.is_competitive ? "Arena" : "Casual"}</span>
              </div>
            </article>
          `
        )
        .join("")
    : emptyState("Biblioteca vazia", "Importe um JSON do Playnite no Setup para preencher esta area.");
}

function renderHousePulse() {
  const totalHours = state.games.reduce((sum, game) => sum + Number(game.playtime_hours ?? 0), 0);
  const competitiveCount = state.games.filter((game) => game.is_competitive).length;
  const casualCount = Math.max(state.games.length - competitiveCount, 0);
  const onlineCount = state.availability.filter((entry) => ["online", "topo_jogar"].includes(entry.status)).length;

  const cards = [
    {
      label: "Cadencia competitiva",
      value: `${state.matches.length} partidas`,
      meta: state.matches.length ? "Historico total registrado na Arena." : "Quando sairem as primeiras partidas, o ritmo aparece aqui."
    },
    {
      label: "Biblioteca casual",
      value: `${casualCount} jogos`,
      meta: casualCount ? "Jogos focados em XP por tempo de sofa." : "Importe mais jogos casuais pelo Playnite."
    },
    {
      label: "Horas da casa",
      value: formatHours(totalHours),
      meta: totalHours ? "Soma das maratonas de toda a casa." : "Sem horas importadas ainda."
    },
    {
      label: "Prontos para jogar",
      value: `${onlineCount} agora`,
      meta: onlineCount ? "A fila da noite ja esta aquecendo." : "Ainda falta alguem gritar partiu."
    }
  ];

  refs.housePulse.innerHTML = cards
    .map(
      (card) => `
        <article class="pulse-card">
          <p>${escapeHtml(card.label)}</p>
          <strong>${escapeHtml(card.value)}</strong>
          <span>${escapeHtml(card.meta)}</span>
        </article>
      `
    )
    .join("");
}

function renderAchievements() {
  const ranking = buildRanking();
  const mostOnline = [...state.availability]
    .sort((left, right) => new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime())[0];
  const profileMap = mapProfilesById();
  const recentPlayer = mostOnline ? profileMap.get(mostOnline.user_id)?.display_name || "Jogador" : "Ninguem ainda";
  const bestCasualGame = [...state.games]
    .filter((game) => !game.is_competitive)
    .sort((left, right) => Number(right.playtime_hours ?? 0) - Number(left.playtime_hours ?? 0))[0];
  const topWinner = ranking[0];
  const topGrinder = [...ranking].sort((left, right) => right.hours - left.hours)[0];

  const items = [
    {
      title: "Coroa do sofa",
      body: topWinner ? `${topWinner.name} lidera com ${topWinner.wins} vitorias.` : "A primeira coroa sai quando a Arena comecar."
    },
    {
      title: "Motor da maratona",
      body: topGrinder ? `${topGrinder.name} soma ${formatHours(topGrinder.hours)} no backlog.` : "Importe a biblioteca para revelar o maratonista."
    },
    {
      title: "Chamou a party",
      body: mostOnline ? `${recentPlayer} foi o ultimo a movimentar a casa.` : "Nenhum status publicado ainda."
    },
    {
      title: "Zen casual",
      body: bestCasualGame ? `${bestCasualGame.name} domina o modo relax com ${formatHours(bestCasualGame.playtime_hours)}.` : "Nenhum jogo casual liderando ainda."
    }
  ];

  refs.achievementList.innerHTML = items
    .map(
      (item) => `
        <article class="achievement-item">
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.body)}</span>
        </article>
      `
    )
    .join("");
}

function renderLineup() {
  const profileMap = mapProfilesById();
  const lineup = [...state.availability]
    .filter((entry) => ["online", "topo_jogar"].includes(entry.status))
    .sort((left, right) => {
      const leftTime = left.available_at ? new Date(left.available_at).getTime() : 0;
      const rightTime = right.available_at ? new Date(right.available_at).getTime() : 0;
      return leftTime - rightTime;
    })
    .slice(0, 4);

  refs.lineupList.innerHTML = lineup.length
    ? lineup
        .map((entry) => {
          const profile = profileMap.get(entry.user_id);
          const name = profile?.display_name || "Jogador";
          return `
            <article class="lineup-item">
              <strong>${escapeHtml(name)}</strong>
              <span>${escapeHtml(entry.game_title || "Sem jogo definido")}</span>
              <small>${entry.available_at ? formatDateTime(entry.available_at) : "Disponivel agora"}</small>
            </article>
          `;
        })
        .join("")
    : emptyState("Fila vazia", "Quando alguem marcar online ou topo jogar, a noite comeca aqui.");
}

function renderNotifications() {
  refs.notificationsFeed.innerHTML = state.notifications.length
    ? state.notifications
        .map(
          (entry) => `
            <article class="notification-item">
              <div class="notification-copy">
                <strong>${escapeHtml(entry.title)}</strong>
                <span>${escapeHtml(entry.message || "Sem mensagem")}</span>
              </div>
              <div class="entry-meta">
                <strong>${escapeHtml(entry.game_title || "-")}</strong>
                <span>${formatRelative(entry.created_at)}</span>
              </div>
            </article>
          `
        )
        .join("")
    : emptyState("Sem alertas ainda", "Marque a opcao de avisar a casa quando atualizar seu status.");
}

function renderArena() {
  const competitiveGames = getCompetitiveGames();

  refs.matchGame.innerHTML = competitiveGames.length
    ? competitiveGames.map((game) => `<option value="${escapeHtmlAttr(game.name)}">${escapeHtml(game.name)}</option>`).join("")
    : '<option value="Arena Manual">Arena Manual</option>';

  refs.arenaGames.innerHTML = competitiveGames.length
    ? competitiveGames
        .map((game) => `<span class="pill">${escapeHtml(game.name)} | ${formatHours(Number(game.playtime_hours ?? 0))}</span>`)
        .join("")
    : '<span class="pill">Importe jogos com tags Campeonato ou Competitivo</span>';

  const defaultDate = new Date();
  refs.matchForm.querySelector("#match-date").value ||= toDatetimeLocal(defaultDate);
}

function renderMatches() {
  const profileMap = mapProfilesById();

  refs.matchHistory.innerHTML = state.matches.length
    ? state.matches
        .slice(0, 8)
        .map((match) => {
          const profile = profileMap.get(match.user_id);
          const displayName = profile?.display_name || "Jogador";
          const resultLabel = match.result === "vitoria" ? "Vitoria" : "Derrota";
          const badgeClass = match.result === "vitoria" ? "score-badge" : "score-badge";
          return `
            <article class="match-item">
              <div class="entry-main">
                <strong>${escapeHtml(match.game_title)}</strong>
                <span>${escapeHtml(displayName)} | ${resultLabel} | ${formatRelative(match.happened_at)}</span>
              </div>
              <div class="entry-meta">
                <strong class="${badgeClass}">${Number(match.xp_awarded ?? 0)} XP</strong>
              </div>
            </article>
          `;
        })
        .join("")
    : emptyState("Nenhuma partida registrada", "A primeira vitoria da casa comeca aqui.");
}

function renderAvailability() {
  const profileMap = mapProfilesById();
  const entries = state.availability;

  const html = entries.length
    ? entries
        .map((entry) => {
          const profile = profileMap.get(entry.user_id);
          const name = profile?.display_name || "Jogador";
          const avatar = profile?.avatar_url || placeholderAvatar(name);
          return `
            <article class="availability-item">
              <div class="entry-main">
                <div class="availability-copy">
                  <strong>${escapeHtml(name)}</strong>
                  <span>${statusLabel(entry.status)} | ${escapeHtml(entry.game_title || "Sem jogo definido")}</span>
                  <span>${escapeHtml(entry.note || "Sem recado")} </span>
                </div>
              </div>
              <div class="entry-meta">
                <img class="avatar medium" src="${avatar}" alt="${escapeHtmlAttr(name)}">
                <span>${entry.available_at ? formatDateTime(entry.available_at) : "Horario livre"}</span>
              </div>
            </article>
          `;
        })
        .join("")
    : emptyState("Radar vazio", "Atualize o status para mostrar quem esta online.");

  refs.availabilityList.innerHTML = html;
  refs.heroAvailability.innerHTML = entries.length
    ? entries
        .slice(0, 3)
        .map((entry) => {
          const profile = profileMap.get(entry.user_id);
          const name = profile?.display_name || "Jogador";
          return `
            <article class="hero-status-card">
              <div class="entry-main">
                <strong>${escapeHtml(name)}</strong>
                <span>${statusLabel(entry.status)} | ${escapeHtml(entry.game_title || "Indefinido")}</span>
              </div>
              <span class="score-badge">${entry.available_at ? formatTime(entry.available_at) : "Agora"}</span>
            </article>
          `;
        })
        .join("")
    : `
        <article class="signal-empty">
          <strong>Ninguem conectado ainda</strong>
          <p>Quando a galera atualizar o status, o radar da casa aparece aqui.</p>
        </article>
      `;
}

function renderProfile() {
  if (!state.profile) {
    refs.profileAvatar.src = placeholderAvatar();
    return;
  }

  refs.profileAvatar.src = state.profile.avatar_url || placeholderAvatar(state.profile.display_name);
  refs.profileTitle.textContent = state.profile.display_name;
  refs.profileSubtitle.textContent = `Usuario @${state.profile.username} na casa ${state.profile.household_code}`;
  refs.profileUsername.value = state.profile.username;
  refs.profileDisplayName.value = state.profile.display_name || "";
  refs.profileHousehold.value = state.profile.household_code || "";
  refs.profileFavoriteGame.value = state.profile.favorite_game || "";
  refs.profileBio.value = state.profile.bio || "";
}

async function onMatchSubmit(event) {
  event.preventDefault();
  if (!state.profile) {
    return;
  }

  const formData = new FormData(event.currentTarget);
  const result = String(formData.get("result") ?? "vitoria");
  const happenedAt = String(formData.get("happenedAt") ?? "") || new Date().toISOString();
  const gameTitle = sanitizeText(formData.get("game"), 80) || "Arena Manual";

  const payload = {
    user_id: state.profile.id,
    household_code: state.profile.household_code,
    game_title: gameTitle,
    result,
    match_mode: "competitivo",
    xp_awarded: result === "vitoria" ? XP_RULES.win : XP_RULES.loss,
    happened_at: new Date(happenedAt).toISOString()
  };

  const { error } = await supabase.from("matches").insert(payload);
  if (error) {
    showToast("Falha ao registrar partida", friendlyError(error));
    return;
  }

  showToast("Partida registrada", `${gameTitle} entrou no historico da Arena.`);
  await loadAppData({ silent: true });
}

async function onAvailabilitySubmit(event) {
  event.preventDefault();
  if (!state.profile) {
    return;
  }

  const formData = new FormData(event.currentTarget);
  const payload = {
    user_id: state.profile.id,
    household_code: state.profile.household_code,
    status: String(formData.get("status") ?? "online"),
    game_title: sanitizeText(formData.get("gameTitle"), 80),
    available_at: formData.get("availableAt") ? new Date(String(formData.get("availableAt"))).toISOString() : null,
    note: sanitizeText(formData.get("note"), 140),
    notify_house: formData.get("notifyHouse") === "on",
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from("availability_status").upsert(payload, { onConflict: "user_id" });
  if (error) {
    showToast("Falha ao atualizar status", friendlyError(error));
    return;
  }

  if (payload.notify_house) {
    const notification = {
      household_code: state.profile.household_code,
      author_id: state.profile.id,
      title: `${state.profile.display_name} quer jogar`,
      message: payload.note || `${state.profile.display_name} esta ${statusLabel(payload.status).toLowerCase()}.`,
      game_title: payload.game_title || null
    };
    await supabase.from("household_notifications").insert(notification);
  }

  showToast("Status atualizado", "A disponibilidade foi sincronizada com a casa.");
  await loadAppData({ silent: true });
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
    favorite_game: sanitizeText(formData.get("favoriteGame"), 80),
    bio: sanitizeText(formData.get("bio"), 180),
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

  const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true
  });

  if (uploadError) {
    showToast("Falha no upload", friendlyError(uploadError));
    return;
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: data.publicUrl })
    .eq("id", state.profile.id);

  if (updateError) {
    showToast("Falha ao salvar foto", friendlyError(updateError));
    return;
  }

  showToast("Avatar atualizado", "A nova foto ja esta valendo.");
  event.target.value = "";
  await loadAppData({ silent: true });
}

async function onPlayniteImport(event) {
  event.preventDefault();
  if (!state.profile) {
    showToast("Entre primeiro", "A importacao exige uma conta autenticada.");
    return;
  }

  const file = refs.playniteFile.files?.[0];
  if (!file) {
    showToast("Arquivo faltando", "Selecione um JSON exportado do Playnite.");
    return;
  }

  try {
    const text = await file.text();
    const raw = JSON.parse(text);
    const games = normalizePlaynitePayload(raw, state.profile);

    if (!games.length) {
      showToast("Importacao vazia", "Nao encontrei jogos validos nesse JSON.");
      return;
    }

    const deleteResult = await supabase.from("playnite_games").delete().eq("user_id", state.profile.id);
    if (deleteResult.error) {
      throw deleteResult.error;
    }

    const insertResult = await supabase.from("playnite_games").insert(games);
    if (insertResult.error) {
      throw insertResult.error;
    }

    showToast("Biblioteca importada", `${games.length} jogos sincronizados do Playnite.`);
    refs.playniteForm.reset();
    await loadAppData({ silent: true });
  } catch (error) {
    showToast("Falha na importacao", friendlyError(error));
  }
}

function onDownloadSample() {
  const sample = {
    games: [
      {
        name: "Street Fighter 6",
        tags: ["Competitivo", "Luta"],
        platform: "PC",
        playtimeHours: 48.5,
        playCount: 37
      },
      {
        name: "Overcooked 2",
        tags: ["Casual", "Co-op"],
        platform: "PC",
        playtimeHours: 19.25,
        playCount: 14
      },
      {
        name: "EA Sports FC 25",
        tags: ["Campeonato", "Esporte"],
        platform: "Xbox",
        playtimeHours: 61.8,
        playCount: 52
      }
    ]
  };

  downloadJsonFile("playnite-sample.json", sample);
  showToast("Exemplo pronto", "Baixei um JSON-base para voce testar a importacao.");
}

function onExportBackup() {
  if (!state.profile) {
    showToast("Entre primeiro", "O backup exporta os dados da casa autenticada.");
    return;
  }

  const backup = {
    exported_at: new Date().toISOString(),
    household_code: state.profile.household_code,
    profiles: state.householdProfiles,
    matches: state.matches,
    playnite_games: state.games,
    availability_status: state.availability,
    household_notifications: state.notifications
  };

  downloadJsonFile(`gamehub-backup-${state.profile.household_code}.json`, backup);
  showToast("Backup exportado", "O snapshot da casa foi baixado em JSON.");
}

function normalizePlaynitePayload(payload, profile) {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.games)
      ? payload.games
      : Array.isArray(payload?.items)
        ? payload.items
        : [];

  return list
    .map((item) => normalizeGame(item, profile))
    .filter(Boolean);
}

function normalizeGame(item, profile) {
  const name = sanitizeText(item?.name ?? item?.Name ?? item?.gameName ?? item?.title, 120);
  if (!name) {
    return null;
  }

  const tags = normalizeTags(item?.tags ?? item?.Tags ?? item?.genres ?? item?.Genres);
  const playtimeHours = inferPlaytimeHours(item);
  const playCount = Number(item?.playCount ?? item?.PlayCount ?? item?.sessionCount ?? 0) || 0;
  const platform = sanitizeText(item?.platform ?? item?.Platform ?? item?.source ?? item?.Source, 40);
  const isCompetitive = tags.some((tag) => ["campeonato", "competitivo"].includes(tag.toLowerCase()));

  return {
    user_id: profile.id,
    household_code: profile.household_code,
    name,
    platform,
    tags,
    playtime_hours: playtimeHours,
    play_count: playCount,
    source: "playnite_json",
    is_competitive: isCompetitive
  };
}

function inferPlaytimeHours(item) {
  const explicitHours = Number(item?.playtimeHours ?? item?.PlaytimeHours ?? item?.hoursPlayed);
  if (Number.isFinite(explicitHours) && explicitHours >= 0) {
    return Number(explicitHours.toFixed(2));
  }

  const minutes = Number(item?.playtimeMinutes ?? item?.PlaytimeMinutes);
  if (Number.isFinite(minutes) && minutes >= 0) {
    return Number((minutes / 60).toFixed(2));
  }

  const seconds = Number(item?.playtimeSeconds ?? item?.PlaytimeSeconds ?? item?.timePlayed);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Number((seconds / 3600).toFixed(2));
  }

  const generic = Number(item?.playtime ?? item?.Playtime ?? 0);
  if (!Number.isFinite(generic) || generic < 0) {
    return 0;
  }

  if (generic > 20000) {
    return Number((generic / 3600).toFixed(2));
  }

  if (generic > 400) {
    return Number((generic / 60).toFixed(2));
  }

  return Number(generic.toFixed(2));
}

function normalizeTags(value) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => sanitizeText(entry?.name ?? entry, 40))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => sanitizeText(entry, 40))
      .filter(Boolean);
  }

  return [];
}

function buildRanking() {
  const profileMap = mapProfilesById();
  const seed = state.householdProfiles.map((profile) => ({
    id: profile.id,
    name: profile.display_name,
    wins: 0,
    hours: 0,
    xp: 0,
    statusLabel: profile.favorite_game || "Jogador da casa"
  }));

  const table = new Map(seed.map((entry) => [entry.id, entry]));

  state.matches.forEach((match) => {
    const entry = table.get(match.user_id) ?? createRankingEntry(profileMap.get(match.user_id));
    entry.wins += match.result === "vitoria" ? 1 : 0;
    entry.xp += Number(match.xp_awarded ?? 0);
    table.set(match.user_id, entry);
  });

  state.games.forEach((game) => {
    const entry = table.get(game.user_id) ?? createRankingEntry(profileMap.get(game.user_id));
    entry.hours += Number(game.playtime_hours ?? 0);
    entry.xp += Number(game.playtime_hours ?? 0) * XP_RULES.casualPerHour;
    table.set(game.user_id, entry);
  });

  return [...table.values()].sort((left, right) => {
    if (right.wins !== left.wins) {
      return right.wins - left.wins;
    }
    if (right.xp !== left.xp) {
      return right.xp - left.xp;
    }
    return right.hours - left.hours;
  });
}

function createRankingEntry(profile) {
  return {
    id: profile?.id || crypto.randomUUID(),
    name: profile?.display_name || "Jogador",
    wins: 0,
    hours: 0,
    xp: 0,
    statusLabel: profile?.favorite_game || "Jogador da casa"
  };
}

function getCompetitiveGames() {
  return state.games.filter((game) => game.is_competitive);
}

function mapProfilesById() {
  return new Map(state.householdProfiles.map((profile) => [profile.id, profile]));
}

function buildInternalEmail(username) {
  return `${username}@sofa.local`;
}

function sanitizeUsername(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 24);
}

function sanitizeHousehold(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 18);
}

function sanitizeText(value, maxLength) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function friendlyError(error) {
  return error?.message || "Algo saiu do script. Confira a configuracao e tente novamente.";
}

function showToast(title, message) {
  const toast = document.createElement("article");
  toast.className = "toast";
  toast.innerHTML = `<strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p>`;
  refs.toastRegion.appendChild(toast);
  window.setTimeout(() => toast.remove(), 4200);
}

function emptyState(title, body) {
  return `<article class="empty-state"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(body)}</p></article>`;
}

function formatHours(value) {
  return `${Number(value || 0).toFixed(1)} h`;
}

function formatRelative(isoString) {
  if (!isoString) {
    return "agora";
  }

  const delta = Date.now() - new Date(isoString).getTime();
  const minutes = Math.round(delta / 60000);
  if (minutes < 1) {
    return "agora";
  }
  if (minutes < 60) {
    return `${minutes} min atras`;
  }
  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours} h atras`;
  }
  const days = Math.round(hours / 24);
  return `${days} dia${days === 1 ? "" : "s"} atras`;
}

function formatDateTime(isoString) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(isoString));
}

function formatTime(isoString) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(isoString));
}

function statusLabel(value) {
  const labels = {
    online: "Online",
    topo_jogar: "Topo jogar",
    ocupado: "Ocupado",
    ausente: "Ausente"
  };
  return labels[value] || "Indefinido";
}

function placeholderAvatar(seed = "GS") {
  const safeSeed = encodeURIComponent(seed.slice(0, 2).toUpperCase() || "GS");
  return `https://api.dicebear.com/9.x/initials/svg?seed=${safeSeed}&backgroundColor=ff7a18,37d6c3,f4c542`;
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

function toDatetimeLocal(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
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
