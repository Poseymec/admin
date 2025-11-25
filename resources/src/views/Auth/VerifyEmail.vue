<!-- src/views/auth/EmailVerify.vue -->
<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900">
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="w-full max-w-md pt-10 mx-auto">
            <router-link
              to="/"
              class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg
                class="stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
                  stroke=""
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Back to dashboard
            </router-link>
          </div>
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto text-center">
            <div v-if="status === 'verifying'" class="space-y-4">
              <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Verifying your email...</h2>
            </div>

            <div v-else-if="status === 'success'" class="space-y-6">
              <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Email Verified!</h2>
              <p class="text-gray-600 dark:text-gray-400">
                Your email address has been successfully verified.
              </p>
              <router-link
                to="/signin"
                class="inline-block px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
              >
                Go to Sign In
              </router-link>
            </div>

            <div v-else class="space-y-6">
              <div class="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Verification Failed</h2>
              <p class="text-gray-600 dark:text-gray-400">
                The verification link is invalid or has expired.
              </p>
              <button
                @click="resend"
                class="inline-block px-4 py-2.5 text-sm font-medium text-brand-600 bg-brand-50 border border-brand-200 rounded-lg hover:bg-brand-100 dark:text-brand-400 dark:bg-transparent dark:border-brand-800 dark:hover:bg-brand-950"
              >
                Resend Verification Email
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side Banner -->
        <div class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div class="flex items-center justify-center z-1">
            <common-grid-shape />
            <div class="flex flex-col items-center max-w-xs">
              <router-link to="/" class="block mb-4">
                <img width="231" height="48" src="/images/logo/auth-logo.svg" alt="Logo" />
              </router-link>
              <p class="text-center text-gray-400 dark:text-white/60">
                Free and Open-Source Tailwind CSS Admin Dashboard Template
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
const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  const uid = route.params.id as string
  const hash = route.query.hash as string

  if (!uid || !hash) {
    status.value = 'error'
    return
  }

  try {
    await authStore.verifyEmail(uid, hash) // ✅ 2 arguments
    status.value = 'success'
  } catch (err) {
    console.error(err)
    status.value = 'error'
  }
})

const resend = () => {
  alert('Resend feature requires email input.')
}
</script>