import { useState } from 'react'

const API_BASE_URL = 'http://localhost:3000'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'volunteer',
  })
  const [status, setStatus] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('')
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus(data.error || 'Erreur')
        return
      }
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('authUser', JSON.stringify(data.user))
      setStatus(`Connecté en tant que ${data.user.email}`)
    } catch (err) {
      console.error(err)
      setStatus('Erreur réseau')
    }
  }

  return (
    <div>
      <h1>Connexion</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button disabled={mode === 'login'} onClick={() => setMode('login')}>
          Connexion
        </button>
        <button disabled={mode === 'register'} onClick={() => setMode('register')} style={{ marginLeft: '0.5rem' }}>
          Inscription
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem', maxWidth: 320 }}>
        {mode === 'register' && (
          <input
            name="name"
            placeholder="Nom"
            value={form.name}
            onChange={handleChange}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
        />
        {mode === 'register' && (
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="volunteer">Volontaire</option>
            <option value="organizer">Organisateur</option>
          </select>
        )}
        <button type="submit">{mode === 'login' ? 'Se connecter' : "S'inscrire"}</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  )
}
