<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NCollapse, NCollapseItem, NForm, NGrid, NFormItemGi, NInput, NSpace, NButton, NSelect } from 'naive-ui';

defineOptions({ name: 'TechnicianSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();
const { t } = useI18n();
const loading = ref(false);

const model = defineModel<{
  name?: string;
  phone?: string;
  email?: string;
  level?: string;
  status?: string;
}>('model', { 
  default: () => ({
    name: '',
    phone: '',
    email: '',
    level: '',
    status: ''
  })
});

// 技师等级选项
const levelOptions = [
  { label: '初级技师', value: '初级技师' },
  { label: '中级技师', value: '中级技师' },
  { label: '高级技师', value: '高级技师' },
  { label: '资深技师', value: '资深技师' }
];

// 状态选项
const statusOptions = [
  { label: t('system.technician.statusActive'), value: 'active' },
  { label: t('system.technician.statusOnLeave'), value: 'onLeave' }
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
    phone: '',
    email: '',
    level: '',
    status: ''
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
            <NFormItemGi :span="6" :label="t('system.technician.name')">
              <NInput v-model:value="model.name" clearable
              :placeholder="t('system.technician.namePlaceholder')" />
            </NFormItemGi>
            
            <NFormItemGi :span="6" :label="t('system.technician.phone')">
              <NInput v-model:value="model.phone" clearable
              :placeholder="t('system.technician.phonePlaceholder')" />
            </NFormItemGi>
            
            <NFormItemGi :span="6" :label="t('system.technician.email')">
              <NInput v-model:value="model.email" clearable
              :placeholder="t('system.technician.emailPlaceholder')" />
            </NFormItemGi>
            
            <NFormItemGi :span="6" :label="t('system.technician.level')">
              <NSelect
                v-model:value="model.level"
                :options="levelOptions"
                clearable
                :placeholder="t('system.technician.levelPlaceholder')"
              />
            </NFormItemGi>

            <NFormItemGi :span="6" :label="t('system.technician.status')">
              <NSelect
                v-model:value="model.status"
                :options="statusOptions"
                clearable
                :placeholder="t('system.technician.statusPlaceholder')"
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