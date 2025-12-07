import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:8000
  withCredentials: true,                 // cookie Sanctum
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

export default api
