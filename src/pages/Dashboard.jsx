import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth, XP_TABLE, xpToLevel, xpForNextLevel } from '../hooks/useAuth'
import toast from 'react-hot-toast'

// ─── Avatar Component ──────────────────────────────────────
function Avatar({ profile, size = 40, showOnline = false }) {
  const initials = profile?.nickname?.slice(0, 2).toUpperCase() || '??'
  const color = profile?.color || '#00d4ff'
  const isOnline = ['online','disponivel','jogando'].includes(profile?.status)
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {profile?.avatar_url ? (
        <img src={profile.avatar_url} alt={profile.nickname} style={{
          width: size, height: size, borderRadius: '50%',
          objectFit: 'cover', border: `2px solid ${color}44`
        }} />
      ) : (
        <div style={{
          width: size, height: size, borderRadius: '50%',
          background: `${color}1a`, border: `2px solid ${color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: size * 0.3, color
        }}>{initials}</div>
      )}
      {showOnline && (
        <div style={{
          position: 'absolute', bottom: 1, right: 1,
          width: size * 0.28, height: size * 0.28, borderRadius: '50%',
          background: isOnline ? 'var(--green)' : 'var(--text3)',
          border: '2px solid var(--bg2)',
          boxShadow: isOnline ? '0 0 8px var(--green)' : 'none',
          animation: isOnline ? 'pulse-glow 2s infinite' : 'none'
        }} />
      )}
    </div>
  )
}

// ─── XP Bar ────────────────────────────────────────────────
function XPBar({ profile }) {
  const level = xpToLevel(profile.xp || 0)
  const needed = xpForNextLevel(level)
  const current = (profile.xp || 0) % 300
  const pct = Math.min(100, (current / 300) * 100)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)' }}>
          Nível {level}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text2)' }}>
          {profile.xp || 0} XP
        </span>
      </div>
      <div style={{ height: 3, background: 'var(--border2)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 2,
          background: `linear-gradient(90deg, ${profile.color || 'var(--accent3)'}, var(--accent))`,
          transition: 'width 1s ease'
        }} />
      </div>
    </div>
  )
}

// ─── Status Badge ───────────────────────────────────────────
const STATUS_MAP = {
  online: { label: 'Online', color: 'var(--green)' },
  disponivel: { label: 'Disponível', color: 'var(--accent)' },
  jogando: { label: 'Jogando', color: 'var(--accent2)' },
  offline: { label: 'Offline', color: 'var(--text3)' },
}

// ─── Ranking Panel (Left) ──────────────────────────────────
function RankingPanel({ profiles }) {
  const sorted = [...profiles].sort((a, b) => (b.xp || 0) - (a.xp || 0))
  const medals = ['🥇','🥈','🥉']
  const colors = ['var(--gold)','var(--silver)','var(--bronze)']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      <PanelHeader icon="🏆" title="Ranking da Casa" />

      {/* Top 3 */}
      <div style={{ padding: '12px 14px' }}>
        {sorted.slice(0, 3).map((p, i) => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '11px 12px', borderRadius: 'var(--r)', marginBottom: 8,
            background: 'var(--bg3)', border: `1px solid var(--border)`,
            borderLeft: `3px solid ${colors[i]}`,
            transition: 'all 0.2s', cursor: 'default'
          }}>
            <span style={{ fontSize: 18, minWidth: 24 }}>{medals[i]}</span>
            <Avatar profile={p} size={40} showOnline />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{p.nickname}</span>
                {p.status === 'jogando' && (
                  <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', padding: '1px 6px',
                    background: 'rgba(255,45,120,0.15)', color: 'var(--accent2)',
                    border: '1px solid rgba(255,45,120,0.3)', borderRadius: 3 }}>AO VIVO</span>
                )}
              </div>
              {p.status === 'jogando' && p.status_game && (
                <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--font-mono)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
                  ⚡ {p.status_game}
                </div>
              )}
              <XPBar profile={p} />
            </div>
          </div>
        ))}

        {/* Others */}
        {sorted.slice(3).map((p, i) => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
            borderRadius: 'var(--r)', marginBottom: 6,
            background: 'var(--bg3)', border: '1px solid var(--border)', opacity: 0.7
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)', minWidth: 20 }}>#{i+4}</span>
            <Avatar profile={p} size={30} showOnline />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{p.nickname}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text2)' }}>
                Nível {xpToLevel(p.xp || 0)} · {p.xp || 0} XP
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats grid */}
      <div style={{
        margin: '0 14px', padding: '14px 0',
        borderTop: '1px solid var(--border)', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 10
      }}>
        {[
          { label: 'Rei do Sofá', value: sorted[0]?.wins || 0, icon: '👑', sub: sorted[0]?.nickname || '—' },
          { label: 'Maratonista', value: `${sorted.reduce((s,p) => s + (p.total_hours||0), 0).toFixed(0)}h`, icon: '⏱️', sub: 'total da casa' },
          { label: 'Vitórias', value: profiles.reduce((s,p) => s + (p.wins||0), 0), icon: '⚔️', sub: 'todas juntas' },
          { label: 'Jogadores', value: profiles.length, icon: '👥', sub: 'na casa' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: 'var(--r)', padding: '10px', textAlign: 'center'
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 900, color: 'var(--accent)' }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text2)', textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ fontSize: 10, color: 'var(--text3)' }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Sessions Panel (Center) ───────────────────────────────
function SessionsPanel({ user, profiles }) {
  const [sessions, setSessions] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [games, setGames] = useState([])
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ game_name: '', scheduled_time: '20:00', mode: 'casual', max_players: 4, message: '' })
  const [loading, setLoading] = useState(false)
  const { addXP } = useAuth()

  useEffect(() => {
    loadSessions()
    loadGames()
    // Realtime
    const ch = supabase.channel('sessions').on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, loadSessions)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'session_players' }, loadSessions).subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  async function loadSessions() {
    const { data } = await supabase.from('sessions').select(`*, session_players(player_id)`).eq('status','aberta').order('created_at', { ascending: false })
    setSessions(data || [])
  }

  async function loadGames() {
    const { data } = await supabase.from('games').select('*').order('name')
    setGames(data || [])
  }

  async function createSession() {
    if (!form.game_name) return toast.error('Escolhe um jogo!')
    setLoading(true)
    try {
      const { data: session } = await supabase.from('sessions').insert({
        host_id: user.id, ...form, game_name: form.game_name
      }).select().single()
      await supabase.from('session_players').insert({ session_id: session.id, player_id: user.id })
      // Notifica todos
      const others = profiles.filter(p => p.id !== user.id)
      for (const p of others) {
        await supabase.from('notifications').insert({
          to_player_id: p.id, from_player_id: user.id,
          type: 'session_invite', session_id: session.id,
          message: `${user.nickname} quer jogar ${form.game_name} às ${form.scheduled_time}! Bora?`
        })
      }
      await addXP(XP_TABLE.session_criada, 'Criou sessão')
      toast.success('Sessão criada! Notificações enviadas 🎮')
      setShowCreate(false)
      setForm({ game_name: '', scheduled_time: '20:00', mode: 'casual', max_players: 4, message: '' })
    } catch(e) { toast.error(e.message) }
    setLoading(false)
  }

  async function joinSession(session) {
    const alreadyIn = session.session_players?.some(p => p.player_id === user.id)
    if (alreadyIn) return toast.error('Você já está nessa sessão!')
    const count = session.session_players?.length || 0
    if (count >= session.max_players) return toast.error('Sessão cheia!')
    await supabase.from('session_players').insert({ session_id: session.id, player_id: user.id })
    await addXP(XP_TABLE.session_entrou, 'Entrou na sessão')
    toast.success(`Você entrou na sessão de ${session.game_name}! ⚡`)
  }

  async function closeSession(id) {
    await supabase.from('sessions').update({ status: 'encerrada' }).eq('id', id)
    toast.success('Sessão encerrada')
  }

  const filtered = filter === 'all' ? sessions
    : sessions.filter(s => filter === 'mine' ? s.host_id === user.id : s.mode === filter)

  const profileMap = Object.fromEntries(profiles.map(p => [p.id, p]))

  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PanelHeader icon="🎮" title="Partiu Jogar?" right={
        <button onClick={() => setShowCreate(!showCreate)} style={{
          fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: 1,
          padding: '6px 14px', border: '1px solid var(--accent)', borderRadius: 'var(--r)',
          background: showCreate ? 'var(--accent-dim)' : 'transparent', color: 'var(--accent)',
          transition: 'all 0.15s'
        }}>+ CRIAR</button>
      } />

      {/* Create form */}
      {showCreate && (
        <div style={{
          margin: '0 16px 16px', padding: 18, background: 'var(--bg3)',
          border: '1px solid var(--accent)', borderRadius: 'var(--r-lg)',
          boxShadow: '0 0 20px rgba(0,212,255,0.08)'
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--accent)', letterSpacing: 2, marginBottom: 14 }}>
            // NOVA SESSÃO
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <FieldLabel>Jogo</FieldLabel>
              <select value={form.game_name} onChange={e => setForm({...form, game_name: e.target.value})} style={selectStyle}>
                <option value="">Selecione...</option>
                {games.map(g => <option key={g.id} value={g.name}>{g.cover_emoji} {g.name}</option>)}
                <option value="__custom">Outro jogo...</option>
              </select>
            </div>
            <div>
              <FieldLabel>Horário</FieldLabel>
              <input type="time" value={form.scheduled_time} onChange={e => setForm({...form, scheduled_time: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <FieldLabel>Vagas</FieldLabel>
              <input type="number" min={2} max={10} value={form.max_players} onChange={e => setForm({...form, max_players: parseInt(e.target.value)})} style={inputStyle} />
            </div>
            <div>
              <FieldLabel>Modo</FieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 'var(--r)', overflow: 'hidden', border: '1px solid var(--border2)' }}>
                {['casual','competitivo'].map(m => (
                  <button key={m} onClick={() => setForm({...form, mode: m})} style={{
                    padding: '8px 4px', border: 'none', fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700,
                    background: form.mode === m ? (m === 'casual' ? 'var(--accent-dim)' : 'var(--accent2-dim)') : 'var(--bg3)',
                    color: form.mode === m ? (m === 'casual' ? 'var(--accent)' : 'var(--accent2)') : 'var(--text2)',
                    transition: 'all 0.15s'
                  }}>{m === 'casual' ? '😂 Zoeira' : '🔥 Treino'}</button>
                ))}
              </div>
            </div>
          </div>
          {form.game_name === '__custom' && (
            <div style={{ marginBottom: 10 }}>
              <FieldLabel>Nome do jogo</FieldLabel>
              <input placeholder="Digite o nome..." onChange={e => setForm({...form, game_name: e.target.value === '' ? '__custom' : e.target.value})} style={{...inputStyle, width:'100%'}} />
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <FieldLabel>Mensagem (opcional)</FieldLabel>
            <input value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Ex: só mapa fácil..." style={{...inputStyle, width: '100%'}} />
          </div>
          <button onClick={createSession} disabled={loading || !form.game_name || form.game_name === '__custom'} style={{
            width: '100%', padding: 11, fontFamily: 'var(--font-display)', fontSize: 11,
            fontWeight: 900, letterSpacing: 2, border: 'none', borderRadius: 'var(--r)',
            background: 'linear-gradient(135deg, var(--accent3), var(--accent))', color: '#fff',
            opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s'
          }}>
            {loading ? '⟳ Criando...' : '⚡ PUBLICAR SESSÃO'}
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, padding: '0 16px 14px', flexWrap: 'wrap' }}>
        {[['all','Todas'],['casual','Zoeira'],['competitivo','Treino'],['mine','Minhas']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 10px',
            border: `1px solid ${filter===v ? 'var(--accent)' : 'var(--border2)'}`,
            borderRadius: 4, background: filter===v ? 'var(--accent-dim)' : 'transparent',
            color: filter===v ? 'var(--accent)' : 'var(--text2)', transition: 'all 0.15s'
          }}>{l}</button>
        ))}
      </div>

      {/* Session cards */}
      <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            Nenhuma sessão aberta.<br/>Clica em + CRIAR para chamar a galera! 🎮
          </div>
        )}
        {filtered.map(session => {
          const host = profileMap[session.host_id]
          const players = session.session_players || []
          const filled = players.length
          const isHost = session.host_id === user.id
          const isMember = players.some(p => p.player_id === user.id)
          const isComp = session.mode === 'competitivo'
          return (
            <div key={session.id} style={{
              background: 'var(--bg2)', border: `1px solid ${isComp ? 'rgba(255,45,120,0.25)' : 'var(--border)'}`,
              borderRadius: 'var(--r-lg)', overflow: 'hidden', animation: 'fadeUp 0.3s ease',
              boxShadow: isComp ? '0 0 16px rgba(255,45,120,0.06)' : 'none'
            }}>
              {/* Banner */}
              <div style={{
                height: 56, background: isComp ? 'linear-gradient(135deg,#1f0a1f,#2d1b3d)' : 'linear-gradient(135deg,#0a1520,#0d2035)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, position: 'relative'
              }}>
                🎮
                <div style={{
                  position: 'absolute', top: 8, right: 8, fontSize: 9,
                  fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 3,
                  background: isComp ? 'rgba(255,45,120,0.2)' : 'rgba(0,212,255,0.15)',
                  color: isComp ? 'var(--accent2)' : 'var(--accent)',
                  border: `1px solid ${isComp ? 'rgba(255,45,120,0.4)' : 'rgba(0,212,255,0.3)'}`
                }}>{isComp ? '🔥 TREINO' : '😂 ZOEIRA'}</div>
              </div>
              <div style={{ padding: 12 }}>
                {/* Host */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Avatar profile={host} size={26} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{host?.nickname}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                  {session.game_name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', marginBottom: 6 }}>
                  ◷ {session.scheduled_time}
                </div>
                {session.message && (
                  <div style={{ fontSize: 11, color: 'var(--text2)', fontStyle: 'italic', marginBottom: 8, padding: '6px 8px', background: 'var(--bg3)', borderRadius: 4 }}>
                    "{session.message}"
                  </div>
                )}
                {/* Slots */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                  {Array.from({length: session.max_players}).map((_,i) => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 2,
                      background: i < filled ? (isComp ? 'var(--accent2)' : 'var(--accent)') : 'var(--border2)'
                    }} />
                  ))}
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text2)', marginLeft: 4 }}>
                    {filled}/{session.max_players}
                  </span>
                </div>
                {/* Actions */}
                {isHost ? (
                  <button onClick={() => closeSession(session.id)} style={{
                    width: '100%', padding: '8px', fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700,
                    letterSpacing: 1, border: '1px solid var(--border2)', borderRadius: 'var(--r)',
                    background: 'transparent', color: 'var(--text3)', transition: 'all 0.15s'
                  }}>✕ Encerrar</button>
                ) : isMember ? (
                  <div style={{ textAlign: 'center', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--green)', padding: '8px' }}>
                    ✓ Você está dentro!
                  </div>
                ) : (
                  <button onClick={() => joinSession(session)} style={{
                    width: '100%', padding: '8px', fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700,
                    letterSpacing: 1, border: `1px solid ${isComp ? 'rgba(255,45,120,0.5)' : 'rgba(0,212,255,0.5)'}`,
                    borderRadius: 'var(--r)', background: isComp ? 'var(--accent2-dim)' : 'var(--accent-dim)',
                    color: isComp ? 'var(--accent2)' : 'var(--accent)', transition: 'all 0.15s'
                  }}>{isComp ? '🔥 Tô Dentro!' : '⚡ Tô Dentro!'}</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Right Panel: Profile + Matches + Notifications ────────
function RightPanel({ user, profiles }) {
  const [tab, setTab] = useState('profile') // profile | match | notif
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const { updateProfile, uploadAvatar, addXP, logout } = useAuth()
  const fileRef = useRef()

  useEffect(() => {
    loadNotifs()
    const ch = supabase.channel('notifs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `to_player_id=eq.${user.id}` }, (payload) => {
        setNotifications(prev => [payload.new, ...prev])
        setUnread(u => u + 1)
        toast(`🔔 ${payload.new.message}`, { icon: '🎮', duration: 5000 })
      }).subscribe()
    return () => supabase.removeChannel(ch)
  }, [user.id])

  async function loadNotifs() {
    const { data } = await supabase.from('notifications').select('*, from_player:profiles!notifications_from_player_id_fkey(nickname,color)').eq('to_player_id', user.id).order('created_at', { ascending: false }).limit(20)
    setNotifications(data || [])
    setUnread((data || []).filter(n => !n.read).length)
  }

  async function markAllRead() {
    await supabase.from('notifications').update({ read: true }).eq('to_player_id', user.id).eq('read', false)
    setNotifications(prev => prev.map(n => ({...n, read: true})))
    setUnread(0)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'profile', icon: '👤', label: 'Perfil' },
          { id: 'match', icon: '⚔️', label: 'Partida' },
          { id: 'notif', icon: unread > 0 ? `🔔 ${unread}` : '🔔', label: 'Avisos' },
        ].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); if(t.id==='notif') markAllRead() }} style={{
            padding: '12px 4px', border: 'none', fontFamily: 'var(--font-mono)', fontSize: 10,
            textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
            background: tab===t.id ? 'rgba(0,212,255,0.06)' : 'transparent',
            color: tab===t.id ? 'var(--accent)' : 'var(--text2)',
            borderBottom: tab===t.id ? '2px solid var(--accent)' : '2px solid transparent',
            transition: 'all 0.2s', position: 'relative'
          }}>
            {t.icon}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div style={{ padding: 16 }}>
            {/* Avatar + Status */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
                <Avatar profile={user} size={72} />
                <button onClick={() => fileRef.current.click()} style={{
                  position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--accent3)', border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer'
                }}>✎</button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                  if(!e.target.files[0]) return
                  try { await uploadAvatar(e.target.files[0]); toast.success('Foto atualizada!') }
                  catch(err) { toast.error(err.message) }
                }} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900 }}>{user.nickname}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', marginBottom: 10 }}>
                Nível {xpToLevel(user.xp||0)} · {user.xp||0} XP
              </div>
              <XPBar profile={user} />
            </div>

            {/* Status selector */}
            <div style={{ marginBottom: 14 }}>
              <FieldLabel>Meu Status</FieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {Object.entries(STATUS_MAP).map(([key, { label, color }]) => (
                  <button key={key} onClick={async () => {
                    await updateProfile({ status: key, last_seen: new Date().toISOString() })
                    toast.success(`Status: ${label}`)
                  }} style={{
                    padding: '8px', border: `1px solid ${user.status===key ? color : 'var(--border2)'}`,
                    borderRadius: 'var(--r)', background: user.status===key ? `${color}18` : 'var(--bg3)',
                    color: user.status===key ? color : 'var(--text2)', fontSize: 12, fontFamily: 'var(--font-mono)',
                    transition: 'all 0.15s', cursor: 'pointer'
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', marginRight: 6 }} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status game */}
            {user.status === 'jogando' && (
              <div style={{ marginBottom: 14 }}>
                <FieldLabel>Jogando o quê?</FieldLabel>
                <input defaultValue={user.status_game||''} onBlur={async e => {
                  await updateProfile({ status_game: e.target.value })
                  toast.success('Atualizado!')
                }} placeholder="Nome do jogo..." style={{...inputStyle, width:'100%'}} />
              </div>
            )}

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
              {[
                { label: 'Vitórias', value: user.wins || 0, color: 'var(--green)' },
                { label: 'Derrotas', value: user.losses || 0, color: 'var(--accent2)' },
                { label: 'Horas', value: `${(user.total_hours||0).toFixed(0)}h`, color: 'var(--accent)' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r)',
                  padding: '10px 6px', textAlign: 'center'
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text2)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <button onClick={logout} style={{
              width: '100%', padding: '10px', fontFamily: 'var(--font-mono)', fontSize: 11,
              border: '1px solid var(--border2)', borderRadius: 'var(--r)',
              background: 'transparent', color: 'var(--text3)', transition: 'all 0.15s'
            }}>Sair da conta</button>
          </div>
        )}

        {/* MATCH TAB */}
        {tab === 'match' && <MatchTab user={user} profiles={profiles} addXP={addXP} />}

        {/* NOTIF TAB */}
        {tab === 'notif' && (
          <div style={{ padding: 12 }}>
            <PanelHeader icon="🔔" title={`Notificações ${unread > 0 ? `(${unread})` : ''}`} />
            {notifications.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px 10px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text3)' }}>
                Nenhuma notificação ainda
              </div>
            )}
            {notifications.map(n => (
              <div key={n.id} style={{
                padding: '10px 12px', borderRadius: 'var(--r)', marginBottom: 6,
                background: n.read ? 'var(--bg3)' : 'rgba(0,212,255,0.06)',
                border: `1px solid ${n.read ? 'var(--border)' : 'rgba(0,212,255,0.2)'}`,
              }}>
                <div style={{ fontSize: 13, marginBottom: 2 }}>{n.message}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)' }}>
                  {new Date(n.created_at).toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Match Recording Tab ────────────────────────────────────
function MatchTab({ user, profiles, addXP }) {
  const [games, setGames] = useState([])
  const [form, setForm] = useState({
    game_name: '', mode: 'casual', duration_minutes: 60, notes: '',
    players: {} // { id: 'vitoria' | 'derrota' | 'empate' | 'nao_competitivo' }
  })
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    supabase.from('games').select('*').order('name').then(({data}) => setGames(data||[]))
    loadHistory()
  }, [])

  async function loadHistory() {
    const { data } = await supabase.from('match_players').select('*, match:matches(*)')
      .eq('player_id', user.id).order('joined_at', { ascending: false }).limit(10)
    setHistory(data || [])
  }

  async function saveMatch() {
    if (!form.game_name) return toast.error('Escolhe um jogo!')
    const playersWithResult = Object.entries(form.players).filter(([,r]) => r)
    if (playersWithResult.length === 0) return toast.error('Adicione pelo menos um resultado!')
    setLoading(true)
    try {
      // Cria partida
      const { data: match } = await supabase.from('matches').insert({
        game_name: form.game_name, mode: form.mode,
        duration_minutes: form.duration_minutes, notes: form.notes, created_by: user.id
      }).select().single()

      // Adiciona jogadores + XP
      for (const [pid, result] of playersWithResult) {
        const isComp = form.mode === 'competitivo'
        const key = `${result}_${isComp ? 'competitivo' : 'casual'}`
        const xp = XP_TABLE[key] || 5
        const hoursXP = Math.floor((form.duration_minutes / 60) * XP_TABLE.hora_jogada)
        const totalXP = xp + hoursXP

        await supabase.from('match_players').insert({ match_id: match.id, player_id: pid, result, xp_earned: totalXP })

        // Atualiza stats do jogador
        const p = profiles.find(x => x.id === pid)
        if (p) {
          const wins = result === 'vitoria' ? (p.wins||0) + 1 : (p.wins||0)
          const losses = result === 'derrota' ? (p.losses||0) + 1 : (p.losses||0)
          const hours = (p.total_hours||0) + (form.duration_minutes / 60)
          const newXP = (p.xp||0) + totalXP
          await supabase.from('profiles').update({
            wins, losses, total_hours: hours, xp: newXP, level: xpToLevel(newXP)
          }).eq('id', pid)
        }
      }

      toast.success(`Partida registrada! XP distribuído 🏆`)
      setForm({ game_name: '', mode: 'casual', duration_minutes: 60, notes: '', players: {} })
      loadHistory()
    } catch(e) { toast.error(e.message) }
    setLoading(false)
  }

  const resultOptions = form.mode === 'casual'
    ? ['vitoria','derrota','empate','nao_competitivo']
    : ['vitoria','derrota','empate']

  const resultLabels = { vitoria:'✅ Vitória', derrota:'❌ Derrota', empate:'🤝 Empate', nao_competitivo:'🎮 Casual' }
  const resultColors = { vitoria:'var(--green)', derrota:'var(--accent2)', empate:'var(--accent)', nao_competitivo:'var(--text2)' }

  return (
    <div style={{ padding: 14 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--accent)', letterSpacing: 2, marginBottom: 14 }}>
        // REGISTRAR PARTIDA
      </div>

      <div style={{ marginBottom: 10 }}>
        <FieldLabel>Jogo</FieldLabel>
        <select value={form.game_name} onChange={e => setForm({...form, game_name: e.target.value})} style={{...selectStyle, width:'100%'}}>
          <option value="">Selecione...</option>
          {games.map(g => <option key={g.id} value={g.name}>{g.cover_emoji} {g.name}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div>
          <FieldLabel>Modo</FieldLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 'var(--r)', overflow:'hidden', border: '1px solid var(--border2)' }}>
            {['casual','competitivo'].map(m => (
              <button key={m} onClick={() => setForm({...form, mode:m, players:{}})} style={{
                padding:'7px 2px', border:'none', fontSize:10, fontFamily:'var(--font-mono)',
                background: form.mode===m ? (m==='casual'?'var(--accent-dim)':'var(--accent2-dim)') : 'var(--bg3)',
                color: form.mode===m ? (m==='casual'?'var(--accent)':'var(--accent2)') : 'var(--text2)',
                transition:'all 0.15s', cursor:'pointer'
              }}>{m==='casual'?'😂 Zoeira':'🔥 Treino'}</button>
            ))}
          </div>
        </div>
        <div>
          <FieldLabel>Duração (min)</FieldLabel>
          <input type="number" min={5} max={600} value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: parseInt(e.target.value)||0})} style={inputStyle} />
        </div>
      </div>

      {/* Players results */}
      <FieldLabel>Resultados</FieldLabel>
      <div style={{ marginBottom: 12 }}>
        {profiles.map(p => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '8px 10px',
            background: 'var(--bg3)', borderRadius: 'var(--r)', border: '1px solid var(--border)'
          }}>
            <Avatar profile={p} size={28} />
            <span style={{ fontSize: 13, fontWeight: 600, minWidth: 60 }}>{p.nickname}</span>
            <div style={{ display: 'flex', gap: 4, flex: 1, flexWrap: 'wrap' }}>
              {resultOptions.map(r => (
                <button key={r} onClick={() => setForm(f => ({
                  ...f, players: {...f.players, [p.id]: f.players[p.id]===r ? undefined : r}
                }))} style={{
                  fontSize: 9, padding: '3px 8px', border: `1px solid ${form.players[p.id]===r ? resultColors[r] : 'var(--border2)'}`,
                  borderRadius: 4, background: form.players[p.id]===r ? `${resultColors[r]}20` : 'transparent',
                  color: form.players[p.id]===r ? resultColors[r] : 'var(--text3)', cursor:'pointer', transition:'all 0.1s',
                  fontFamily: 'var(--font-mono)'
                }}>{resultLabels[r]}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 10 }}>
        <FieldLabel>Notas (opcional)</FieldLabel>
        <input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Ex: final emocionante..." style={{...inputStyle, width:'100%'}} />
      </div>

      <button onClick={saveMatch} disabled={loading} style={{
        width:'100%', padding:11, fontFamily:'var(--font-display)', fontSize:11,
        fontWeight:900, letterSpacing:2, border:'none', borderRadius:'var(--r)',
        background:'linear-gradient(135deg, var(--accent3), var(--accent))', color:'#fff', opacity: loading?0.6:1
      }}>
        {loading ? '⟳ Salvando...' : '⚔️ REGISTRAR PARTIDA'}
      </button>

      {/* History */}
      {history.length > 0 && (
        <>
          <div style={{ fontFamily:'var(--font-display)', fontSize:10, color:'var(--text2)', letterSpacing:2, margin:'16px 0 8px', textTransform:'uppercase' }}>
            Histórico recente
          </div>
          {history.map(h => (
            <div key={h.id} style={{
              display:'flex', alignItems:'center', gap:8, padding:'8px 10px',
              background:'var(--bg3)', borderRadius:'var(--r)', marginBottom:6,
              border: '1px solid var(--border)'
            }}>
              <div style={{
                width:28, height:28, borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center',
                background: h.result==='vitoria' ? 'rgba(16,185,129,0.15)' : h.result==='derrota' ? 'rgba(255,45,120,0.15)' : 'var(--bg4)',
                fontSize:14
              }}>
                {h.result==='vitoria'?'✅':h.result==='derrota'?'❌':h.result==='empate'?'🤝':'🎮'}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{h.match?.game_name}</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text2)' }}>
                  +{h.xp_earned} XP · {h.match?.duration_minutes}min
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ─── Topbar ─────────────────────────────────────────────────
function Topbar({ user, profiles }) {
  const onlineCount = profiles.filter(p => ['online','disponivel','jogando'].includes(p.status)).length
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 20px', height:52, background:'var(--bg2)', borderBottom:'1px solid var(--border)',
      position:'sticky', top:0, zIndex:100
    }}>
      <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:900, letterSpacing:4,
        color:'var(--accent)', textShadow:'0 0 20px rgba(0,212,255,0.35)' }}>
        PLAY<span style={{color:'var(--accent2)'}}>HUB</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text3)', letterSpacing:2, marginLeft:10 }}>// FAMÍLIA</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {profiles.filter(p => ['online','disponivel','jogando'].includes(p.status)).map(p => (
            <Avatar key={p.id} profile={p} size={28} showOnline />
          ))}
          <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--green)', marginLeft:4 }}>
            {onlineCount} online
          </span>
        </div>
        <Avatar profile={user} size={34} showOnline />
      </div>
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────────
function PanelHeader({ icon, title, right }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 16px 12px', borderBottom:'1px solid var(--border)', justifyContent:'space-between' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:14 }}>{icon}</span>
        <span style={{ fontFamily:'var(--font-display)', fontSize:10, fontWeight:700, letterSpacing:2, color:'var(--text2)', textTransform:'uppercase' }}>{title}</span>
      </div>
      {right}
    </div>
  )
}

function FieldLabel({ children }) {
  return <label style={{ display:'block', fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text2)', marginBottom:5, letterSpacing:1.5, textTransform:'uppercase' }}>{children}</label>
}

const inputStyle = {
  background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'var(--r)',
  padding:'8px 10px', color:'var(--text)', fontSize:13, outline:'none', transition:'border-color 0.15s',
  fontFamily:'var(--font-body)'
}

const selectStyle = {
  ...inputStyle,
  appearance:'none', backgroundImage:'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%234a5568\'/%3E%3C/svg%3E")',
  backgroundRepeat:'no-repeat', backgroundPosition:'calc(100% - 10px) center', paddingRight:30
}

// ─── Main Dashboard ─────────────────────────────────────────
export default function Dashboard({ user }) {
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    loadProfiles()
    const ch = supabase.channel('profiles-watch')
      .on('postgres_changes', { event: '*', schema:'public', table:'profiles' }, loadProfiles)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  async function loadProfiles() {
    const { data } = await supabase.from('profiles').select('id,nickname,avatar_url,color,xp,level,wins,losses,total_hours,status,status_game,last_seen').order('xp', { ascending: false })
    setProfiles(data || [])
  }

  // Merge local user data
  const currentProfile = profiles.find(p => p.id === user.id) || user

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <Topbar user={currentProfile} profiles={profiles} />
      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr 290px', flex:1, overflow:'hidden' }}>
        <div style={{ background:'var(--bg2)', borderRight:'1px solid var(--border)', overflow:'hidden' }}>
          <RankingPanel profiles={profiles} />
        </div>
        <div style={{ background:'var(--bg)', overflow:'hidden' }}>
          <SessionsPanel user={user} profiles={profiles} />
        </div>
        <div style={{ background:'var(--bg2)', borderLeft:'1px solid var(--border)', overflow:'hidden' }}>
          <RightPanel user={currentProfile} profiles={profiles} />
        </div>
      </div>
    </div>
  )
}
