<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900">
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto text-center">
            <!-- Vérification en cours -->
            <div v-if="status === 'verifying'" class="space-y-4">
              <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Vérification de votre e-mail...</h2>
            </div>

            <!-- Succès -->
            <div v-else-if="status === 'success'" class="space-y-6">
              <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-gray-800 dark:text-white">E-mail vérifié !</h2>
              <p class="text-gray-600 dark:text-gray-400">
                Votre adresse e-mail a été vérifiée avec succès.
              </p>
              <router-link
                to="/signin"
                class="inline-block px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
              >
                Accéder à la connexion
              </router-link>
            </div>

            <!-- Erreur -->
            <div v-else class="space-y-6">
              <div class="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Échec de la vérification</h2>
              <p class="text-gray-600 dark:text-gray-400">
                Le lien de vérification est invalide ou a expiré.
              </p>
              
              <!-- Formulaire pour renvoyer l'e-mail -->
              <div class="pt-4">
                <input
                  v-model="resendEmail"
                  type="email"
                  placeholder="Votre adresse e-mail"
                  class="w-full max-w-xs px-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white/90"
                />
                <button
                  @click="resend"
                  :disabled="!resendEmail || isResending"
                  class="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-brand-600 bg-brand-50 border border-brand-200 rounded-lg hover:bg-brand-100 disabled:opacity-50 dark:text-brand-400 dark:bg-transparent dark:border-brand-800 dark:hover:bg-brand-950"
                >
                  <span v-if="isResending">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-600 dark:text-brand-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </span>
                  <span v-else>Renvoyer l’e-mail de vérification</span>
                </button>
                <div v-if="resendError" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ resendError }}
                </div>
                <div v-if="resendSuccess" class="mt-2 text-sm text-green-600 dark:text-green-400">
                  {{ resendSuccess }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side Banner -->
        <div class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div class="flex items-center justify-center z-1">
            <CommonGridShape />
            <div class="flex flex-col items-center max-w-xs">
              <router-link to="/" class="block mb-4">
                <img width="231" height="48" src="/images/logo/auth-logo.svg" alt="Logo" />
              </router-link>
              <p class="text-center text-gray-400 dark:text-white/60">
                Modèle de tableau de bord admin gratuit et open-source avec Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import { useAuthStore } from '@/stores/auth'

const status = ref<'verifying' | 'success' | 'error'>('verifying')
const resendEmail = ref('')
const resendError = ref('')
const resendSuccess = ref('')
const isResending = ref(false)

const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  const uid = route.params.uid as string
  const hash = route.params.hash as string

  if (!uid || !hash) {
    status.value = 'error'
    return
  }

  try {
    await authStore.verifyEmail(uid, hash)
    status.value = 'success'
  } catch (err: any) {
    console.error('Verification error:', err)
    status.value = 'error'
  }
})

const resend = async () => {
  resendError.value = ''
  resendSuccess.value = ''
  isResending.value = true

  try {
    await authStore.resendVerificationEmail(resendEmail.value)
    resendSuccess.value = 'Un nouveau lien de vérification a été envoyé à votre adresse e-mail.'
    // Optionnel : vider le champ après succès
    // resendEmail.value = ''
  } catch (err: any) {
    resendError.value = err.message || 'Une erreur est survenue lors de l’envoi.'
  } finally {
    isResending.value = false
  }
}
</script>