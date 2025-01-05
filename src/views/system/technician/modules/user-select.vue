<template>
  <NSelect
    v-model:value="selectedUserId"
    :options="userOptions"
    :loading="loading"
    filterable
    remote
    :placeholder="t('system.technician.selectUser')"
    @search="handleSearch"
    style="width: 100%"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { NSelect } from 'naive-ui';
import { searchUsers } from '@/service/api/user';
import type { UserInfo } from '@/service/api/user';

defineOptions({ name: 'UserSelect' });

const emit = defineEmits<{
  (e: 'select', user: UserInfo): void;
}>();

const { t } = useI18n();
const loading = ref(false);
const selectedUserId = ref('');
const userOptions = ref<{ label: string; value: string; user: UserInfo; }[]>([]);

// 搜索用户
async function handleSearch(query: string) {
  if (!query) return;
  
  loading.value = true;
  try {
    const { data } = await searchUsers({ keyword: query });
    userOptions.value = data.map(user => ({
      label: `${user.name}(${user.phone})`,
      value: user._id,
      user
    }));
  } catch (err) {
    console.error('搜索用户失败:', err);
  } finally {
    loading.value = false;
  }
}

// 监听选择变化
watch(selectedUserId, (newId) => {
  if (!newId) return;
  const selectedOption = userOptions.value.find(opt => opt.value === newId);
  if (selectedOption) {
    emit('select', selectedOption.user);
  }
});
</script> 