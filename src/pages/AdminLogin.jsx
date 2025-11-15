import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, isAuthed } from '../lib/cms'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(username.trim(), password)
      setError('')
      navigate('/dashboard')
    } catch (err) {
      setError(err?.message || 'Login failed')
    }
  }

  useEffect(() => {
    if (isAuthed()) {
      navigate('/dashboard', { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/60 p-8 shadow-lux">
        <h1 className="display text-3xl mb-6">Admin Access</h1>
        <form onSubmit={onSubmit} className="grid gap-4">
          <input
            type="text"
            placeholder="Username"
            className="bg-black/40 border border-white/10 rounded-lg px-4 py-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-black/40 border border-white/10 rounded-lg px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button className="rounded-full bg-[var(--lux-accent)] text-black px-6 py-3 w-full">Login</button>
        </form>
        <p className="text-xs text-neutral-400 mt-4">Secure admin login with JWT.
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
