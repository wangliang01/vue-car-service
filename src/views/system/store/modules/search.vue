<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { NCard, NCollapse, NCollapseItem, NForm, NGrid, NFormItemGi, NInput, NSelect, NSpace, NButton } from 'naive-ui';

defineOptions({ name: 'StoreSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();
const { t } = useI18n();
const loading = ref(false);

const { formRef } = useNaiveForm();

const model = defineModel<Api.Store.SearchParams>('model', { required: true });

// 状态选项
const statusOptions = [
  { label: t('system.store.statusOptions.active'), value: 'active' },
  { label: t('system.store.statusOptions.inactive'), value: 'inactive' }
];

// 搜索
async function handleSearch() {
  try {
    loading.value = true;
    emit('search');
  } finally {
    loading.value = false;
  }
}

// 重置
function handleReset() {
  formRef.value?.restoreValidation();
  emit('reset');
}
</script>

<template>
  <NCard :bordered="false" size="small">
    <NCollapse :default-expanded-names="['1']">
      <NCollapseItem :title="t('common.search')"  name="1">
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi :span="6" :label="t('system.store.name')" path="name">
              <NInput
                v-model:value="model.name"
                :placeholder="t('system.store.nameSearch')"
                @keyup.enter="handleSearch"
                clearable
              />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('system.store.code')" path="code">
              <NInput
                v-model:value="model.code"
                :placeholder="t('system.store.codeSearch')"
                @keyup.enter="handleSearch"
                clearable
              />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('system.store.statusText')" path="status">
              <NSelect
                v-model:value="model.status"
                :options="statusOptions"
                :placeholder="t('system.store.statusSearch')"
                clearable
              />
            </NFormItemGi>

            <NFormItemGi :span="6">
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
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
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
