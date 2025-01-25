<script setup lang="ts">
import { NCard, NForm, NFormItem, NInput, NSelect, NSpace, NButton } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  searchModel: Api.Material.SearchParams;
}>();

const emits = defineEmits(['search', 'reset']);

const categoryOptions = [
  { label: t('material.categoryTypes.parts'), value: 'parts' },
  { label: t('material.categoryTypes.oil'), value: 'oil' },
  { label: t('material.categoryTypes.consumables'), value: 'consumables' }
];

const statusOptions = [
  { label: t('common.status.enable'), value: true },
  { label: t('common.status.disable'), value: false }
];
</script>

<template>
  <NCard :bordered="false" class="mb-4">
    <NCollapse>
      <NCollapseItem>
        <template #header>
          <div class="flex-y-center">
            <span>{{ t('common.search') }}</span>
          </div>
        </template>
        <NForm ref="formRef" inline :model="searchModel" label-placement="left" label-width="auto"
          require-mark-placement="right-hanging" class="grid grid-cols-4 gap-4">
          <NGrid :cols="24" :x-gap="24">

            <NFormItemGi :span="6" :label="t('material.name')" path="name">
              <NInput v-model:value="searchModel.name" :placeholder="t('common.keywordSearch')" clearable />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('material.code')" path="code">
              <NInput v-model:value="searchModel.code" :placeholder="t('common.keywordSearch')" clearable />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('material.categoryLabel')" path="category">
              <NSelect v-model:value="searchModel.category" :options="categoryOptions" :placeholder="t('common.select')"
                clearable />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('material.status')" path="status">
              <NSelect v-model:value="searchModel.isActive" :options="statusOptions" :placeholder="t('common.select')"
                clearable />
            </NFormItemGi>
          </NGrid>

        </NForm>
        <div class="flex justify-end mt-16px">
          <NSpace>
            <NButton @click="emits('reset')">
              <template #icon>
                <div class="i-material-symbols:refresh text-16px" />
              </template>
              {{ t('common.reset') }}
            </NButton>
            <NButton type="primary" @click="emits('search')">
              <template #icon>
                <div class="i-material-symbols:search text-16px" />
              </template>
              {{ t('common.search') }}
            </NButton>
          </NSpace>
        </div>
      </NCollapseItem>
    </NCollapse>

  </NCard>
</template>
