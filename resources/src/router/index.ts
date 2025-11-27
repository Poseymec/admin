import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Routes publiques
const publicRoutes: RouteRecordRaw[] = [
  { path: '/signin', name: 'Signin', component: () => import('@/views/Auth/Signin.vue'), meta: { title: 'Signin' } },
  { path: '/signup', name: 'Signup', component: () => import('@/views/Auth/Signup.vue'), meta: { title: 'Signup' } },
  { path: '/forgot-password', name: 'ForgotPassword', component: () => import('@/views/Auth/ForgotPassword.vue'), meta: { title: 'ForgotPassword' } },
  { path: '/reset-password', name: 'ResetPassword', component: () => import('@/views/Auth/ResetPassword.vue'), meta: { title: 'ResetPassword' } },
  { path: '/verify-email', name: 'VerifyEmailNotice', component: () => import('@/views/Auth/VerifyEmailNotice.vue'), meta: { title: 'VerifyEmailNotice' } },
  { path: '/verifyemail/:uid/:hash', name: 'VerifyEmail', component: () => import('@/views/Auth/VerifyEmail.vue'), meta: { title: 'VerifyEmail' } },
]

// Routes protégées
const protectedRoutes: RouteRecordRaw[] = [
  { path: '/', name: 'Ecommerce', component: () => import('@/views/Ecommerce.vue'), meta: { title: 'eCommerce Dashboard' } },
  { path: '/calendar', name: 'Calendar', component: () => import('@/views/Others/Calendar.vue'), meta: { title: 'Calendar' } },
  { path: '/profile', name: 'Profile', component: () => import('@/views/Others/UserProfile.vue'), meta: { title: 'Profile' } },
  { path: '/form-elements', name: 'Form Elements', component: () => import('@/views/Forms/FormElements.vue'), meta: { title: 'Form Elements' } },
  { path: '/basic-tables', name: 'Basic Tables', component: () => import('@/views/Tables/BasicTables.vue'), meta: { title: 'Basic Tables' } },
  { path: '/line-chart', name: 'Line Chart', component: () => import('@/views/Chart/LineChart/LineChart.vue'), meta: { title: 'Line Chart' } },
  { path: '/bar-chart', name: 'Bar Chart', component: () => import('@/views/Chart/BarChart/BarChart.vue'), meta: { title: 'Bar Chart' } },
  { path: '/alerts', name: 'Alerts', component: () => import('@/views/UiElements/Alerts.vue'), meta: { title: 'Alerts' } },
  { path: '/avatars', name: 'Avatars', component: () => import('@/views/UiElements/Avatars.vue'), meta: { title: 'Avatars' } },
  { path: '/badge', name: 'Badge', component: () => import('@/views/UiElements/Badges.vue'), meta: { title: 'Badge' } },
  { path: '/buttons', name: 'Buttons', component: () => import('@/views/UiElements/Buttons.vue'), meta: { title: 'Buttons' } },
  { path: '/images', name: 'Images', component: () => import('@/views/UiElements/Images.vue'), meta: { title: 'Images' } },
  { path: '/videos', name: 'Videos', component: () => import('@/views/UiElements/Videos.vue'), meta: { title: 'Videos' } },
  { path: '/blank', name: 'Blank', component: () => import('@/views/Pages/BlankPage.vue'), meta: { title: 'Blank' } },
  { path: '/change-password', name: 'ChangePassword', component: () => import('@/views/Auth/ChangePassword.vue'), meta: { title: 'ChangePassword' } },
]

// Routes d'erreur
const errorRoutes: RouteRecordRaw[] = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/Errors/FourZeroFour.vue'), meta: { title: '404 Error' } },
]

const routes: RouteRecordRaw[] = [...publicRoutes, ...protectedRoutes, ...errorRoutes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes,
})

// 🔐 Guard global corrigé
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const publicRouteNames = ['Signin', 'Signup', 'ForgotPassword', 'ResetPassword', 'VerifyEmailNotice', 'VerifyEmail']

  // Vérifie l'authentification si nécessaire
  if (authStore.user === null) {
    await authStore.fetchUser()
  }

  const isAuthenticated = authStore.isAuthenticated
  const isPublicRoute = publicRouteNames.includes(to.name as string)

  // Si route protégée et non authentifié → login
  if (!isPublicRoute && !isAuthenticated) {
    next({ name: 'Signin' })
    return
  }

  // Si route publique de login et déjà authentifié → dashboard
  if (isPublicRoute && (to.name === 'Signin' || to.name === 'Signup') && isAuthenticated) {
    next({ name: 'Ecommerce' })
    return
  }

  // Sinon, autoriser la navigation
  next()
})

export default router