<template>
  <div class="p-4 md:p-6">
    <!-- Messages -->
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
        {{ t('product.category_list.add_button') }}
      </button>
    </div>

    <!-- Tableau -->
    <div class="overflow-hidden rounded-lg border dark:border-gray-700">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ t('product.category_list.table.headers.name_en') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ t('product.category_list.table.headers.name_fr') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ t('product.category_list.table.headers.slug') }}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ t('product.category_list.table.headers.actions') }}
            </th>
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
                :title="t('sidebar.badges.edit')"
              >
                ✏️
              </button>
              <button
                @click="openDeleteModal(category)"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                :title="t('sidebar.badges.delete')"
              >
                🗑️
              </button>
            </td>
          </tr>
          <tr v-if="store.categories.length === 0 && !store.loading">
            <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              {{ t('product.category_list.table.no_data') }}
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="store.loading" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        {{ t('product.category_list.table.loading') }}
      </div>
    </div>

    <!-- Modal Formulaire -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{
              editingCategory
                ? t('product.category_list.form.title_edit')
                : t('product.category_list.form.title_add')
            }}
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
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {{ t('product.category_list.delete_modal.title') }}
        </h3>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          {{
            t('product.category_list.delete_modal.description', {
              name: deleteModal.category.name?.fr || deleteModal.category.name?.en || '—'
            })
          }}
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="closeDeleteModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {{ t('product.category_list.delete_modal.cancel') }}
          </button>
          <button
            @click="confirmDelete"
            :disabled="deleting"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-70"
          >
            {{
              deleting
                ? t('product.category_list.delete_modal.confirm_loading')
                : t('product.category_list.delete_modal.confirm')
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProductCategoryStore, ProductCategory } from '@/stores/CategoryProduct'
import CategoryProductForm from '../../forms/product/CategoryProductForm.vue'

type FormDataWithOptionalId = {
  id?: number
  name: { en: string; fr: string }
  slug: string
}

export default defineComponent({
  name: 'CategoryListTable',
  components: { CategoryProductForm },
  setup() {
    const { t } = useI18n()
    const store = useProductCategoryStore()
    const showForm = ref(false)
    const editingCategory = ref<FormDataWithOptionalId | undefined>(undefined)
    const successMessage = ref<string | null>(null)
    const deleteModal = ref<{ category: ProductCategory | null }>({ category: null })
    const deleting = ref(false)

    const openForm = () => {
      editingCategory.value = undefined
      showForm.value = true
    }

    const editCategory = (category: ProductCategory) => {
      editingCategory.value = {
        id: category.id,
        name: { ...category.name },
        slug: category.slug,
      }
      showForm.value = true
    }

    const closeForm = () => {
      showForm.value = false
      editingCategory.value = undefined
      store.clearError()
    }

    const onCategorySaved = () => {
      successMessage.value = editingCategory.value
        ? t('product.category_list.messages.success.updated')
        : t('product.category_list.messages.success.created')
      closeForm()
      store.fetchCategories()
      setTimeout(() => (successMessage.value = null), 3000)
    }

    const openDeleteModal = (category: ProductCategory) => {
      deleteModal.value.category = category
    }

    const closeDeleteModal = () => {
      deleteModal.value.category = null
    }

    const confirmDelete = async () => {
      const id = deleteModal.value.category?.id
      if (!id) return

      deleting.value = true
      try {
        await store.deleteCategory(id)
        successMessage.value = t('product.category_list.messages.success.deleted')
        closeDeleteModal()
        store.fetchCategories()
        setTimeout(() => (successMessage.value = null), 3000)
      } finally {
        deleting.value = false
      }
    }

    onMounted(() => {
      store.fetchCategories()
    })

    return {
      t,
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
    }
  },
})
</script>
