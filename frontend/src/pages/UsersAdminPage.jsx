import { useEffect, useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import { listUsers, setUserRole } from '../api/auth'

export default function UsersAdminPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await listUsers()
      setUsers(data)
    } catch {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function changeRole(userId, role) {
    await setUserRole(userId, role)
    await load()
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
        <p className="mt-1 text-sm text-slate-400">Admins can promote/demote users.</p>
      </div>

      {error ? <div className="text-sm text-rose-200">{error}</div> : null}

      <Card>
        {loading ? <div className="text-sm text-slate-400">Loading…</div> : null}
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <div>
                <div className="text-sm font-medium">{u.username}</div>
                <div className="text-xs text-slate-500">{u.email} • role: {u.role}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => changeRole(u.id, 'author')}>Author</Button>
                <Button variant="ghost" onClick={() => changeRole(u.id, 'editor')}>Editor</Button>
                <Button variant="ghost" onClick={() => changeRole(u.id, 'admin')}>Admin</Button>
              </div>
            </div>
          ))}
          {!loading && users.length === 0 ? <div className="text-sm text-slate-400">No users.</div> : null}
        </div>
      </Card>
    </div>
  )
}
