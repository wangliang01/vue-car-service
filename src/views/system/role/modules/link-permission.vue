<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
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
    permissionTree.value = transformPermissionToTree(data);
  } catch (err) {
    message.error(t('common.loadError'));
  }
}

// 转换权限数据为树形结构
function transformPermissionToTree(permissions: Api.Permission.PermissionInfo[]) {
  return permissions.map(item => {
    const node: Record<string, any> = {
      key: item._id,
      label: item.name
    };
    if (item.children && item.children.length > 0) {
      node.children = transformPermissionToTree(item.children);
    }
    return node;
  });
}

// 加载角色已有权限
async function loadRolePermissions() {
  if (!props.roleId) return;
  try {
    const { data } = await getRolePermissions(props.roleId);
    console.log("原始权限数据", data);
    // 确保 data 是数组，并且每个元素都是权限的 _id
    checkedKeys.value = Array.isArray(data) 
      ? data.map(item => typeof item === 'string' ? item : item._id)
      : [];
    console.log("处理后的 checkedKeys", checkedKeys.value);
  } catch (err) {
    message.error(t('common.loadError'));
  }
}

// 获取所有叶子节点的ID
function getLeafKeys(checkedKeys: string[]): string[] {
  const leafKeys: string[] = [];
  
  function isLeafNode(key: string): boolean {
    const node = findNodeByKey(permissionTree.value, key);
    return node && (!node.children || node.children.length === 0);
  }

  function findNodeByKey(tree: any[], key: string): any {
    for (const node of tree) {
      if (node.key === key) return node;
      if (node.children) {
        const found = findNodeByKey(node.children, key);
        if (found) return found;
      }
    }
    return null;
  }

  checkedKeys.forEach(key => {
    if (isLeafNode(key)) {
      leafKeys.push(key);
    }
  });

  return leafKeys;
}

// 保存权限设置
async function handleSave() {
  loading.value = true;
  try {
    // 只提交叶子节点的ID
    const leafKeys = getLeafKeys(checkedKeys.value);
    console.log("提交的叶子节点ID", leafKeys);
    await updateRolePermissions(props.roleId, leafKeys);
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

watch(() => show.value, (newVal) => {
  if (newVal) {
    loadPermissionTree();
    loadRolePermissions();
  }
});

onMounted(() => {
  if (show.value) {
    loadPermissionTree();
    loadRolePermissions();
  }
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
        expand-on-click
        block-line
        cascade
        default-expand-all
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


<style>

</style>