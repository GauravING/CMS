import { create } from 'zustand'
import { login as apiLogin, me as apiMe, register as apiRegister } from '../api/auth'

const LS_ACCESS = 'cms_access'
const LS_REFRESH = 'cms_refresh'

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isHydrating: false,

  setTokens: ({ access, refresh }) => {
    localStorage.setItem(LS_ACCESS, access)
    localStorage.setItem(LS_REFRESH, refresh)
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem(LS_ACCESS)
    localStorage.removeItem(LS_REFRESH)
    set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false })
  },

  hydrate: async () => {
    const access = localStorage.getItem(LS_ACCESS)
    const refresh = localStorage.getItem(LS_REFRESH)
    if (!access || !refresh) return

    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true, isHydrating: true })

    try {
      const user = await apiMe()
      set({ user, isHydrating: false })
    } catch {
      get().logout()
      set({ isHydrating: false })
    }
  },

  register: async (payload) => {
    await apiRegister(payload)
  },

  login: async (payload) => {
    const tokens = await apiLogin(payload)
    get().setTokens(tokens)
    const user = await apiMe()
    set({ user })
  }
}))
