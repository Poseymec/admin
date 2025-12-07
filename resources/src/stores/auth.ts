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

  getters: {
    isPending: (state) => state.user?.role === 'User',
    isAdmin:   (state) => state.user?.role === 'Admin',
    isSuper:   (state) => state.user?.role === 'Super Admin',
  },
  actions: {
    /**
     * Se connecter
     */
   async login(email: string, password: string) {
      this.isLoading = true
      try {
        // ✅ Récupère le cookie CSRF
        await axios.get('/sanctum/csrf-cookie')

        const res = await axios.post('/api/auth/login', { email, password })
        this.user = res.data.user
        this.isAuthenticated = true
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>
        let message = 'Une erreur inconnue est survenue.'

        if (!error.response) {
          message = 'Impossible de contacter le serveur.'
        } else if (error.response.status === 422) {
          const errors = error.response.data.errors
          if (errors) {
            message = Object.values(errors)[0][0]
          } else {
            message = error.response.data.message || 'Données invalides.'
          }
        } else if (error.response.status === 403) {
          message = "Votre adresse email n'est pas vérifiée."
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
     async register({ name, email, password }: { name: string; email: string; password: string }) {
      this.isLoading = true
      try {
        // ✅ Récupère le cookie CSRF
        await axios.get('/sanctum/csrf-cookie')

        const response = await axios.post('/api/auth/register', {
          name,
          email,
          password,
          password_confirmation: password,
        })

        localStorage.setItem('lastRegisteredEmail', email)

        this.user = null
        this.isAuthenticated = false

        return response.data
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>
        let message = "Une erreur est survenue lors de l'inscription."

        if (!error.response) {
          message = 'Impossible de contacter le serveur.'
        } else if (error.response.status === 422) {
          const errors = error.response.data.errors
          if (errors) {
            message = Object.values(errors)[0][0]
          }
        } else if (error.response.status === 409) {
          message = 'Cet email est déjà utilisé.'
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
        console.warn('Logout error:', err)
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
    async resetPassword(  token: string,email:string, password: string) {
      this.isLoading = true
      try {
        await axios.post('/api/auth/reset-password', {
          token,
          email,
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
      async changePassword(payload: {
      current_password: string
      password: string
      password_confirmation: string
    }) {
      this.isLoading = true
      try {
        await axios.put('/api/auth/password', payload)
        // Optionnel : déconnecte ou notifie l'utilisateur
        alert('Mot de passe mis à jour avec succès.')
      } catch (err: any) {
        let message = 'Impossible de changer le mot de passe.'

        if (err.response?.status === 422) {
          const errors = err.response.data.errors
          message = errors?.current_password?.[0] || errors?.password?.[0] || 'Données invalides.'
        } else if (err.response?.status === 401) {
          message = 'Session expirée. Veuillez vous reconnecter.'
        } else {
          message = err.response?.data?.message || 'Erreur inconnue.'
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
     * Renvoyer l'email de vérification
     */
   async resendVerificationEmail(email: string) {
  this.isLoading = true
  try {
    await axios.post('/api/auth/email/verification-notification', { email })
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
        this.user = null
        this.isAuthenticated = false
      }
    },

    /**
     *
     * liste des utilisateurs
     */
 async fetchAllUsers() {
  this.isLoading = true
  try {
    await axios.get('/sanctum/csrf-cookie')
    const res = await axios.get('/api/auth/users')

    // ✅ Vérifie que la structure est correcte
    if (!res.data || !Array.isArray(res.data.users)) {
      throw new Error('Format de réponse invalide.')
    }

    return res.data.users
  } catch (err: any) {
    console.error('Erreur fetchAllUsers:', err)
    if (err.response?.status === 403) {
      throw new Error('Accès refusé.')
    }
    throw new Error('Impossible de charger les utilisateurs.')
  } finally {
    this.isLoading = false
  }
},

async updateUserRole(userId: number, role: string) {
  try {
    await axios.patch(`/api/auth/users/${userId}/role`, { role });
  } catch (err: any) {
    const res = err.response;
    if (res?.status === 400) {
      throw new Error(res.data.message || 'Vous ne pouvez pas modifier votre propre rôle.');
    }
    if (res?.status === 403) {
      throw new Error(res.data.message || 'Action non autorisée.');
    }
    if (res?.status === 422) {
      const msg = Object.values((res.data.errors as Record<string, string[]>) || {})[0]?.[0];
      throw new Error(msg || 'Données invalides.');
    }
    throw new Error(res?.data?.message || 'Erreur lors de la mise à jour du rôle.');
  }
},

async deleteUser(userId: number) {
  try {
    await axios.delete(`/api/auth/users/${userId}`);
  } catch (err: any) {
    const res = err.response;
    if (res?.status === 400) {
      throw new Error(res.data.message || 'Vous ne pouvez pas supprimer votre propre compte.');
    }
    if (res?.status === 403) {
      throw new Error(res.data.message || 'Action non autorisée.');
    }
    if (res?.status === 404) {
      throw new Error('Utilisateur introuvable.');
    }
    throw new Error(res?.data?.message || 'Erreur lors de la suppression.');
  }
}
}

})
