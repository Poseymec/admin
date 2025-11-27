// main.ts
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
import axios from 'axios'

axios.defaults.withCredentials = true

const pinia = createPinia()
const app = createApp(App)


app.use(pinia)
app.use(router)
app.use(VueApexCharts)

// ✅ Vérifie l'authentification APRÈS installation de Pinia
const { useAuthStore } = await import('@/stores/auth') // Chargement dynamique pour éviter les cycles
const authStore = useAuthStore()
await authStore.fetchUser()

app.mount('#app')