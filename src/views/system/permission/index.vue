<script setup lang="ts">
import { ref, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NSpace, NButton, NTree, NModal } from 'naive-ui';
import type { TreeOption } from 'naive-ui';
import { fetchPermissionTree, fetchDeletePermission } from '@/service/api/permission';
import PermissionForm from './modules/form.vue';
import PermissionSearch from './modules/search.vue';

const { t } = useI18n();

const loading = ref(false);
const showForm = ref(false);
const editingRecord = ref<Api.Permission.PermissionInfo | null>(null);
const permissionTree = ref([])

// 转换权限数据为树形结构
function transformPermissionToTree(permissions: Api.Permission.PermissionInfo[]): TreeOption[] {
  return permissions.map(item => {
    const node: TreeOption = {
      key: item._id,
      label: item.name,
      code: item.code,
      type: item.type,
      icon: item.icon,
      rawData: item
    };

    if (item.children && item.children.length > 0) {
      node.children = transformPermissionToTree(item.children);
    }

    return node;
  });
}

// 获取权限树
async function getPermissionTree() {
  try {
    loading.value = true;
    const {data} = await fetchPermissionTree();
    permissionTree.value = transformPermissionToTree(data)

    console.log("permissionTree", permissionTree.value);
  } finally {
    loading.value = false;
  }
}

// 新增权限
function handleAdd(parentId?: string) {
  editingRecord.value = null;
  if (parentId) {
    editingRecord.value = { parentId } as Api.Permission.PermissionInfo;
  }
  showForm.value = true;
}

// 编辑权限
function handleEdit(record: Api.Permission.PermissionInfo) {
  editingRecord.value = record;
  showForm.value = true;
}

// 删除权限
async function handleDelete(id: string) {
  try {
    await fetchDeletePermission(id);
    await getPermissionTree();
  } catch (error) {
    // 处理错误
  }
}

// 表单提交回调
function handleFormSubmit() {
  showForm.value = false;
  getPermissionTree();
}

// 搜索条件
const searchModel = ref({
  name: '',
  code: '',
  type: undefined as 'menu' | 'operation' | undefined
});

// 处理搜索
async function handleSearch() {
  await getPermissionTree();
}

// 处理重置
async function handleReset() {
  await getPermissionTree();
}

// 初始化
getPermissionTree();
</script>

<template>
  <div class="h-full">
    <PermissionSearch
      v-model="searchModel"
      @search="handleSearch"
      @reset="handleReset"
    />
    
    <NCard :title="t('system.permission.title')">
      <template #header-extra>
        <NButton type="primary" @click="() => handleAdd()">{{ t('common.add') }}</NButton>
      </template>

      <NTree
        :data="permissionTree"
        :loading="loading"
        block-line
        selectable
        expand-on-click
        :show-irrelevant-nodes="false"
        :render-label="({ option: node }) => {
          return h(
            'div',
            {
              class: 'h-10 flex-y-center justify-between w-full'
            },
            {
              default: () => [
                h('span', {
                  class: 'flex-1'
                }, node.label),
                h(
                  NSpace,
                  { align: 'center' },
                  {
                    default: () => [
                      h(
                        NButton,
                        {
                          text: true,
                          type: 'primary',
                          onClick: (e: Event) => {
                            e.stopPropagation();
                            handleAdd(node.key as string);
                          }
                        },
                        { default: () => t('common.add') }
                      ),
                      h(
                        NButton,
                        {
                          text: true,
                          type: 'primary',
                          onClick: (e: Event) => {
                            e.stopPropagation();
                            handleEdit(node.rawData);
                          }
                        },
                        { default: () => t('common.edit') }
                      ),
                      h(
                        NButton,
                        {
                          text: true,
                          type: 'error',
                          onClick: (e: Event) => {
                            e.stopPropagation();
                            handleDelete(node.key as string);
                          }
                        },
                        { default: () => t('common.delete') }
                      )
                    ]
                  }
                )
              ]
            }
          );
        }"
      />

      <PermissionForm
        v-model:show="showForm"
        :editing-record="editingRecord"
        @submit="handleFormSubmit"
      />
    </NCard>
  </div>
</template> 

<style scoped>
:deep(.n-tree-node) {
  align-items: center;
  .n-tree-node-switcher {
    position: relative;
    top: -2px;
  }
}
</style>