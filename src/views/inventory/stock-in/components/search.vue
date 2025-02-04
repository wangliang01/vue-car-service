<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NCollapse, NCollapseItem, NForm, NGrid, NFormItemGi, NInput, NSelect, NDatePicker, NSpace, NButton } from 'naive-ui';

defineOptions({ name: 'StockInSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();
const { t } = useI18n();
const loading = ref(false);

const model = defineModel<{
  materialId?: string;
  supplier?: string;
  status?: string;
  startDate?: number | null;
  endDate?: number | null;
}>('model', {
  default: () => ({
    materialId: '',
    supplier: '',
    status: undefined,
    startDate: null,
    endDate: null
  })
});

// 状态选项
const statusOptions = [
  { label: t('inventory.stockIn.statusActive'), value: 'active' },
  { label: t('inventory.stockIn.statusInactive'), value: 'inactive' }
];

// 搜索
async function handleSearch() {
  loading.value = true;
  try {
    emit('search');
  } finally {
    loading.value = false;
  }
}

// 重置
function handleReset() {
  model.value = {
    materialId: '',
    supplier: '',
    status: undefined,
    startDate: null,
    endDate: null
  };
  emit('reset');
}
</script>

<template>
  <NCard class="mb-4">
    <NCollapse :default-expanded-names="['1']">
      <NCollapseItem name="1">
        <template #header>
          <NSpace align="center">
            <span>{{ t('common.search') }}</span>
          </NSpace>
        </template>

        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid :cols="24" :x-gap="24">
            <NFormItemGi :span="6" :label="t('inventory.stockIn.material')">
              <NInput v-model:value="model.materialId" clearable />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('inventory.stockIn.supplier')">
              <NInput v-model:value="model.supplier" clearable />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('inventory.stockIn.status')">
              <NSelect
                v-model:value="model.status"
                :options="statusOptions"
                clearable
              />
            </NFormItemGi>

            <NFormItemGi :span="6"  :label="t('inventory.stockIn.stockInDate')">
              <NSpace class="w-full stock-in-date">
                <NDatePicker
                  v-model:value="model.startDate"
                  class="flex-1"
                  type="daterange"
                  clearable
                />
              </NSpace>
            </NFormItemGi>

            <NFormItemGi :span="24">
              <NSpace justify="end" class="w-full">
                <NButton @click="handleReset">
                  {{ t('common.reset') }}
                </NButton>
                <NButton type="primary" :loading="loading" @click="handleSearch">
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
<style scoped>
:deep(.stock-in-date > div) {
  width: 100%;
}
</style>
