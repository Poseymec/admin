<template>
  <form @submit.prevent="submit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Message d'erreur global -->
    <div v-if="errorMessage" class="md:col-span-2 mb-4">
      <div class="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-4 py-3 rounded-md text-sm font-medium">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Anglais -->
    <div class="border rounded-lg p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 class="font-bold text-gray-700 dark:text-gray-200 mb-3">🇬🇧 Anglais</h3>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Nom (EN)
        </label>
        <input
          v-model="form.name.en"
          type="text"
          class="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600"
          placeholder="Ex: Electronics"
          required
        />
      </div>
    </div>

    <!-- Français -->
    <div class="border rounded-lg p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 class="font-bold text-gray-700 dark:text-gray-200 mb-3">🇫🇷 Français</h3>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Nom (FR)
        </label>
        <input
          v-model="form.name.fr"
          type="text"
          class="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600"
          placeholder="Ex : Électronique"
          required
        />
      </div>
    </div>

    <!-- Slug (affiché mais non modifiable) -->
    <div class="md:col-span-2" v-if="isEditing">
      <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
        Slug (généré automatiquement)
      </label>
      <input
        :value="form.slug"
        type="text"
        class="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        readonly
        disabled
      />
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Le slug ne peut pas être modifié après création.
      </p>
    </div>

    <!-- Bouton -->
    <div class="md:col-span-2 flex justify-end">
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition"
        :disabled="loading"
      >
        {{ loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer la catégorie' }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from 'vue';
import { useProductCategoryStore } from '@/stores/CategoryProduct';

interface CategoryFormData {
  name: {
    en: string;
    fr: string;
  };
  slug: string;
}

export default defineComponent({
  name: 'CategoryProductForm',
  props: {
    initialData: {
      type: Object as PropType<CategoryFormData & { id?: number }>,
      default: undefined,
    },
  },
  emits: ['saved'],
  setup(props, { emit }) {
    const store = useProductCategoryStore();

    const form = ref<CategoryFormData>({
      name: { en: '', fr: '' },
      slug: '',
    });

    const loading = ref(false);
    const errorMessage = ref<string | null>(null);
    const isEditing = !!props.initialData?.id;

    // Charger les données initiales si édition
    onMounted(() => {
      if (props.initialData) {
        form.value = {
          name: { ...props.initialData.name },
          slug: props.initialData.slug || '',
        };
      }
    });

    const submit = async () => {
      errorMessage.value = null;
      loading.value = true;

      try {
        // 🔧 FIX : Utiliser les méthodes du store au lieu d'axios directement
        if (isEditing && props.initialData?.id) {
          // Édition : envoyer uniquement les noms
          await store.updateCategory(props.initialData.id, {
            name: form.value.name
          });
        } else {
          // Création : envoyer uniquement les noms (slug généré côté serveur)
          await store.createCategory({
            name: form.value.name
          });
        }

        emit('saved');
      } catch (error: any) {
        console.error('Erreur API :', error);

        // L'erreur est déjà gérée par le store, on l'affiche ici aussi
        let msg = store.error || 'Une erreur inattendue est survenue. Veuillez réessayer.';
        errorMessage.value = msg;
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      errorMessage,
      isEditing,
      submit,
    };
  },
});
</script>
