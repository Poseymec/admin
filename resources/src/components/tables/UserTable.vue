<template>
  <div class="p-6">
    <h1 class="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Utilisateurs inscrits</h1>

    <!-- Messages -->
    <div v-if="errorMessage" class="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="mb-4 p-3 text-sm text-green-600 bg-green-50 rounded-lg dark:bg-green-900/20">
      {{ successMessage }}
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-10">
      <svg class="animate-spin h-6 w-6 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Tableau -->
    <div v-else-if="users.length" class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Utilisateur</th>
              <th class="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Email</th>
              <th class="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Rôle</th>
              <th class="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Inscrit le</th>
              <th class="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
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
                  {{ user.role || 'User' }}
                </span>
              </td>
              <td class="px-5 py-4 text-gray-500 dark:text-gray-400">
                {{ new Date(user.created_at).toLocaleDateString('fr-FR') }}
              </td>
              <td class="px-5 py-4">
                <div class="flex gap-2">
                  <!-- Modifier -->
                  <button
                    @click="openEditModal(user)"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    aria-label="Modifier"
                  >
                    ✏️
                  </button>
                  <!-- Supprimer -->
                  <button
                    @click="confirmDelete(user.id)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="!loading" class="text-center py-10 text-gray-500 dark:text-gray-400">
      Aucun utilisateur trouvé.
    </div>

    <!-- Modal d'édition -->
    <div v-if="editModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Modifier le rôle</h3>
        <div class="mb-4">
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Utilisateur</label>
          <p class="font-medium">{{ editingUser?.name }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Rôle</label>
          <select
            v-model="editingRole"
            class="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </div>
        <div class="flex justify-end gap-2">
          <button @click="closeEditModal" class="px-4 py-2 text-gray-600 dark:text-gray-300">Annuler</button>
          <button @click="saveRole" class="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600">Enregistrer</button>
        </div>
      </div>
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
const successMessage = ref<string | null>(null)

// Modal
const editModalOpen = ref(false)
const editingUser = ref<UserRecord | null>(null)
const editingRole = ref('User')

const authStore = useAuthStore()

onMounted(async () => {
  await loadUsers()
})

async function loadUsers() {
  loading.value = true
  errorMessage.value = null
  try {
    const data = await authStore.fetchAllUsers()
    users.value = Array.isArray(data) ? data : []
  } catch (err: any) {
    errorMessage.value = err?.message ?? 'Erreur lors du chargement des utilisateurs.'
  } finally {
    loading.value = false
  }
}

function openEditModal(user: UserRecord) {
  editingUser.value = user
  editingRole.value = user.role || 'User'
  editModalOpen.value = true
}

function closeEditModal() {
  editModalOpen.value = false
  editingUser.value = null
}

async function saveRole() {
  if (!editingUser.value) return

  try {
    await authStore.updateUserRole(editingUser.value.id, editingRole.value)
    successMessage.value = 'Rôle mis à jour avec succès.'
    await loadUsers() // Recharger la liste
    closeEditModal()
    setTimeout(() => (successMessage.value = null), 3000)
  } catch (err: any) {
    errorMessage.value = err?.message ?? 'Erreur lors de la mise à jour.'
  }
}

function confirmDelete(userId: number) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    deleteUser(userId)
  }
}

async function deleteUser(userId: number) {
  try {
    await authStore.deleteUser(userId)
    successMessage.value = 'Utilisateur supprimé.'
    await loadUsers()
    setTimeout(() => (successMessage.value = null), 3000)
  } catch (err: any) {
    errorMessage.value = err?.message ?? 'Erreur lors de la suppression.'
  }
}
</script>
