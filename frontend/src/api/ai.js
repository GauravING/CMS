import { api } from './client'

export async function generateDraft(payload) {
  const { data } = await api.post('/api/ai/generate/', payload)
  return data
}

export async function improveContent(payload) {
  const { data } = await api.post('/api/ai/improve/', payload)
  return data
}

export async function summarizeContent(payload) {
  const { data } = await api.post('/api/ai/summarize/', payload)
  return data
}

export async function seoScore(payload) {
  const { data } = await api.post('/api/ai/seo-score/', payload)
  return data
}
