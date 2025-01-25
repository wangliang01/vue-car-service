<script setup lang="ts">
import { NCard, NCollapse, NCollapseItem, NForm, NFormItemGi, NInput, NSelect, NSpace, NButton, NGrid } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import type { SelectOption } from 'naive-ui';

const { t } = useI18n();

const props = defineProps<{
  searchModel: Api.RepairItem.SearchParams;
}>();

const emits = defineEmits(['search', 'reset']);

const statusOptions: SelectOption[] = [
  { label: t('common.status.enable'), value: 'true' },
  { label: t('common.status.disable'), value: 'false' }
];

function handleStatusChange(value: string | undefined) {
  if (value === undefined) {
    props.searchModel.isActive = undefined;
  } else {
    props.searchModel.isActive = value === 'true';
  }
}
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
            <NFormItemGi :span="6" :label="t('repairItem.name')" path="name">
              <NInput v-model:value="searchModel.name" :placeholder="t('common.keywordSearch')" clearable />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('repairItem.status')" path="isActive">
              <NSelect
                :value="searchModel.isActive?.toString()"
                :options="statusOptions"
                :placeholder="t('common.select')"
                clearable
                @update:value="handleStatusChange"
              />
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
