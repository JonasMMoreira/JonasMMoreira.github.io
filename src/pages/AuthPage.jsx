import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const COLORS = [
  '#00d4ff','#ff2d78','#7c3aed','#f59e0b','#10b981',
  '#f97316','#ec4899','#14b8a6','#8b5cf6','#ef4444'
]

export default function AuthPage() {
  const [mode, setMode] = useState('login') // login | register
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(nickname.trim(), password)
        toast.success('Bem-vindo de volta! 🎮')
      } else {
        if (password !== confirm) throw new Error('Senhas não coincidem')
        if (password.length < 4) throw new Error('Senha muito curta (mín. 4 chars)')
        await register(nickname.trim(), password, color)
        toast.success('Conta criada! Seja bem-vindo ao PlayHub! 🚀')
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const initials = nickname ? nickname.slice(0, 2).toUpperCase() : '?'

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
      backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 70%)',
      padding: '20px'
    }}>
      {/* Grid pattern */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '60px 60px', opacity: 0.3
      }} />

      <div style={{ width: '100%', maxWidth: 420, animation: 'fadeUp 0.5s ease', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900,
            letterSpacing: 4, color: 'var(--accent)',
            textShadow: '0 0 30px rgba(0,212,255,0.4), 0 0 60px rgba(0,212,255,0.15)'
          }}>
            PLAY<span style={{ color: 'var(--accent2)' }}>HUB</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', letterSpacing: 3, marginTop: 6 }}>
            // HUB DA FAMÍLIA
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border2)',
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,255,0.05)'
        }}>
          {/* Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)' }}>
            {['login','register'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: '14px', border: 'none', fontFamily: 'var(--font-display)',
                fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
                background: mode === m ? 'rgba(0,212,255,0.08)' : 'transparent',
                color: mode === m ? 'var(--accent)' : 'var(--text2)',
                borderBottom: mode === m ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}>
                {m === 'login' ? 'Entrar' : 'Cadastrar'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '28px 24px' }}>
            {/* Avatar preview (register) */}
            {mode === 'register' && (
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', margin: '0 auto 12px',
                  background: `${color}22`, border: `2px solid ${color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color,
                  boxShadow: `0 0 20px ${color}40`
                }}>
                  {initials}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {COLORS.map(c => (
                    <div key={c} onClick={() => setColor(c)} style={{
                      width: 24, height: 24, borderRadius: '50%', background: c, cursor: 'pointer',
                      border: color === c ? `2px solid white` : '2px solid transparent',
                      transform: color === c ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 0.15s', boxShadow: color === c ? `0 0 10px ${c}` : 'none'
                    }} />
                  ))}
                </div>
              </div>
            )}

            <Field label="NICKNAME" value={nickname} onChange={setNickname} placeholder="ex: Jonas" />
            <Field label="SENHA" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
            {mode === 'register' && (
              <Field label="CONFIRMAR SENHA" value={confirm} onChange={setConfirm} type="password" placeholder="••••••••" />
            )}

            <button type="submit" disabled={loading || !nickname || !password} style={{
              width: '100%', padding: '13px', marginTop: 8,
              fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 900,
              letterSpacing: 2, textTransform: 'uppercase', border: 'none',
              borderRadius: 'var(--r)',
              background: loading ? 'var(--border2)' : 'linear-gradient(135deg, var(--accent3), var(--accent))',
              color: '#fff', transition: 'all 0.2s',
              opacity: (!nickname || !password) ? 0.5 : 1,
              boxShadow: loading ? 'none' : '0 4px 20px rgba(0,212,255,0.2)'
            }}>
              {loading ? '⟳ Carregando...' : mode === 'login' ? '⚡ Entrar' : '🚀 Criar Conta'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' }}>
          Sistema local — sem email necessário
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'var(--text2)', marginBottom: 6, letterSpacing: 1.5, textTransform: 'uppercase'
      }}>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required
        style={{
          width: '100%', background: 'var(--bg3)', border: '1px solid var(--border2)',
          borderRadius: 'var(--r)', padding: '10px 14px', color: 'var(--text)',
          fontSize: 15, outline: 'none', transition: 'border-color 0.2s'
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border2)'}
      />
    </div>
  )
}
