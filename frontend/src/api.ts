import axios from 'axios'

export const TOKEN_KEY = 'ytasty_staff_token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem(TOKEN_KEY)
      window.dispatchEvent(new Event('auth:expired'))
    }
    return Promise.reject(error)
  },
)

export interface StaffUser {
  username: string
  role: 'admin' | 'staff' | 'direction'
  restaurant_id: number | null
}

export interface Restaurant {
  id: number
  name: string
  address: string
  contact: string
  is_open: boolean
}

export interface Product {
  id: number
  name: string
  image: string
  description: string
  category: string
  price: number
  is_available: boolean
  restaurant_id: number
  ingredients: string[]
}

export interface Order {
  order_number: string
  restaurant_id: number
  created_at: string
  items: { product_id: number; quantity: number }[]
  total_price: number
  status: 'pending' | 'validated' | 'preparing' | 'ready' | 'collected' | 'cancelled'
  pickup_mode: 'onsite' | 'takeaway'
  customer: { name: string; email: string }
}

export type ProductInput = Omit<Product, 'id'>

export function getStaffFromToken(token: string): StaffUser | null {
  try {
    const payload = token.split('.')[1]
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const claims = JSON.parse(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')))
    if (!['admin', 'staff', 'direction'].includes(claims.role) || claims.exp <= Date.now() / 1000) return null
    return {
      username: claims.sub,
      role: claims.role,
      restaurant_id: claims.restaurant_id ?? null,
    }
  } catch {
    return null
  }
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (error.code === 'ERR_NETWORK') return 'API inaccessible. Vérifiez que le serveur FastAPI est lancé.'
  }
  return 'Une erreur est survenue. Veuillez réessayer.'
}