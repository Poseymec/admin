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
import api from '@/services/axios'
import { useAuthStore } from '@/stores/auth'

const pinia = createPinia()

/* 1. CSRF */
api.get('/sanctum/csrf-cookie')
  /* 2. User */
  .then(() => api.get('/api/auth/user'))
  .then((res) => {
    pinia.use(() => {
      const authStore = useAuthStore()
      authStore.user = res.data
      authStore.isAuthenticated = true
    })
  })
  .catch(() => {
    pinia.use(() => {
      const authStore = useAuthStore()
      authStore.$reset()
    })
  })
  /* 3. Montage */
  .finally(() => {
    createApp(App).use(pinia).use(router).use(VueApexCharts).mount('#app')
  })
