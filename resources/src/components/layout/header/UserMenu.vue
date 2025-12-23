<template>
  <!-- ⏳ chargement -->
  <div v-if="!ready" class="h-11 w-11 flex items-center justify-center">
    <div class="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
  </div>

  <!-- ✅ connecté -->
  <div v-else-if="user" class="relative" ref="dropdownRef">
    <button class="flex items-center text-gray-700 dark:text-gray-400" @click.prevent="toggleDropdown">
      <span class="flex items-center justify-center mr-3 overflow-hidden rounded-full h-11 w-11 bg-brand-500 text-white font-semibold">
        {{ userInitial }}
      </span>
      <span class="block mr-1 font-medium text-theme-sm">{{ user.name }}</span>
      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" class="h-5 w-5" />
    </button>

    <div v-if="dropdownOpen" class="absolute right-0 z-10 mt-[17px] w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
      <router-link to="/profile" class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300" @click="closeDropdown">
        <UserCircleIcon class="h-5 w-5" />   {{ t('user.user_menu.profile') }}
      </router-link>

      <button @click="signOut" class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
        <LogoutIcon class="h-5 w-5" /> {{ t('user.user_menu.deconnect') }}
      </button>
    </div>
  </div>

  <!-- ❌ non connecté -->
  <div v-else class="flex items-center gap-2">
    <router-link to="/signin" class="btn-primary">Se connecter</router-link>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon, LogoutIcon, UserCircleIcon } from '@/icons'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'


const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
    const ready = ref(false)

    const { t } = useI18n()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const userInitial = computed(() => user.value?.name.charAt(0).toUpperCase() ?? '')

onMounted(async () => {
  if (!authStore.user) await authStore.fetchUser()
  ready.value = true
})
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

const toggleDropdown = () => { dropdownOpen.value = !dropdownOpen.value }
const closeDropdown = () => { dropdownOpen.value = false }

const signOut = async () => {
  closeDropdown()
  await authStore.logout()
  window.location.replace('/signin')
}

const handleClickOutside = (e: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) closeDropdown()
}
</script>
