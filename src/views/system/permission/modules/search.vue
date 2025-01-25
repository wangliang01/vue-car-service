<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { NCard, NCollapse, NCollapseItem, NForm, NGrid, NFormItemGi, NInput, NSelect, NSpace, NButton } from 'naive-ui';

defineOptions({ name: 'PermissionSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits(['reset', 'search']);
const { t } = useI18n();
const loading = ref(false);

const { formRef } = useNaiveForm();

const model = ref<{
  name?: string;
  code?: string;
  type?: 'menu' | 'operation';
}>({
  name: '',
  code: '',
  type: undefined
});

// 权限类型选项
const typeOptions = [
  { label: t('system.permission.menu'), value: 'menu' },
  { label: t('system.permission.operation'), value: 'operation' }
];

// 搜索
async function handleSearch() {
  loading.value = true;
  try {
    emit('search', model.value);
  } finally {
    loading.value = false;
  }
}

// 重置
function handleReset() {
  model.value = {
    name: '',
    code: '',
    type: undefined
  };

  emit('reset');
}
</script>

<template>
  <NCard class="search-wrapper">
    <NCollapse :default-expanded-names="['1']">
      <NCollapseItem name="1">
        <template #header>
          <NSpace align="center">
            <span>{{ t('common.search') }}</span>
          </NSpace>
        </template>

        <NForm ref="formRef" :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi :span="6" :label="t('system.permission.name')">
              <NInput v-model:value="model.name" :placeholder="t('system.permission.nameSearch')" clearable @keyup.enter="handleSearch"/>
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('system.permission.code')">
              <NInput v-model:value="model.code" :placeholder="t('system.permission.codeSearch')" clearable @keyup.enter="handleSearch"/>
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('system.permission.type')">
              <NSelect
                v-model:value="model.type"
                :options="typeOptions"
                :placeholder="t('system.permission.typeSearch')"
                clearable
                @update:value="handleSearch"
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
