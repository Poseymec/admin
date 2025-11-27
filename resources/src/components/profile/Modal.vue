<!-- Modal.vue -->
<template>
  <div
    class="fixed inset-0 z-99999 flex items-center justify-center overflow-y-auto"
    @click="$emit('close')"
    @keydown.esc="$emit('close')"
    tabindex="-1"
  >
    <div
      class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
      aria-hidden="true"
    ></div>
    <div @click.stop> <!-- Empêche la fermeture au clic sur le contenu -->
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.classList.add('overflow-hidden')
})

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden')
})
</script>