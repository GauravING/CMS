import { useEffect, useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import { createCategory, deleteCategory, listCategories } from '../api/articles'
import { useAuthStore } from '../store/authStore'

export default function CategoriesPage() {
  const role = useAuthStore((s) => s.user?.role)
  const canWrite = role === 'admin' || role === 'editor'

  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await listCategories()
      setItems(data)
    } catch {
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onCreate(e) {
    e.preventDefault()
    if (!name.trim()) return
    await createCategory({ name })
    setName('')
    await load()
  }

  async function onDelete(id) {
    if (!confirm('Delete this category?')) return
    await deleteCategory(id)
    await load()
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <p className="mt-1 text-sm text-slate-400">Used to organize posts.</p>
      </div>

      {canWrite ? (
        <Card>
          <form className="flex flex-col gap-3 md:flex-row md:items-end" onSubmit={onCreate}>
            <div className="flex-1">
              <Input label="New category" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tech" />
            </div>
            <Button type="submit">Create</Button>
          </form>
        </Card>
      ) : (
        <div className="text-sm text-slate-400">Only Admin/Editor can create categories.</div>
      )}

      {error ? <div className="text-sm text-rose-200">{error}</div> : null}
      {loading ? <div className="text-sm text-slate-400">Loading…</div> : null}

      <div className="space-y-2">
        {items.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-xs text-slate-500">{c.slug}</div>
            </div>
            {canWrite ? (
              <Button variant="danger" onClick={() => onDelete(c.id)}>
                Delete
              </Button>
            ) : null}
          </div>
        ))}
        {!loading && items.length === 0 ? <div className="text-sm text-slate-400">No categories yet.</div> : null}
      </div>
    </div>
  )
}
