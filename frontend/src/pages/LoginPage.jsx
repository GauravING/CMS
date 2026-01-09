import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const payload = identifier.includes('@')
        ? { email: identifier, password }
        : { username: identifier, password }
      await login(payload)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Sign in</h2>
      <p className="mt-1 text-sm text-slate-400">Use username or email + password.</p>

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <Input
          label="Username or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="admin / admin@example.com"
          autoComplete="username"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        {error ? <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>

        <div className="text-center text-sm text-slate-400">
          No account?{' '}
          <Link to="/register" className="text-sky-400 hover:underline">
            Create one
          </Link>
        </div>
      </form>
    </Card>
  )
}
