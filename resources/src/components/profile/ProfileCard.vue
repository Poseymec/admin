<template>
  <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
    <!-- En-tête : avatar + bouton déconnexion -->
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
            {{ user.role || 'Utilisateur' }}
          </p>
        </div>
      </div>

      <button
        @click="showLogoutModal = true"
        class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/30"
      >
        Se déconnecter
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
          Informations personnelles
        </button>
        <button
          @click="activeTab = 'password'"
          :class="{
            'border-brand-500 text-brand-600 dark:text-brand-400': activeTab === 'password',
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300': activeTab !== 'password',
          }"
          class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
        >
          Changer le mot de passe
        </button>
      </nav>
    </div>

    <!-- Contenu -->
    <div class="mt-6">
      <!-- Informations -->
      <div v-if="activeTab === 'info'" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Nom</label>
            <p class="mt-1 text-gray-900 dark:text-white">{{ user.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
            <p class="mt-1 text-gray-900 dark:text-white">{{ user.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Rôle</label>
            <p class="mt-1 text-gray-900 dark:text-white">{{ user.role || 'Utilisateur' }}</p>
          </div>
        </div>
      </div>

      <!-- Changement de mot de passe -->
      <div v-if="activeTab === 'password'" class="max-w-md">
        <form @submit.prevent="handleChangePassword" class="space-y-4">
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
            class="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600 disabled:opacity-60 w-full"
          >
            {{ authStore.isLoading ? 'Mise à jour...' : 'Changer le mot de passe' }}
          </button>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal déconnexion -->
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
          <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Se déconnecter ?</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Voulez-vous vraiment vous déconnecter ?
          </p>
          <div class="mt-6 flex justify-center gap-3">
            <button
              @click="showLogoutModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            >
              Annuler
            </button>
            <button
              @click="confirmLogout"
              class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Modal from '@/components/profile/Modal.vue' // ✅ Assure-toi que le chemin est bon
import axios from 'axios'

const authStore = useAuthStore()
const activeTab = ref('info')
const showLogoutModal = ref(false)
const form = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const user = computed(() => authStore.user || {
  name: 'Utilisateur',
  email: 'non-connecte@example.com',
  role: null,
})

const userInitial = computed(() => user.value.name.charAt(0).toUpperCase())

const handleChangePassword = async () => {
  try {
    await authStore.changePassword(form)
    // Réinitialise le formulaire
    form.current_password = ''
    form.password = ''
    form.password_confirmation = ''
  } catch (err: any) {
    alert(err.message)
  }
}

const confirmLogout = async () => {
  authStore.user = null
  authStore.isAuthenticated = false
  try {
    await axios.post('/api/auth/logout')
  } catch (err) {
    console.warn('Logout API error (ignored)')
  } finally {
    window.location.href = '/signin'
  }
}
</script>