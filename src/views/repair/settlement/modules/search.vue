<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NCollapse, NCollapseItem, NForm, NFormItem, NInput, NSelect, NSpace, NButton, NGrid, NGridItem } from 'naive-ui';

const { t } = useI18n();
const loading = ref(false);

const model = defineModel<{
  current: number;
  size: number;
  settlementNo?: string;
  repairOrderNo?: string;
}>('model');

const statusOptions = [
  { label: t('settlement.status.unpaid'), value: 'unpaid' },
  { label: t('settlement.status.paid'), value: 'paid' },
  { label: t('settlement.status.refunded'), value: 'refunded' }
];

const paymentMethodOptions = [
  { label: t('settlement.paymentMethods.cash'), value: 'cash' },
  { label: t('settlement.paymentMethods.wechat'), value: 'wechat' },
  { label: t('settlement.paymentMethods.alipay'), value: 'alipay' },
  { label: t('settlement.paymentMethods.card'), value: 'card' }
];

const emit = defineEmits(['search', 'reset']);

function handleSearch() {
  emit('search');
}

function handleReset() {
  model.value = {
    current: 1,
    size: 10,
    settlementNo: null,
    repairOrderNo: null
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

        <NForm :model="model" label-placement="left" :label-width="100">
          <NGrid :cols="24" :x-gap="24" :y-gap="16">
            <NGridItem :span="6">
              <NFormItem :label="t('settlement.settlementNo')">
                <NInput
                  v-model:value="model.settlementNo"
                  @keyup.enter="handleSearch"
                  clearable
                />
              </NFormItem>
            </NGridItem>
            <NGridItem :span="6">
              <NFormItem :label="t('settlement.repairOrderNo')">
                <NInput
                  v-model:value="model.repairOrderNo"
                  clearable
                  @keyup.enter="handleSearch"
                />
              </NFormItem>
            </NGridItem>


            <NGridItem :span="12">
              <NSpace class="w-full" justify="end">
                <NButton @click="handleReset">
                  <template #icon>
                    <div class="i-material-symbols:refresh" />
                  </template>
                  {{ t('common.reset') }}
                </NButton>
                <NButton type="primary" :loading="loading" @click="handleSearch">
                  <template #icon>
                    <div class="i-material-symbols:search" />
                  </template>
                  {{ t('common.search') }}
                </NButton>
              </NSpace>
            </NGridItem>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}

.w-full {
  width: 100%;
}
</style>
