import axios from 'axios'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

const api = axios.create({ baseURL: BASE })

export function getImgUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const root = BASE.replace('/api', '')
  return `${root}${path.startsWith('/') ? '' : '/'}${path}`
}

export const getProductos = () => api.get('/productos/')
export const getEventos   = () => api.get('/eventos/')
export const getGaleria   = (categoria?: string) => api.get('/eventos/', { params: categoria ? { categoria } : {} })
export const crearReserva = (data: object) => api.post('/reservas/', data)
export const getSettings  = () => api.get('/settings/')

export default api
