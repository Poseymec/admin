// stores/auth.ts
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'

interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string[]>
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | Record<string, any>,
    isAuthenticated: false,
    isLoading: false,
  }),

  actions: {
    /**
     * Se connecter
     */
    async login(email: string, password: string) {
      this.isLoading = true
      try {
        const res = await axios.post('/api/auth/login', { email, password })
        this.user = res.data.user
        this.isAuthenticated = true
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>
        let message = 'Une erreur inconnue est survenue.'

        if (!error.response) {
          message = 'Impossible de contacter le serveur. Vérifiez votre connexion internet.'
        } else if (error.response.status === 422) {
          // Erreur de validation Laravel
          const errors = error.response.data.errors
          if (errors) {
            message = Object.values(errors)[0][0] // Premier message d'erreur
          } else {
            message = error.response.data.message || 'Données invalides.'
          }
        } else if (error.response.status === 403) {
          message = 'Votre adresse email n’est pas vérifiée. Veuillez consulter vos emails.'
        } else if (error.response.status === 401) {
          message = 'Email ou mot de passe incorrect.'
        } else {
          message = error.response.data.message || 'Erreur lors de la connexion.'
        }

        throw new Error(message)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * S'inscrire
     */
    async register( { name, email, password }: { name: string; email: string; password: string }) {
      this.isLoading = true
      try {
        await axios.post('/api/auth/register', {
          name,
          email,
          password,
          password_confirmation: password,
        })
        // ✅ Pas d'authentification après inscription
        // L'utilisateur doit vérifier son email d'abord
        this.user = null
        this.isAuthenticated = false
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>
        let message = 'Une erreur est survenue lors de l’inscription.'

        if (!error.response) {
          message = 'Impossible de contacter le serveur. Vérifiez votre connexion.'
        } else if (error.response.status === 422) {
          const errors = error.response.data.errors
          if (errors) {
            message = Object.values(errors)[0][0]
          } else {
            message = error.response.data.message || 'Données invalides.'
          }
        } else if (error.response.status === 409) {
          message = 'Cet email est déjà utilisé.'
        } else {
          message = error.response.data.message || 'Erreur inconnue. Veuillez réessayer.'
        }

        throw new Error(message)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Déconnexion
     */
    async logout() {
      try {
        await axios.post('/api/auth/logout')
      } catch (err) {
        console.warn('Logout warning:', err)
        // On se déconnecte quand même côté client
      } finally {
        this.user = null
        this.isAuthenticated = false
      }
    },

    /**
     * Demander un lien de réinitialisation
     */
    async forgotPassword(email: string) {
      this.isLoading = true
      try {
        await axios.post('/api/auth/forgot-password', { email })
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>
        let message = 'Impossible d’envoyer le lien de réinitialisation.'

        if (!error.response) {
          message = 'Pas de connexion au serveur.'
        } else if (error.response.status === 422) {
          const errors = error.response.data.errors
          message = errors?.email ? errors.email[0] : 'Adresse email invalide.'
        } else {
          message = error.response.data.message || 'Erreur inconnue.'
        }

        throw new Error(message)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Réinitialiser le mot de passe
     */
    async resetPassword(token: string, password: string) {
      this.isLoading = true
      try {
        await axios.post('/api/auth/reset-password', {
          token,
          password,
          password_confirmation: password,
        })
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>
        let message = 'Impossible de réinitialiser le mot de passe.'

        if (!error.response) {
          message = 'Pas de connexion au serveur.'
        } else if (error.response.status === 422) {
          const errors = error.response.data.errors
          if (errors) {
            message = Object.values(errors)[0][0]
          } else {
            message = error.response.data.message || 'Données invalides.'
          }
        } else if (error.response.status === 400) {
          message = 'Le lien de réinitialisation est invalide ou a expiré.'
        } else {
          message = error.response.data.message || 'Erreur inconnue.'
        }

        throw new Error(message)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Vérifier l'email
     */
    async verifyEmail(uid: string, hash: string) {
      this.isLoading = true
      try {
        await axios.post('/api/auth/email/verify', { uid, hash })
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>
        let message = 'La vérification de l’email a échoué.'

        if (!error.response) {
          message = 'Pas de connexion au serveur.'
        } else if (error.response.status === 400) {
          message = 'Le lien de vérification est invalide ou a déjà été utilisé.'
        } else if (error.response.status === 422) {
          message = error.response.data.message || 'Données invalides.'
        } else {
          message = error.response.data.message || 'Erreur inconnue.'
        }

        throw new Error(message)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Récupérer l'utilisateur connecté
     */
    async fetchUser() {
      try {
        const res = await axios.get('/api/auth/user')
        this.user = res.data.user
        this.isAuthenticated = true
      } catch (err) {
        // Silencieux : pas d'utilisateur connecté
        this.user = null
        this.isAuthenticated = false
      }
    },
  },
})
