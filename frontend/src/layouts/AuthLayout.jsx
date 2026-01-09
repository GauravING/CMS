import { Link, Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          <div className="hidden md:block">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow">
              <div className="text-sm text-slate-300">AI Powered CMS</div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">Write, edit, publish — with AI assistance.</h1>
              <p className="mt-3 text-slate-300">
                Role-based access for Admin/Editor/Author, a clean content workflow, and AI helpers for drafts, summaries,
                and SEO scoring.
              </p>
              <div className="mt-6 text-sm text-slate-400">
                API docs: <a className="text-sky-400 hover:underline" href="/api/docs/">/api/docs/</a>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full">
              <Outlet />
              <div className="mt-6 text-center text-xs text-slate-500">
                <Link to="/" className="hover:underline">
                  Back to app
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
