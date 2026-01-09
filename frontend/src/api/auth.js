import { api } from './client'

export async function register(payload) {
  const { data } = await api.post('/api/users/register/', payload)
  return data
}

export async function login(payload) {
  const { data } = await api.post('/api/users/token/', payload)
  return data
}

export async function me() {
  const { data } = await api.get('/api/users/me/')
  return data
}

export async function listUsers() {
  const { data } = await api.get('/api/users/admin/users/')
  return data
}

export async function setUserRole(userId, role) {
  const { data } = await api.patch(`/api/users/admin/users/${userId}/role/`, { role })
  return data
}
