'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/adminApi'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      router.push('/admin/dashboard')
    } catch {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0E0C0C',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif', padding: 16,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: '#CC1F1F', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Panel de Gestión</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#FAF7F2', letterSpacing: 2 }}>Dolche&apos;B</div>
          <div style={{ fontSize: 13, color: '#8A7878', marginTop: 6 }}>Ingresá con tu cuenta de administrador</div>
        </div>

        {/* Card */}
        <div style={{ background: '#1A1515', borderRadius: 16, padding: 32, border: '1px solid #2A2020' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#C8BFBF', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="tu_usuario"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 8,
                  background: '#0E0C0C', border: '1px solid #2A2020',
                  color: '#FAF7F2', fontSize: 15, outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#C8BFBF', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 8,
                  background: '#0E0C0C', border: '1px solid #2A2020',
                  color: '#FAF7F2', fontSize: 15, outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <div style={{ background: '#3A1010', border: '1px solid #CC1F1F', borderRadius: 8, padding: '10px 14px', color: '#FF7070', fontSize: 13, marginBottom: 20 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: 8,
                background: loading ? '#8A2020' : '#CC1F1F',
                color: '#fff', fontSize: 15, fontWeight: 700,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: 0.5, transition: 'background 0.15s',
              }}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, color: '#8A7878', fontSize: 12 }}>
          Desarrollado por Franco Mora
        </div>
      </div>
    </div>
  )
}
