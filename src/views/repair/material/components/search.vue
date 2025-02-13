<script setup lang="ts">
import { nextTick } from 'vue';
import { NCard, NForm, NFormItem, NInput, NSelect, NSpace, NButton } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();


const searchModel = defineModel<Api.Material.SearchParams>('searchModel', { required: true });

const emits = defineEmits(['search', 'reset']);

const categoryOptions = [
  { label: t('material.categoryTypes.parts'), value: '配件' },
  { label: t('material.categoryTypes.oil'), value: '油品' },
  { label: t('material.categoryTypes.consumables'), value: '耗材' }
];

const statusOptions = [
  { label: t('common.status.enable'), value: true },
  { label: t('common.status.disable'), value: false }
];

const handleSelectChange = () => {
  nextTick(() => {
    emits('search');
  });
};
</script>

<template>
  <NCard :bordered="false" class="mb-4">
    <NCollapse :default-expanded-names="['0']">
      <NCollapseItem name="0">
        <template #header>
          <div class="flex-y-center">
            <span>{{ t('common.search') }}</span>
          </div>
        </template>
        <NForm ref="formRef" inline :model="searchModel" label-placement="left" label-width="auto"
          require-mark-placement="right-hanging" class="grid grid-cols-4 gap-4">
          <NGrid :cols="24" :x-gap="24">

            <NFormItemGi :span="6" :label="t('material.name')" path="name">
              <NInput v-model:value="searchModel.name" :placeholder="t('common.keywordSearch')" clearable
                @keyup.enter="emits('search')" />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('material.code')" path="code">
                <NInput v-model:value="searchModel.code" :placeholder="t('common.keywordSearch')" clearable
                @keyup.enter="emits('search')" />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('material.categoryLabel')" path="category">
              <NSelect v-model:value="searchModel.category" :options="categoryOptions" :placeholder="t('common.select')"
                clearable @change="handleSelectChange" />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('material.status')" path="status">
              <NSelect v-model:value="searchModel.isActive as any" :options="statusOptions as any" :placeholder="t('common.select')"
                clearable @change="handleSelectChange" />
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
