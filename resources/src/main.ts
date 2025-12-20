import './assets/main.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import i18n from '@/services/i18n' // ✅ bien chargé
import api from '@/services/axios'
import { useAuthStore } from '@/stores/auth'

// 1. Créer l'instance Pinia une seule fois
const pinia = createPinia()

// 2. Créer l'application Vue une seule fois
const app = createApp(App)

// 3. Installer les plugins
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(VueApexCharts)

// 4. Initialisation : CSRF + chargement utilisateur
api.get('/sanctum/csrf-cookie')
  .then(() => api.get('/api/auth/user'))
  .then((res) => {
    const authStore = useAuthStore()
    authStore.user = res.data
    authStore.isAuthenticated = true
  })
  .catch(() => {
    const authStore = useAuthStore()
    authStore.$reset()
  })
  .finally(() => {
    // 5. Monter l'application UNE SEULE FOIS
    app.mount('#app')
  })
