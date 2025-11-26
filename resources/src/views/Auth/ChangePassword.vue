<!-- src/views/profile/ChangePassword.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="max-w-md space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Mot de passe actuel</label>
      <input
        v-model="form.current_password"
        type="password"
        class="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
        placeholder="Votre mot de passe actuel"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Nouveau mot de passe</label>
      <input
        v-model="form.password"
        type="password"
        class="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
        placeholder="Nouveau mot de passe"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Confirmer</label>
      <input
        v-model="form.password_confirmation"
        type="password"
        class="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
        placeholder="Confirmer le mot de passe"
      />
    </div>

    <button
      type="submit"
      :disabled="authStore.isLoading"
      class="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600 disabled:opacity-60"
    >
      {{ authStore.isLoading ? 'Mise à jour...' : 'Changer le mot de passe' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const form = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const handleSubmit = async () => {
  try {
    await authStore.changePassword(form)
    // Réinitialise le formulaire après succès
    form.current_password = ''
    form.password = ''
    form.password_confirmation = ''
  } catch (err: any) {
    alert(err.message)
  }
}
</script>