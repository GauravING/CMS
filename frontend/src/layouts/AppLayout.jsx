import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import Button from '../components/Button'
import { useAuthStore } from '../store/authStore'

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'block rounded-lg px-3 py-2 text-sm transition',
          isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
        )
      }
    >
      {children}
    </NavLink>
  )
}

export default function AppLayout() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-glow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">AI Powered CMS</div>
              <div className="text-sm font-medium">{user?.username}</div>
              <div className="text-xs text-slate-500">role: {user?.role}</div>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              Logout
            </Button>
          </div>

          <div className="mt-4 space-y-1">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/posts">Posts</NavItem>
            <NavItem to="/categories">Categories</NavItem>
            {user?.role === 'admin' ? <NavItem to="/admin/users">Admin: Users</NavItem> : null}
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/40 p-3 text-xs text-slate-400">
            Tip: Editors/Admins can manage all posts.
          </div>
        </aside>

        <main className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-glow">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
