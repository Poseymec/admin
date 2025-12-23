
<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="t('user.management.title0')" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard :title="t('user.management.title1')">
        <UserTable />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import UserTable from "@/components/tables/UserTable.vue";
const { t } = useI18n();
//const currentPageTitle = ref( t('user.management.title0') );
</script>
