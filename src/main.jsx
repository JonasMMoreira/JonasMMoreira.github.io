import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './hooks/useAuth'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import './index.css'

function App() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ fontFamily:'var(--font-display)', fontSize:13, color:'var(--accent)', letterSpacing:4 }}>CARREGANDO...</div>
    </div>
  )
  return user ? <Dashboard user={user} /> : <AuthPage />
}

function Root() {
  return (
    <AuthProvider>
      <App />
      <Toaster position="top-right" toastOptions={{
        style: { background:'#0d1018', color:'#dde4f0', border:'1px solid #242840', fontFamily:'Rajdhani,sans-serif', fontSize:'14px' },
        success: { iconTheme: { primary:'#10b981', secondary:'#fff' } },
        error: { iconTheme: { primary:'#ff2d78', secondary:'#fff' } },
      }} />
    </AuthProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
