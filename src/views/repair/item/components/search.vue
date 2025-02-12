<script setup lang="ts">
import { NCard, NCollapse, NCollapseItem, NForm, NFormItemGi, NInput, NSelect, NSpace, NButton, NGrid } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import type { SelectOption } from 'naive-ui';
import { useNaiveForm } from '@/hooks/common/form';

const { t } = useI18n();
const { formRef, validate } = useNaiveForm();

const searchModel = defineModel('modelValue', {
  type: Object, default: () => ({
    name: '',
    isActive: undefined,
    current: 1,
    size: 10
  })
});

const emits = defineEmits(['search', 'reset']);

const statusOptions: SelectOption[] = [
  { label: t('common.status.enable'), value: 'true' },
  { label: t('common.status.disable'), value: 'false' }
];

function handleStatusChange(value: string | undefined) {
  if (value === 'true') {
    searchModel.value.isActive = true;
  } else if (value === 'false') {
    searchModel.value.isActive = false;
  } else {
    searchModel.value.isActive = undefined;
  }
}

async function handleSearch() {
  emits('search');
}

function handleReset() {
  emits('reset');
}
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
            <NFormItemGi :span="6" :label="t('repairItem.name')" path="name">
              <NInput v-model:value="searchModel.name" :placeholder="t('common.keywordSearch')" clearable
                @keyup.enter="handleSearch" />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('repairItem.isActive')" path="isActive">
              <NSelect :value="searchModel.isActive?.toString()" :options="statusOptions"
                :placeholder="t('common.select')" clearable @update:value="handleStatusChange" />
            </NFormItemGi>
            <NFormItemGi :span="12" class="flex justify-end">
              <NSpace>
                <NButton @click="handleReset">
                  <template #icon>
                    <div class="i-material-symbols:refresh text-16px" />
                  </template>
                  {{ t('common.reset') }}
                </NButton>
                <NButton type="primary" @click="handleSearch">
                  <template #icon>
                    <div class="i-material-symbols:search text-16px" />
                  </template>
                  {{ t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>

      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>
