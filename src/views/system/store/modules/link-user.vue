<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDrawer, NDrawerContent, NSpace, NButton, NTransfer, useMessage } from 'naive-ui';
import { getUserList } from '@/service/api/user';
import type { TransferOption } from 'naive-ui';

defineOptions({ name: 'StoreLinkUser' });

interface Props {
  loading?: boolean;
  storeId?: string;
  storeName?: string;
  linkedUserIds?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  storeId: undefined,
  storeName: '',
  linkedUserIds: () => []
});

interface Emits {
  (e: 'update:show', value: boolean): void;
  (e: 'submit', data: string[]): void;
}

const emit = defineEmits<Emits>();
const { t } = useI18n();

const show = defineModel<boolean>('show', {
  type: Boolean,
  default: false
});

// 穿梭框数据
const options = ref<TransferOption[]>([]);
const selectedUserIds = ref<string[]>([]);
const transferLoading = ref(false);

const message = useMessage();

// 加载用户列表
async function loadUsers() {
  transferLoading.value = true;
  try {
    const { data } = await getUserList({
      page: 1,
      limit: 999
    });
    options.value = data.list.map(user => ({
      label: `${user.name}(${user.username})`,
      value: user._id,
      disabled: false
    }));
    selectedUserIds.value = props.linkedUserIds || [];
  } catch (err) {
    message.error(t('common.loadError'));
  } finally {
    transferLoading.value = false;
  }
}

// 监听显示状态
watch(
  () => show.value,
  (newVal) => {
    if (newVal) {
      loadUsers();
    }
  }
);

// 提交
function handleSubmit() {
  emit('submit', selectedUserIds.value);
}

// 关闭抽屉
function handleClose() {
  emit('update:show', false);
}

// 获取标题
const getTitle = () => {
  return t('system.store.linkUser.title') + ' - ' + props.storeName;
};

defineExpose({
  selectedUserIds
});
</script>

<template>
  <NDrawer v-model:show="show" :width="600">
    <NDrawerContent 
      :title="getTitle()"
      :native-scrollbar="false"
    >
      <NTransfer
        v-model:value="selectedUserIds"
        :options="options"
        :loading="transferLoading"
        filterable
        :filter="(pattern, option) => option.label.toLowerCase().includes(pattern.toLowerCase())"
      />

      <template #footer>
        <NSpace justify="end">
          <NButton @click="handleClose">
            {{ t('common.cancel') }}
          </NButton>
          <NButton 
            type="primary" 
            :loading="loading"
            @click="handleSubmit"
          >
            {{ t('common.confirm') }}
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template> 