import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

/* ------ auto-retry CSRF si 419 ------ */
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 419) {
      // token CSRF expiré → on le regénère et on relance la requête
      await api.get('/sanctum/csrf-cookie')
      return api(err.config)
    }
    return Promise.reject(err)
  }
)

export default api
