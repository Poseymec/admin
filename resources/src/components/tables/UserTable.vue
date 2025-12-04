<template>
  <div class="p-6">
    <h1 class="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Utilisateurs inscrits</h1>

    <!-- Messages d'erreur -->
    <div v-if="errorMessage" class="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20">
      {{ errorMessage }}
    </div>

  <!-- Loading -->
  <div v-if="loading" class="flex items-center justify-center py-10">
      <svg class="animate-spin h-6 w-6 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

  <!-- Tableau -->
  <div v-else-if="users.length" class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Utilisateur</th>
              <th class="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Email</th>
              <th class="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Rôle</th>
              <th class="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Inscrit le</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in users" :key="user.id" class="border-t border-gray-100 dark:border-gray-800">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center w-10 h-10 text-sm font-bold text-white bg-brand-500 rounded-full">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-medium text-gray-800 dark:text-white/90">{{ user.name }}</span>
                </div>
              </td>
              <td class="px-5 py-4 text-gray-500 dark:text-gray-400">{{ user.email }}</td>
              <td class="px-5 py-4">
                <span class="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {{ user.role || 'Utilisateur' }}
                </span>
              </td>
              <td class="px-5 py-4 text-gray-500 dark:text-gray-400">
                {{ new Date(user.created_at).toLocaleDateString('fr-FR') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="!loading" class="text-center py-10 text-gray-500 dark:text-gray-400">
      Aucun utilisateur trouvé.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface UserRecord {
  id: number
  name: string
  email: string
  role?: string | null
  created_at: string
}

const users = ref<UserRecord[]>([])
const loading = ref<boolean>(false)
const errorMessage = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    const authStore = useAuthStore()
    const data = await authStore.fetchAllUsers()
    users.value = Array.isArray(data) ? (data as UserRecord[]) : []
  } catch (err: any) {
    users.value = []
    errorMessage.value = err?.message ?? String(err)
  } finally {
    loading.value = false
  }
})
</script>
