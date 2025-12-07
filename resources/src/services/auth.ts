import api from '@/services/axios'

// CSRF
export const csrf = () => api.get('/sanctum/csrf-cookie')

// Auth
export const login = async (email: string, password: string) => {
  await csrf()
  return api.post('/api/auth/login', { email, password })
}

export const logout = async () => api.post('/api/auth/logout')

export const getUser = async () => api.get('/api/auth/user')
