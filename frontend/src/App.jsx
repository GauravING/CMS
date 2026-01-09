import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import PostsPage from './pages/PostsPage.jsx'
import PostEditorPage from './pages/PostEditorPage.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'
import UsersAdminPage from './pages/UsersAdminPage.jsx'
import { useAuthStore } from './store/authStore.js'

function Protected({ children }) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthed) return <Navigate to="/login" replace />
  return children
}

function AdminOnly({ children }) {
  const role = useAuthStore((s) => s.user?.role)
  if (role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate)

  // Restore tokens + fetch /me once at startup
  React.useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:id" element={<PostEditorPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route
          path="/admin/users"
          element={
            <AdminOnly>
              <UsersAdminPage />
            </AdminOnly>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
