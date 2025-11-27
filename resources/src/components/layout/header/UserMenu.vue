<template>
  <div v-if="isLoggingOut" class="h-11 w-11 flex items-center justify-center">
    <div class="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
  <div v-else class="relative" ref="dropdownRef">
    <!-- Bouton principal -->
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <!-- Avatar avec première lettre du nom -->
      <span
        class="flex items-center justify-center mr-3 overflow-hidden rounded-full h-11 w-11 bg-brand-500 text-white font-semibold"
      >
        {{ userInitial }}
      </span>

      <span class="block mr-1 font-medium text-theme-sm">{{ userName }}</span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" class="h-5 w-5" />
    </button>

    <!-- Dropdown -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 z-10 mt-[17px] w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <router-link
        to="/profile"
        class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        @click="closeDropdown"
      >
        <UserCircleIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 h-5 w-5"
        />
        Profile
      </router-link>

      <button
        @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 h-5 w-5"
        />
        Sign out
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon, LogoutIcon, UserCircleIcon } from '@/icons'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const isLoggingOut = ref(false)
const authStore = useAuthStore()

const userName = computed(() => {
  return authStore.user?.name || 'User'
})

const userInitial = computed(() => {
  return userName.value.charAt(0).toUpperCase()
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = async () => {
  isLoggingOut.value = true

  // ✅ Effet immédiat : vide l'UI utilisateur
  authStore.user = null
  authStore.isAuthenticated = false

  closeDropdown()

  try {
    // Appel optionnel à l'API de déconnexion
    await axios.post('/api/auth/logout')
  } catch (err) {
    // On ignore les erreurs : l'utilisateur est déjà déconnecté visuellement
    console.warn('Logout API call failed, but UI is cleared.')
  } finally {
    // ✅ Redirection propre vers la page de login
    window.location.href = '/signin'
  }
}

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>