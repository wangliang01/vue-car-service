<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDrawer, NDrawerContent, NTree, NSpace, NButton, useMessage } from 'naive-ui';
import { fetchPermissionTree } from '@/service/api/permission';
import { getRolePermissions, updateRolePermissions } from '@/service/api/role';

defineOptions({ name: 'RoleLinkPermission' });

interface Props {
  roleId: string;
  roleName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  roleName: ''
});

const show = defineModel('show', {
  type: Boolean,
  required: true
});

const { t } = useI18n();
const message = useMessage();

const loading = ref(false);
const permissionTree = ref([]);
const checkedKeys = ref<string[]>([]);

// 加载权限树数据
async function loadPermissionTree() {
  try {
    const { data } = await fetchPermissionTree();
    permissionTree.value = data;
  } catch (err) {
    message.error(t('common.loadError'));
  }
}

// 加载角色已有权限
async function loadRolePermissions() {
  if (!props.roleId) return;
  try {
    const { data } = await getRolePermissions(props.roleId);
    checkedKeys.value = data;
  } catch (err) {
    message.error(t('common.loadError'));
  }
}

// 保存权限设置
async function handleSave() {
  loading.value = true;
  try {
    await updateRolePermissions(props.roleId, checkedKeys.value);
    message.success(t('common.updateSuccess'));
    show.value = false;
  } catch (err) {
    message.error(t('common.updateError'));
  } finally {
    loading.value = false;
  }
}

// 关闭抽屉
function handleClose() {
  show.value = false;
}

// 获取标题
const getTitle = () => {
  return t('system.role.linkPermission') + (props.roleName ? ` - ${props.roleName}` : '');
};

onMounted(() => {
  loadPermissionTree();
  loadRolePermissions();
});
</script>

<template>
  <NDrawer v-model:show="show" :width="600">
    <NDrawerContent 
      :title="getTitle()"
      :native-scrollbar="false"
    >
      <NTree
        v-model:checked-keys="checkedKeys"
        :data="permissionTree"
        checkable
        cascade
      />

      <template #footer>
        <NSpace justify="end">
          <NButton @click="handleClose">
            {{ t('common.cancel') }}
          </NButton>
          <NButton
            type="primary"
            :loading="loading"
            @click="handleSave"
          >
            {{ t('common.confirm') }}
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template> 