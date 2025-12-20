// stores/CategoryProduct.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'

// Interface représentant la structure exacte de l'API
export interface ProductCategory {
  id: number
  name: {
    en: string
    fr: string
  }
  slug: string
}

// 🔧 FIX : Slug est optionnel car généré automatiquement côté serveur
export interface ProductCategoryInput {
  name: {
    en: string
    fr: string
  }
  slug?: string
}

interface ApiErrorResponse {
  message?: string
  [key: string]: any
}

export const useProductCategoryStore = defineStore('productCategory', () => {
  const categories = ref<ProductCategory[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get<ProductCategory[]>('/api/auth/category-products')
      categories.value = response.data
    } catch (err) {
      handleError(err)
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (data: ProductCategoryInput) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post<ProductCategory>('/api/auth/category-products', data)
      categories.value.push(response.data)
      return response.data
    } catch (err) {
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id: number, data: ProductCategoryInput) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.put<ProductCategory>(
        `/api/auth/category-products/${id}`,
        data
      )

      const index = categories.value.findIndex(cat => cat.id === id)
      if (index !== -1) {
        categories.value[index] = response.data
      }
      return response.data
    } catch (err) {
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`/api/auth/category-products/${id}`)
      categories.value = categories.value.filter(cat => cat.id !== id)
    } catch (err) {
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const handleError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiErrorResponse>
      if (axiosError.response?.data?.message) {
        error.value = axiosError.response.data.message
      } else if (axiosError.response?.status === 422) {
        error.value = 'Le formulaire contient des erreurs. Veuillez vérifier les champs.'
      } else if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        error.value = 'Vous devez être connecté(e) avec les droits requis pour accéder à cette ressource.'
      } else {
        error.value = 'Une erreur est survenue. Veuillez réessayer plus tard.'
      }
    } else {
      error.value = 'Erreur inconnue.'
    }
    console.error('Category API error:', err)
  }

  const clearError = () => {
    error.value = null
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  }
})
