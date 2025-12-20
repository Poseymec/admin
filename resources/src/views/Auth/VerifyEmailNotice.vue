<!-- src/views/auth/VerifyEmailNotice.vue -->
<template>
  <FullScreenLayout>
    <div class="flex flex-col items-center justify-center h-screen text-center">
      <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white">
        {{ t('auth.verify_email_notice.title') }}
      </h1>
      <i18n-t
        keypath="auth.verify_email_notice.message"
        tag="p"
        class="mt-2 text-gray-600 dark:text-gray-400 max-w-md px-4"
      >
        <template #email>
          <strong>{{ email }}</strong>
        </template>
      </i18n-t>

      <!-- Messages de feedback -->
      <div v-if="successMessage" class="mt-3 text-sm text-green-600 dark:text-green-400">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="mt-3 text-sm text-red-600 dark:text-red-400">
        {{ errorMessage }}
      </div>

      <button
        @click="resend"
        :disabled="isSending || !email"
        class="mt-6 px-4 py-2 text-sm text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 dark:text-brand-400 dark:border-brand-800 disabled:opacity-60"
      >
        {{ isSending ? t('auth.verify_email_notice.resend_button_sending') : t('auth.verify_email_notice.resend_button') }}
      </button>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()

const authStore = useAuthStore()
const isSending = ref(false)
const email = ref('')
const successMessage = ref('')
const errorMessage = ref('')

onMounted(() => {
  // Récupère l’e-mail depuis le store ou localStorage
  email.value = authStore.user?.email || localStorage.getItem('lastRegisteredEmail') || ''
})

const resend = async () => {
  if (!email.value) return

  successMessage.value = ''
  errorMessage.value = ''
  isSending.value = true

  try {
    await authStore.resendVerificationEmail(email.value)
    successMessage.value = t('auth.verify_email_notice.resend_success')
  } catch (err: any) {
    errorMessage.value = err.message || t('auth.verify_email_notice.resend_error')
  } finally {
    isSending.value = false
  }
}
</script>
