import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import { createPost, deletePost, listPosts } from '../api/articles'

export default function PostsPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await listPosts(search ? { search } : {})
      setItems(data)
    } catch (e) {
      setError('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!search) return items
    const q = search.toLowerCase()
    return items.filter((p) => (p.title || '').toLowerCase().includes(q) || (p.slug || '').toLowerCase().includes(q))
  }, [items, search])

  async function onCreate() {
    const created = await createPost({ title: 'New draft', content: '', status: 'draft' })
    navigate(`/posts/${created.id}`)
  }

  async function onDelete(id) {
    if (!confirm('Delete this post?')) return
    await deletePost(id)
    await load()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
          <p className="mt-1 text-sm text-slate-400">Create and manage your content.</p>
        </div>
        <Button onClick={onCreate}>New post</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[360px_1fr]">
        <Card>
          <Input label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." />
          <Button className="mt-3 w-full" variant="ghost" onClick={load} disabled={loading}>
            Refresh
          </Button>
          {error ? <div className="mt-3 text-sm text-rose-200">{error}</div> : null}
        </Card>

        <div className="space-y-3">
          {loading ? <div className="text-sm text-slate-400">Loading…</div> : null}
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <div className="text-sm font-medium">{p.title}</div>
                <div className="text-xs text-slate-500">{p.status} • {p.slug}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => navigate(`/posts/${p.id}`)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => onDelete(p.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 ? <div className="text-sm text-slate-400">No posts yet.</div> : null}
        </div>
      </div>
    </div>
  )
}
