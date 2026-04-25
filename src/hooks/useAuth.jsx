import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// XP por resultado
export const XP_TABLE = {
  vitoria_competitivo: 50,
  empate_competitivo: 20,
  derrota_competitivo: 10,
  vitoria_casual: 20,
  derrota_casual: 10,
  empate_casual: 15,
  hora_jogada: 15, // por hora
  session_criada: 10,
  session_entrou: 5,
}

export function xpToLevel(xp) {
  return Math.floor(xp / 300) + 1
}

export function xpForNextLevel(level) {
  return level * 300
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('playhub_user')
    if (stored) {
      const u = JSON.parse(stored)
      // Atualiza dados do perfil ao abrir
      supabase.from('profiles').select('*').eq('id', u.id).single()
        .then(({ data }) => {
          if (data) {
            setUser(data)
            localStorage.setItem('playhub_user', JSON.stringify(data))
          }
        })
      setUser(u)
    }
    setLoading(false)
  }, [])

  async function login(nickname, password) {
    const bcrypt = await import('bcryptjs')
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('nickname', nickname)
      .single()

    if (error || !data) throw new Error('Usuário não encontrado')
    const ok = await bcrypt.compare(password, data.password_hash)
    if (!ok) throw new Error('Senha incorreta')

    // Atualiza status para online
    await supabase.from('profiles').update({ status: 'online', last_seen: new Date().toISOString() }).eq('id', data.id)
    const updated = { ...data, status: 'online' }
    setUser(updated)
    localStorage.setItem('playhub_user', JSON.stringify(updated))
    return updated
  }

  async function register(nickname, password, color) {
    const bcrypt = await import('bcryptjs')
    const hash = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from('profiles')
      .insert({ nickname, password_hash: hash, color: color || '#00e5ff', status: 'online' })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') throw new Error('Nickname já em uso!')
      throw new Error(error.message)
    }
    setUser(data)
    localStorage.setItem('playhub_user', JSON.stringify(data))
    return data
  }

  async function logout() {
    if (user) {
      await supabase.from('profiles').update({ status: 'offline', last_seen: new Date().toISOString() }).eq('id', user.id)
    }
    setUser(null)
    localStorage.removeItem('playhub_user')
  }

  async function updateProfile(updates) {
    const { data, error } = await supabase
      .from('profiles').update(updates).eq('id', user.id).select().single()
    if (error) throw error
    setUser(data)
    localStorage.setItem('playhub_user', JSON.stringify(data))
    return data
  }

  async function uploadAvatar(file) {
    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (upErr) throw upErr
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    await updateProfile({ avatar_url: publicUrl + '?t=' + Date.now() })
    return publicUrl
  }

  async function addXP(amount, reason) {
    if (!user) return
    const newXP = (user.xp || 0) + amount
    const newLevel = xpToLevel(newXP)
    await updateProfile({ xp: newXP, level: newLevel })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, uploadAvatar, addXP }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
