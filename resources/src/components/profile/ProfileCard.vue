<template>
  <!-- ⏳ Chargement ou non connecté : spinner uniquement -->
  <div v-if="!user" class="flex items-center justify-center h-40">
    <svg
      class="animate-spin h-6 w-6 text-brand-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>

  <!-- ✅ Connecté : affichage du profil -->
  <div v-else class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
    <!-- En-tête -->
    <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
      <div class="flex flex-col items-center w-full gap-6 xl:flex-row">
        <div
          class="flex items-center justify-center w-20 h-20 text-2xl font-bold text-white bg-brand-500 border border-gray-200 rounded-full dark:border-gray-800"
        >
          {{ userInitial }}
        </div>
        <div class="text-center xl:text-left">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90">
            {{ user.name }}
          </h4>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ user.email }}
          </p>
          <p class="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ user.role }}
          </p>
        </div>
      </div>

      <button
        @click="showLogoutModal = true"
        class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/30"
      >
        {{ t('user.profile.logout_button') }}
      </button>
    </div>

    <!-- Onglets -->
    <div class="mt-8 border-b border-gray-200 dark:border-gray-800">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="activeTab = 'info'"
          :class="{
            'border-brand-500 text-brand-600 dark:text-brand-400': activeTab === 'info',
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300': activeTab !== 'info',
          }"
          class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
        >
          {{ t('user.profile.tabs.info') }}
        </button>
        <button
          @click="activeTab = 'password'"
          :class="{
            'border-brand-500 text-brand-600 dark:text-brand-400': activeTab === 'password',
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300': activeTab !== 'password',
          }"
          class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
        >
          {{ t('user.profile.tabs.password') }}
        </button>
      </nav>
    </div>

    <!-- Contenu des onglets -->
    <div class="mt-6">
      <!-- Informations personnelles -->
      <div v-if="activeTab === 'info'" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
              {{ t('user.profile.info.name_label') }}
            </label>
            <p class="mt-1 text-gray-900 dark:text-white">{{ user.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
              {{ t('user.profile.info.email_label') }}
            </label>
            <p class="mt-1 text-gray-900 dark:text-white">{{ user.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
              {{ t('user.profile.info.role_label') }}
            </label>
            <p class="mt-1 text-gray-900 dark:text-white">{{ user.role }}</p>
          </div>
        </div>
      </div>

      <!-- Changement de mot de passe -->
      <div v-else-if="activeTab === 'password'" class="max-w-md">
        <form @submit.prevent="handleChangePassword" class="space-y-5">
          <!-- Mot de passe actuel -->
          <PasswordField
            v-model="form.current_password"
            :label="t('user.profile.password_form.current_password.label')"
            id="current_password"
            :placeholder="t('user.profile.password_form.current_password.placeholder')"
            :show-toggle="true"
            v-model:show-password="showCurrentPassword"
          />

          <!-- Nouveau mot de passe -->
          <PasswordField
            v-model="form.password"
            :label="t('user.profile.password_form.new_password.label')"
            id="password"
            :placeholder="t('user.profile.password_form.new_password.placeholder')"
            :show-toggle="true"
            v-model:show-password="showNewPassword"
          />

          <!-- Confirmation -->
          <PasswordField
            v-model="form.password_confirmation"
            :label="t('user.profile.password_form.confirm_password.label')"
            id="password_confirmation"
            :placeholder="t('user.profile.password_form.confirm_password.placeholder')"
            :show-toggle="true"
            v-model:show-password="showConfirmPassword"
          />

          <!-- Messages -->
          <div v-if="successMessage" class="p-3 text-sm text-green-600 bg-green-50 rounded-lg dark:bg-green-900/20 dark:text-green-400">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
            {{ errorMessage }}
          </div>

          <!-- Bouton -->
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ t('user.profile.password_form.submit_button_loading') }}
            </span>
            <span v-else>
              {{ t('user.profile.password_form.submit_button') }}
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal de déconnexion -->
  <Modal v-if="showLogoutModal" @close="showLogoutModal = false">
    <template #body>
      <div class="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 dark:bg-gray-900">
        <button @click="showLogoutModal = false" class="absolute right-4 top-4 text-gray-400">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('user.profile.logout_modal.title') }}
          </h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ t('user.profile.logout_modal.description') }}
          </p>
          <div class="mt-6 flex justify-center gap-3">
            <button
              @click="showLogoutModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            >
              {{ t('user.profile.logout_modal.cancel') }}
            </button>
            <button
              @click="confirmLogout"
              :disabled="authStore.isLoading"
              class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-60"
            >
              {{
                authStore.isLoading
                  ? t('user.profile.logout_modal.confirm_loading')
                  : t('user.profile.logout_modal.confirm')
              }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import Modal from '@/components/ui/Modal.vue'
import PasswordField from '@/components/ui/PasswordField.vue'

const { t } = useI18n()
const authStore = useAuthStore()

const activeTab = ref('info')
const showLogoutModal = ref(false)

const form = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const errorMessage = ref('')
const successMessage = ref('')

watch(activeTab, () => {
  errorMessage.value = ''
  successMessage.value = ''
})

const user = computed(() => authStore.user)
const userInitial = computed(() => user.value?.name.charAt(0).toUpperCase() ?? '')

const handleChangePassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (form.password !== form.password_confirmation) {
    errorMessage.value = t('user.profile.password_form.error.password_mismatch')
    return
  }

  try {
    await authStore.changePassword(form)
    successMessage.value = t('user.profile.password_form.success')
    // Réinitialise le formulaire
    Object.assign(form, {
      current_password: '',
      password: '',
      password_confirmation: '',
    })
    showCurrentPassword.value = false
    showNewPassword.value = false
    showConfirmPassword.value = false
    setTimeout(() => (successMessage.value = ''), 3000)
  } catch (err: any) {
    // Gère les erreurs i18n (cf. erreur store avec clés)
    const message = err.message || 'user.profile.password_form.error.unexpected'
    errorMessage.value = message.startsWith('auth.error.')
      ? t(message)
      : message
  }
}

const confirmLogout = async () => {
  try {
    await authStore.logout()
    window.location.href = '/signin'
  } catch (err) {
    console.error('Erreur déconnexion:', err)
    errorMessage.value = t('user.profile.password_form.error.unexpected')
  }
}
</script>
