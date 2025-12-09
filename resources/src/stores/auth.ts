import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'
import api from '@/services/axios'

/* ---------- types ---------- */
export interface User {
  id: number
  name: string
  email: string
  role: string
}

interface ValidationError {
  errors: Record<string, string[]>
}

/* ---------- store ---------- */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    isLoading: false,
  }),

  getters: {
    isPending: (s) => s.user?.role === 'User',
    isAdmin:   (s) => s.user?.role === 'Admin',
    isSuper:   (s) => s.user?.role === 'Super Admin',
  },

  actions: {
    /* ------ CSRF ------ */
    async csrf() {
      await api.get('/sanctum/csrf-cookie')
    },

    /* ------ login ------ */
    async login(email: string, password: string) {
      this.isLoading = true
      try {
        await this.csrf()
        const { data } = await api.post('/api/auth/login', { email, password })
        this.user = data.user
        this.isAuthenticated = true
      } catch (err: any) {
        const res = (err as AxiosError<ValidationError>).response
        if (res?.status === 422) {
          const firstKey = Object.keys(res.data.errors || {})[0]
          throw new Error(res.data.errors?.[firstKey]?.[0] || 'Données invalides')
        }
        if (res?.status === 401) throw new Error('Identifiants incorrects')
        throw new Error('Erreur de connexion')
      } finally {
        this.isLoading = false
      }
    },

    /* ------ register ------ */
    async register(payload: { name: string; email: string; password: string }) {
      this.isLoading = true
      try {
        await this.csrf()
        const { data } = await api.post('/api/auth/register', {
          ...payload,
          password_confirmation: payload.password,
        })
        localStorage.setItem('lastRegisteredEmail', payload.email)
        this.$reset()
        return data
      } catch (err: any) {
        const res = (err as AxiosError<ValidationError>).response
        if (res?.status === 422) {
          const firstKey = Object.keys(res.data.errors || {})[0]
          throw new Error(res.data.errors?.[firstKey]?.[0] || 'Données invalides')
        }
        if (res?.status === 409) throw new Error('Cet email est déjà utilisé.')
        throw new Error('Erreur d’inscription')
      } finally {
        this.isLoading = false
      }
    },

    /* ------ logout ------ */
    async logout() {
      try { await api.post('/api/auth/logout') } catch {}
      this.$reset()
    },

    /* ------ forgot password ------ */
    async forgotPassword(email: string) {
      this.isLoading = true
      try {
        await api.post('/api/auth/forgot-password', { email })
      } catch (err: any) {
        const res = (err as AxiosError<ValidationError>).response
        if (res?.status === 422) throw new Error(res.data.errors?.email?.[0] || 'Email invalide')
        throw new Error('Erreur lors de l’envoi du lien')
      } finally {
        this.isLoading = false
      }
    },

    /* ------ reset password ------ */
    async resetPassword(token: string, email: string, password: string) {
      this.isLoading = true
      try {
        await api.post('/api/auth/reset-password', {
          token,
          email,
          password,
          password_confirmation: password,
        })
      } catch (err: any) {
        const res = (err as AxiosError<ValidationError>).response
        if (res?.status === 422) {
          const firstKey = Object.keys(res.data.errors || {})[0]
          throw new Error(res.data.errors?.[firstKey]?.[0] || 'Données invalides')
        }
        if (res?.status === 400) throw new Error('Lien invalide ou expiré')
        throw new Error('Erreur de réinitialisation')
      } finally {
        this.isLoading = false
      }
    },

    /* ------ change password ------ */
    async changePassword(payload: { current_password: string; password: string; password_confirmation: string }) {
      this.isLoading = true
      try {
        await api.put('/api/auth/password', payload)
      } catch (err: any) {
        const res = (err as AxiosError<ValidationError>).response
        if (res?.status === 422) {
          const firstKey = Object.keys(res.data.errors || {})[0]
          throw new Error(res.data.errors?.[firstKey]?.[0] || 'Données invalides')
        }
        if (res?.status === 401) throw new Error('Session expirée')
        throw new Error('Erreur lors du changement')
      } finally {
        this.isLoading = false
      }
    },

    /* ------ verify email ------ */
    async verifyEmail(uid: string, hash: string) {
      this.isLoading = true
      try {
        await api.post('/api/auth/email/verify', { uid, hash })
      } catch (err: any) {
        const res = (err as AxiosError<{ message?: string }>).response
        if (res?.status === 400) throw new Error('Lien invalide ou déjà utilisé')
        throw new Error(res?.data?.message || 'Vérification échouée')
      } finally {
        this.isLoading = false
      }
    },

    /* ------ resend verification email ------ */
    async resendVerificationEmail(email: string) {
      this.isLoading = true
      try {
        await api.post('/api/auth/email/verification-notification', { email })
      } finally {
        this.isLoading = false
      }
    },

    /* ------ fetch connected user ------ */
    async fetchUser() {
      try {
        const { data } = await api.get('/api/auth/user')
        this.user = data
           console.log('📦 user reçu', data)
        this.isAuthenticated = true
      } catch {
        this.$reset()
      }
    },

    /* ------ users list (admin) ------ */
    async fetchAllUsers() {
      this.isLoading = true
      try {
        const { data } = await api.get('/api/auth/users')
        if (!Array.isArray(data.users)) throw new Error('Format invalide')
        return data.users
      } catch (err: any) {
        if (err.response?.status === 403) throw new Error('Accès refusé')
        throw new Error('Impossible de charger les utilisateurs')
      } finally {
        this.isLoading = false
      }
    },

    /* ------ update role ------ */
    async updateUserRole(userId: number, role: string) {
      try {
        await api.patch(`/api/auth/users/${userId}/role`, { role })
      } catch (err: any) {
        const res = err.response
        if (res?.status === 400) throw new Error(res.data.message || 'Vous ne pouvez pas modifier votre propre rôle')
        if (res?.status === 403) throw new Error('Action non autorisée')
        if (res?.status === 422) {
          const firstKey = Object.keys(res.data.errors || {})[0]
          throw new Error(res.data.errors?.[firstKey]?.[0] || 'Données invalides')
        }
        throw new Error(res?.data?.message || 'Erreur lors de la mise à jour du rôle')
      }
    },

    /* ------ delete user ------ */
    async deleteUser(userId: number) {
      try {
        await api.delete(`/api/auth/users/${userId}`)
      } catch (err: any) {
        const res = err.response
        if (res?.status === 400) throw new Error(res.data.message || 'Vous ne pouvez pas supprimer votre propre compte')
        if (res?.status === 403) throw new Error('Action non autorisée')
        if (res?.status === 404) throw new Error('Utilisateur introuvable')
        throw new Error(res?.data?.message || 'Erreur lors de la suppression')
      }
    },
  },
})
