import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
})

export const getChef = () => api.get('/chef/')
export const getCategorias = () => api.get('/categorias/')
export const getPlatos = (params?: object) => api.get('/platos/', { params })
export const getRecetas = () => api.get('/recetas/')
export const getReceta = (slug: string) => api.get(`/recetas/${slug}/`)
export const getEventos = () => api.get('/eventos/')
export const crearReserva = (data: object) => api.post('/reservas/', data)

export default api


export const getGaleria = (categoria?: string) =>
  api.get('/galeria/', { params: categoria ? { categoria } : {} }).then(r => r.data)