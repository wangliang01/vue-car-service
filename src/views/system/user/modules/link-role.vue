<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDrawer, NDrawerContent, NSpace, NButton, NTransfer } from 'naive-ui';
import { getRoleList } from '@/service/api/role';

defineOptions({ name: 'LinkRole' });

interface Props {
  loading?: boolean;
  storeId?: string;
  storeName?: string;
  linkedRoleIds?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  storeId: '',
  storeName: '',
  linkedRoleIds: () => []
});

interface Emits {
  (e: 'update:show', value: boolean): void;
  (e: 'submit', roleIds: string[]): void;
}

const emit = defineEmits<Emits>();
const { t } = useI18n();

const show = defineModel<boolean>('show', {
  type: Boolean,
  default: false
});

// 角色列表
const roleOptions = ref<Array<{ label: string; value: string }>>([]);
const selectedRoleIds = ref<string[]>([]);

// 加载角色列表
async function loadRoleList() {
  try {
    const { data } = await getRoleList({ page: 1, limit: 999 });
    roleOptions.value = data.list.map(item => ({
      label: item.name,
      value: item._id
    }));
  } catch (err) {
    window.$message?.error(t('common.loadError'));
  }
}

// 提交
function handleSubmit() {
  emit('submit', selectedRoleIds.value);
}

// 关闭抽屉
function handleClose() {
  emit('update:show', false);
}

// 监听编辑数据变化
watch(
  () => props.linkedRoleIds,
  (newIds) => {
    if (newIds) {
      selectedRoleIds.value = [...newIds];
    } else {
      selectedRoleIds.value = [];
    }
  },
  { immediate: true }
);

// 监听抽屉显示
watch(
  () => show.value,
  (newVal) => {
    if (newVal) {
      loadRoleList();
    }
  }
);
</script>

<template>
  <NDrawer v-model:show="show" :width="500">
    <NDrawerContent 
      :title="t('system.user.linkRole.title')"
      :native-scrollbar="false"
    >
      <NTransfer
        v-model:value="selectedRoleIds"
        :options="roleOptions"
        virtual-scroll
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