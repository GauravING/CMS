import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import { useAuthStore } from '../store/authStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await register({ username, email, password })
      navigate('/login')
    } catch (err) {
      const msg =
        err?.response?.data?.email?.[0] ||
        err?.response?.data?.password?.[0] ||
        err?.response?.data?.detail ||
        'Registration failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Create account</h2>
      <p className="mt-1 text-sm text-slate-400">New accounts start as Author (admins can promote users later).</p>

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="yourname" />
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="At least 8 characters."
        />

        <div className="rounded-lg border border-white/10 bg-slate-950/40 p-3 text-xs text-slate-400">
          Role: <span className="text-slate-200">author</span>
        </div>

        {error ? <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </Button>

        <div className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-400 hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </Card>
  )
}
