<!-- src/components/ui/PasswordField.vue -->
<template>
  <div>
    <label :for="id" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
      {{ label }}<span class="text-error-500" v-if="required">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        v-model="model"
        :type="showPasswordLocal ? 'text' : 'password'"
        :placeholder="placeholder"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      />
      <button
        v-if="showToggle"
        type="button"
        @click="togglePassword"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        aria-label="Afficher le mot de passe"
      >
        <svg v-if="showPasswordLocal" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  label: string
  id: string
  placeholder?: string
  showToggle?: boolean
  required?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:showPassword', value: boolean): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})

const showPasswordLocal = computed({
  get: () => (props.showToggle ? (props as any).showPassword : false),
  set: (value: boolean) => {
    if (props.showToggle) {
      emit('update:showPassword', value)
    }
  },
})

const togglePassword = () => {
  if (props.showToggle) {
    showPasswordLocal.value = !showPasswordLocal.value
  }
}

</script>
<script lang="ts">
export default {}
</script>
