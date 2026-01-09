import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const apiBase = import.meta.env.VITE_API_BASE || ''

export const api = axios.create({
  baseURL: apiBase,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const access = useAuthStore.getState().accessToken
  if (access) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

let refreshingPromise = null

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const status = error?.response?.status

    if (status !== 401 || original?._retry) {
      throw error
    }

    const { refreshToken, setTokens, logout } = useAuthStore.getState()
    if (!refreshToken) {
      logout()
      throw error
    }

    original._retry = true

    try {
      if (!refreshingPromise) {
        refreshingPromise = api
          .post('/api/users/token/refresh/', { refresh: refreshToken })
          .then((r) => r.data)
          .finally(() => {
            refreshingPromise = null
          })
      }

      const data = await refreshingPromise
      setTokens({ access: data.access, refresh: refreshToken })
      original.headers.Authorization = `Bearer ${data.access}`
      return api(original)
    } catch (e) {
      logout()
      throw e
    }
  }
)
