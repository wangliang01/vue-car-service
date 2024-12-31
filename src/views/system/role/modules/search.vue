<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NCollapse, NCollapseItem, NForm, NGrid, NFormItemGi, NInput, NSelect, NSpace, NButton } from 'naive-ui';

defineOptions({ name: 'RoleSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();
const { t } = useI18n();
const loading = ref(false);

const model = defineModel<{
  name?: string;
  code?: string;
  status?: string;
}>('model', { 
  default: () => ({
    name: '',
    code: '',
    status: undefined
  })
});

// 状态选项
const statusOptions = [
  { label: t('common.status.enable'), value: 'enable' },
  { label: t('common.status.disable'), value: 'disable' }
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
    name: '',
    code: '',
    status: undefined
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
        
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid :cols="24" :x-gap="24">
            <NFormItemGi :span="6" :label="t('system.role.name')">
              <NInput 
                v-model:value="model.name" 
                :placeholder="t('system.role.namePlaceholder')"
              />
            </NFormItemGi>
            
            <NFormItemGi :span="6" :label="t('system.role.code')">
              <NInput 
                v-model:value="model.code" 
                :placeholder="t('system.role.codePlaceholder')"
              />
            </NFormItemGi>
            
            <NFormItemGi :span="6" :label="t('system.role.status')">
              <NSelect
                v-model:value="model.status"
                :options="statusOptions"
                :placeholder="t('system.role.statusPlaceholder')"
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