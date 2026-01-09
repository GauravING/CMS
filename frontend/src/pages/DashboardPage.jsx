import Card from '../components/Card'
import { useAuthStore } from '../store/authStore'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Welcome back, {user?.username}.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <div className="text-xs text-slate-400">Role</div>
          <div className="mt-2 text-xl font-semibold">{user?.role}</div>
        </Card>
        <Card>
          <div className="text-xs text-slate-400">Quick links</div>
          <div className="mt-2 text-sm text-slate-300">Posts • Categories • AI tools</div>
        </Card>
        <Card>
          <div className="text-xs text-slate-400">API docs</div>
          <a className="mt-2 inline-block text-sm text-sky-400 hover:underline" href="/api/docs/">
            /api/docs/
          </a>
        </Card>
      </div>
    </div>
  )
}
