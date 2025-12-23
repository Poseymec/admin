
<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="t('product.category_list.title')"/>
    <div class="space-y-5 sm:space-y-6">
    <ComponentCard :title="t('product.category_list.title0')">
       <CategoryListTable/>
    </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import CategoryListTable from "@/components/tables/product/CategoryListTable.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
//const currentPageTitle = ref("Liste des catégories de produits");
</script>
