<template>
  <div class="relative">
    <!-- Bouton déclencheur -->
    <button
      class="flex items-center justify-center w-10 h-10 text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      @click="isOpen = !isOpen"
      aria-label="Changer la langue"
    >
      <span class="text-sm font-medium uppercase">{{ currentLocaleFlag }}</span>
    </button>

    <!-- Menu déroulant -->
    <div
      v-if="isOpen"
      class="absolute right-0 z-10 mt-2 w-32 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800"
      @click.outside="isOpen = false"
    >
      <ul class="py-1">
        <li v-for="lang in availableLocales" :key="lang.code">
          <button
            @click="setLocale(lang.code)"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            :class="{ 'font-semibold': currentLocale === lang.code }"
          >
            {{ lang.label }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

// 1. Gestion de l'état du menu
const isOpen = ref(false);

// 2. i18n
const { locale } = useI18n();

// 3. Langues disponibles
interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

const availableLocales: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  // Ajoute d'autres langues si besoin
];

// 4. Locale actuelle
const currentLocale = computed(() => locale.value);

// 5. Drapeau de la locale actuelle
const currentLocaleFlag = computed(() => {
  const lang = availableLocales.find(l => l.code === currentLocale.value);
  return lang ? lang.flag : '🌐';
});

// 6. Changer la langue
const setLocale = (code: string) => {
  locale.value = code;
  localStorage.setItem('locale', code);
  isOpen.value = false;
};

// 7. Fermer le menu si on clique ailleurs
onMounted(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.relative')) {
      isOpen.value = false;
    }
  };
  document.addEventListener('click', handleClickOutside);
  // Nettoyage facultatif (pas critique ici)
});
</script>
