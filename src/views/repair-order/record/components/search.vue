<template>
  <NCard :bordered="false" class="mb-16px">
    <NCollapse>
      <NCollapseItem>
        <template #header>
          <div class="flex-y-center">
            <span>{{ t('common.search') }}</span>
          </div>
        </template>
        <NForm ref="formRef" :model="searchModel" label-placement="left">
          <NGrid :cols="24" :x-gap="24">
            <NFormItemGi :span="6" :label="t('menu.repairOrder.orderNo')" path="orderNo">
              <NInput v-model:value="searchModel.orderNo" :placeholder="t('menu.repairOrder.orderNoPlaceholder')" />
            </NFormItemGi>
            <NFormItemGi :span="6" :label="t('menu.customer.name')" path="customerName">
              <NInput v-model:value="searchModel.customerName" :placeholder="t('menu.repairOrder.customerNamePlaceholder')" />
            </NFormItemGi>
            <NFormItemGi :span="6" :label="t('menu.vehicle.licensePlate')" path="licensePlate">
              <NInput v-model:value="searchModel.licensePlate" :placeholder="t('menu.repairOrder.licensePlatePlaceholder')" />
            </NFormItemGi>
          </NGrid>
        </NForm>
        <div class="flex justify-end mt-16px">
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
        </div>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NCollapse, NCollapseItem, NForm, NGrid, NFormItemGi, NInput, NSelect, NSpace, NButton } from 'naive-ui';

defineOptions({ name: 'RepairOrderSearch' });

const props = defineProps<{
  searchModel: Api.RepairOrder.SearchParams;
}>();

const emit = defineEmits<{
  (e: 'reset'): void;
  (e: 'search'): void;
}>();

const { t } = useI18n();

const handleSearch = () => emit('search');
const handleReset = () => emit('reset');
</script>

<style scoped>
:deep(.n-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.n-button .n-button__icon) {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

:deep(.n-button .n-button__icon div) {
  width: 16px;
  height: 16px;
  display: inline-flex;
}

.mb-16px {
  margin-bottom: 16px;
}

.mt-16px {
  margin-top: 16px;
}

.text-16px {
  font-size: 16px;
}

.flex {
  display: flex;
}

.flex-y-center {
  align-items: center;
}

.justify-end {
  justify-content: flex-end;
}
</style>
