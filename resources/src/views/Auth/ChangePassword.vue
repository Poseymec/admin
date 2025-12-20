<!-- src/views/profile/ChangePassword.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="max-w-md space-y-4">
    <!-- Erreurs / succès -->
    <div v-if="errorMessage" class="p-3 text-sm text-red-600 bg-red-50 rounded dark:bg-red-900/20 dark:text-red-400">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="p-3 text-sm text-green-600 bg-green-50 rounded dark:bg-green-900/20 dark:text-green-400">
      {{ successMessage }}
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">
        {{ t('auth.change_password.fields.current_password.label') }}
      </label>
      <input
        v-model="form.current_password"
        type="password"
        :placeholder="t('auth.change_password.fields.current_password.placeholder')"
        class="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">
        {{ t('auth.change_password.fields.password.label') }}
      </label>
      <input
        v-model="form.password"
        type="password"
        :placeholder="t('auth.change_password.fields.password.placeholder')"
        class="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">
        {{ t('auth.change_password.fields.password_confirmation.label') }}
      </label>
      <input
        v-model="form.password_confirmation"
        type="password"
        :placeholder="t('auth.change_password.fields.password_confirmation.placeholder')"
        class="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
      />
    </div>

    <button
      type="submit"
      :disabled="authStore.isLoading"
      class="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600 disabled:opacity-60"
    >
      {{ authStore.isLoading ? t('auth.change_password.submit_button_loading') : t('auth.change_password.submit_button') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()

const form = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const errorMessage = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (form.password !== form.password_confirmation) {
    errorMessage.value = t('auth.messages.register.error.password_mismatch')
    return
  }

  try {
    await authStore.changePassword(form)
    successMessage.value = t('auth.messages.change_password.success')
    // Réinitialise le formulaire
    form.current_password = ''
    form.password = ''
    form.password_confirmation = ''
  } catch (err: any) {
    errorMessage.value = err.message || t('auth.messages.change_password.error.unexpected')
  }
}
</script>
