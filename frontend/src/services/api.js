import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const datasetService = {
  list(filters = {}) {
    return client.get('/api/datasets', { params: filters })
  },
  get(id) {
    return client.get(`/api/datasets/${id}`)
  },
  create(payload) {
    return client.post('/api/datasets', payload)
  },
}

export const metaService = {
  sectors() {
    return client.get('/api/sectors')
  },
  departments() {
    return client.get('/api/departments')
  },
}
