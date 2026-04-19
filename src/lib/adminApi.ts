import axios from 'axios'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
export const MEDIA_BASE = BASE.replace('/api', '')

const adminApi = axios.create({ baseURL: BASE })

adminApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

adminApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('admin_refresh')
        const res = await axios.post(`${BASE}/token/refresh/`, { refresh })
        localStorage.setItem('admin_token', res.data.access)
        original.headers.Authorization = `Bearer ${res.data.access}`
        return adminApi(original)
      } catch {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_refresh')
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export async function login(username: string, password: string) {
  const res = await axios.post(`${BASE}/token/`, { username, password })
  localStorage.setItem('admin_token', res.data.access)
  localStorage.setItem('admin_refresh', res.data.refresh)
}

export function logout() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_refresh')
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('admin_token')
}

export function getImageUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${MEDIA_BASE}${path.startsWith('/') ? '' : '/'}${path}`
}

// Productos
export const getProductos = () => adminApi.get('/productos/')
export const createProducto = (data: FormData) =>
  adminApi.post('/productos/', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateProducto = (id: number, data: FormData) =>
  adminApi.patch(`/productos/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteProducto = (id: number) => adminApi.delete(`/productos/${id}/`)

// Eventos
export const getEventos = () => adminApi.get('/eventos/')
export const createEvento = (data: FormData) =>
  adminApi.post('/eventos/', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateEvento = (id: number, data: FormData) =>
  adminApi.patch(`/eventos/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteEvento = (id: number) => adminApi.delete(`/eventos/${id}/`)

// Site Settings
export const getSettings = () => adminApi.get('/settings/')
export const updateSettings = (data: FormData) =>
  adminApi.patch('/settings/', data, { headers: { 'Content-Type': 'multipart/form-data' } })
