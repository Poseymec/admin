<template>
  <div class="waiting p-8 text-center">
    <h1 class="text-2xl font-bold mb-4">Compte en attente de validation</h1>
    <p class="mb-6">Merci de patienter jusqu’à ce qu’un administrateur active votre compte.</p>
    <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded">
      Se déconnecter
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout().then(() => {
    router.push({ name: 'Signin' });
  });
}
</script>
