<template>
  <!-- ⏳ Rien tant qu’on n’est pas prêt -->
  <div v-if="!ready" class="h-11 w-11" />

  <!-- ✅ Connecté : on affiche le VRAI profil -->
  <div v-else class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span
        class="flex items-center justify-center mr-3 overflow-hidden rounded-full h-11 w-11 bg-brand-500 text-white font-semibold"
      >
        {{ userInitial }}
      </span>

      <span class="block mr-1 font-medium text-theme-sm">{{ user.name }}</span>

      <ChevronDownIcon
        :class="{ 'rotate-180': dropdownOpen }"
        class="h-5 w-5"
      />
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
        <UserCircleIcon class="h-5 w-5" />
        Profile
      </router-link>

      <button
        @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon class="h-5 w-5" />
        Sign out
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronDownIcon,
  LogoutIcon,
  UserCircleIcon
} from '@/icons'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

/* ---------- réactifs ---------- */
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const ready = ref(false) // true quand on a le vrai user

const authStore = useAuthStore()

/* ---------- données ---------- */
const user = computed(() => authStore.user!) // on garantit qu’il est là
const userInitial = computed(() => user.value.name.charAt(0).toUpperCase())

/* ---------- cycle de vie ---------- */
onMounted(async () => {
  // on attend d’avoir le user avant d’afficher quoi que ce soit
  if (!authStore.user) await authStore.fetchUser()
  ready.value = true
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

/* ---------- méthodes ---------- */
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}
const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = async () => {
  // on vide l’UI immédiatement
  authStore.user = null
  authStore.isAuthenticated = false
  closeDropdown()

  try {
    await axios.post('/api/auth/logout')
  } catch {
    // on ignore l’erreur éventuelle
  } finally {
    window.location.href = '/signin'
  }
}

const handleClickOutside = (e: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    closeDropdown()
  }
}
</script>
