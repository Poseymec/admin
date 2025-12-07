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

// Initialise le cookie CSRF une seule fois au démarrage
api.get('/sanctum/csrf-cookie')
  .then(() => {
    const app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.use(VueApexCharts)
    app.mount('#app')
  })
  .catch((err) => console.error('CSRF init failed', err))
