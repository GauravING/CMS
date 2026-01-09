import { api } from './client'

export async function listCategories() {
  const { data } = await api.get('/api/articles/categories/')
  return data
}

export async function createCategory(payload) {
  const { data } = await api.post('/api/articles/categories/', payload)
  return data
}

export async function deleteCategory(id) {
  await api.delete(`/api/articles/categories/${id}/`)
}

export async function listPosts(params = {}) {
  const { data } = await api.get('/api/articles/posts/', { params })
  return data
}

export async function getPost(id) {
  const { data } = await api.get(`/api/articles/posts/${id}/`)
  return data
}

export async function createPost(payload) {
  const { data } = await api.post('/api/articles/posts/', payload)
  return data
}

export async function updatePost(id, payload) {
  const { data } = await api.patch(`/api/articles/posts/${id}/`, payload)
  return data
}

export async function deletePost(id) {
  await api.delete(`/api/articles/posts/${id}/`)
}
