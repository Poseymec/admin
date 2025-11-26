<!-- src/views/auth/VerifyEmailNotice.vue -->
<template>
  <FullScreenLayout>
    <div class="flex flex-col items-center justify-center h-screen text-center">
      <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white">Vérifiez votre e-mail</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400 max-w-md px-4">
        Un e-mail de vérification a été envoyé à <strong>{{ email }}</strong>. Veuillez cliquer sur le lien dans cet e-mail pour activer votre compte.
      </p>
      <button
        @click="resend"
        :disabled="isSending"
        class="mt-6 px-4 py-2 text-sm text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 dark:text-brand-400 dark:border-brand-800 disabled:opacity-60"
      >
        {{ isSending ? 'Envoi...' : 'Renvoyer l’e-mail' }}
      </button>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isSending = ref(false)
const email = ref('')

onMounted(() => {
  // Récupère l’e-mail depuis le store ou localStorage
  email.value = authStore.user?.email || localStorage.getItem('lastRegisteredEmail') || ''
})

const resend = async () => {
  if (!email.value) return
  isSending.value = true
  try {
    await authStore.resendVerificationEmail(email.value)
    alert('E-mail de vérification renvoyé.')
  } catch (err: any) {
    alert(err.message || 'Échec de l’envoi.')
  } finally {
    isSending.value = false
  }
}
</script>