<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NCollapse, NCollapseItem, NForm, NGrid, NFormItemGi, NInput, NSelect, NSpace, NButton, NInputNumber } from 'naive-ui';

defineOptions({ name: 'InventorySearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();
const { t } = useI18n();
const loading = ref(false);

const model = defineModel<{
  code?: string;
  name?: string;
  category?: string;
  supplier?: string;
  minQuantity?: number;
  maxQuantity?: number;
  minPrice?: number;
  maxPrice?: number;
}>('model', {
  default: () => ({
    code: '',
    name: '',
    category: '',
    supplier: '',
    minQuantity: undefined,
    maxQuantity: undefined,
    minPrice: undefined,
    maxPrice: undefined
  })
});

// 搜索
async function handleSearch() {
  loading.value = true;
  try {
    console.log('search', model.value);
    emit('search');
  } finally {
    loading.value = false;
  }
}

// 重置
function handleReset() {
  model.value = {
    code: '',
    name: '',
    category: '',
    supplier: '',
    minQuantity: undefined,
    maxQuantity: undefined,
    minPrice: undefined,
    maxPrice: undefined
  };
  emit('reset');
}
</script>

<template>
  <NCard :bordered="false" size="small">
    <NCollapse :default-expanded-names="['1']">
      <NCollapseItem name="1">
        <template #header>
          <NSpace align="center">
            <span>{{ t('common.search') }}</span>
          </NSpace>
        </template>

        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid :cols="24" :x-gap="24">
            <NFormItemGi :span="6" :label="t('inventory.code')">
              <NInput
                v-model:value="model.code"
                :placeholder="t('inventory.codePlaceholder')"
                @keyup.enter="handleSearch"
                clearable
              />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('inventory.name')">
              <NInput
                v-model:value="model.name"
                :placeholder="t('inventory.namePlaceholder')"
                @keyup.enter="handleSearch"
                clearable
              />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('inventory.category')">
              <NInput
                v-model:value="model.category"
                :placeholder="t('inventory.categoryPlaceholder')"
                @keyup.enter="handleSearch"
                clearable
              />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('inventory.supplier')">
              <NInput
                v-model:value="model.supplier"
                :placeholder="t('inventory.supplierPlaceholder')"
                @keyup.enter="handleSearch"
                clearable
              />
            </NFormItemGi>

            <NFormItemGi :span="24">
              <NSpace class="w-full" justify="end">
                <NButton :loading="loading" @click="handleReset">
                  <template #icon>
                    <div class="i-material-symbols:refresh" />
                  </template>
                  {{ t('common.reset') }}
                </NButton>
                <NButton
                  type="primary"
                  :loading="loading"
                  @click="handleSearch"
                >
                  <template #icon>
                    <div class="i-material-symbols:search" />
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

<style scoped>
.search-wrapper {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
}

/* 使用CSS变量优化主题适配 */
:root {
  --search-wrapper-bg: #fff;
  --search-wrapper-shadow: rgba(0, 0, 0, 0.06);
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  :root {
    --search-wrapper-bg: #18181c;
    --search-wrapper-shadow: rgba(0, 0, 0, 0.12);
  }
}
</style>

<script lang="ts">
export default {
  name: 'InventorySearch'
};
</script>
