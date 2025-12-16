<template>
  <div class="p-4 md:p-6">
    <!-- Messages d'erreur / succès -->
    <div v-if="store.error" class="mb-4">
      <div class="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-4 py-3 rounded-md text-sm font-medium">
        {{ store.error }}
      </div>
    </div>
    <div v-if="successMessage" class="mb-4">
      <div class="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-4 py-3 rounded-md text-sm font-medium">
        {{ successMessage }}
      </div>
    </div>

    <!-- Bouton Ajouter -->
    <div class="mb-6 flex justify-end">
      <button
        @click="openForm"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition"
      >
        + Ajouter une catégorie
      </button>
    </div>

    <!-- Tableau -->
    <div class="overflow-hidden rounded-lg border dark:border-gray-700">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nom (EN)</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nom (FR)</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Slug</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          <tr v-for="category in store.categories" :key="category.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              {{ category.name?.en || '—' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
              {{ category.name?.fr || '—' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ category.slug || '—' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editCategory(category)"
                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                title="Modifier"
              >
                ✏️
              </button>
              <button
                @click="openDeleteModal(category)"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                title="Supprimer"
              >
                🗑️
              </button>
            </td>
          </tr>
          <tr v-if="store.categories.length === 0 && !store.loading">
            <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Aucune catégorie disponible.
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="store.loading" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Chargement...
      </div>
    </div>

    <!-- Modal Formulaire -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie' }}
          </h3>
          <button @click="closeForm" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl">&times;</button>
        </div>
        <div class="p-4">
          <CategoryProductForm
            :initial-data="editingCategory"
            @saved="onCategorySaved"
          />
        </div>
      </div>
    </div>

    <!-- Modal Suppression -->
    <div v-if="deleteModal.category" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Confirmer la suppression</h3>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Êtes-vous sûr de vouloir supprimer la catégorie
          <span class="font-bold">"{{ deleteModal.category.name?.fr }}"</span> ?
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="closeDeleteModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Annuler
          </button>
          <button
            @click="confirmDelete"
            :disabled="deleting"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-70"
          >
            {{ deleting ? 'Suppression...' : 'Supprimer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useProductCategoryStore, ProductCategory } from '@/stores/CategoryProduct';
import CategoryProductForm from '../../forms/product/CategoryProductForm.vue';

// Type exact attendu par CategoryProductForm
type FormDataWithOptionalId = {
  id?: number;
  name: { en: string; fr: string };
  slug: string;
};

export default defineComponent({
  name: 'CategoryListTable',
  components: { CategoryProductForm },
  setup() {
    const store = useProductCategoryStore();
    const showForm = ref(false);
    const editingCategory = ref<FormDataWithOptionalId | undefined>(undefined);
    const successMessage = ref<string | null>(null);
    const deleteModal = ref<{ category: ProductCategory | null }>({ category: null });
    const deleting = ref(false);

    const openForm = () => {
      editingCategory.value = undefined;
      showForm.value = true;
    };

    const editCategory = (category: ProductCategory) => {
      editingCategory.value = {
        id: category.id,
        name: { ...category.name },
        slug: category.slug,
      };
      showForm.value = true;
    };

    const closeForm = () => {
      showForm.value = false;
      editingCategory.value = undefined;
      store.clearError();
    };

    const onCategorySaved = () => {
      successMessage.value = editingCategory.value
        ? 'Catégorie mise à jour avec succès.'
        : 'Catégorie créée avec succès.';
      closeForm();
      store.fetchCategories();
      setTimeout(() => successMessage.value = null, 3000);
    };

    const openDeleteModal = (category: ProductCategory) => {
      deleteModal.value.category = category;
    };

    const closeDeleteModal = () => {
      deleteModal.value.category = null;
    };

    const confirmDelete = async () => {
      const id = deleteModal.value.category?.id;
      if (!id) return;

      deleting.value = true;
      try {
        await store.deleteCategory(id);
        successMessage.value = 'Catégorie supprimée avec succès.';
        closeDeleteModal();
        store.fetchCategories();
        setTimeout(() => successMessage.value = null, 3000);
      } catch (error) {
        // L’erreur est déjà dans `store.error`
      } finally {
        deleting.value = false;
      }
    };

    onMounted(() => {
      store.fetchCategories();
    });

    return {
      store,
      showForm,
      editingCategory,
      successMessage,
      deleteModal,
      deleting,
      openForm,
      editCategory,
      closeForm,
      onCategorySaved,
      openDeleteModal,
      closeDeleteModal,
      confirmDelete,
    };
  },
});
</script>
