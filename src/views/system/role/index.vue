<script setup lang="ts">
import { h, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NDataTable, NSpace, NButton, useMessage, NTag } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { getRoleList, createRole, updateRole, deleteRole } from '@/service/api/role';
import type { RoleInfo, RoleForm } from '@/service/api/role';
import Search from './modules/search.vue';
import Form from './modules/form.vue';
import LinkPermission from './modules/link-permission.vue';
import { formatDate } from '@/utils/common';
defineOptions({ name: 'RoleManagement' });

const { t } = useI18n();
const message = useMessage();

// 表格数据
const tableData = ref<RoleInfo[]>([]);
const loading = ref(false);
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40]
});

// 搜索条件
const searchModel = ref({
  name: '',
  code: '',
  status: ''
});

// 表单控制
const formRef = ref();
const showForm = ref(false);
const formLoading = ref(false);
const currentId = ref<string>('');
const editData = ref<RoleForm | null>(null);

// 权限设置控制
const showPermission = ref(false);
const currentRoleId = ref('');

// 表格列定义
const columns: DataTableColumns<RoleInfo> = [
  {
    title: t('system.role.name'),
    key: 'name'
  },
  {
    title: t('system.role.code'),
    key: 'code'
  },
  {
    title: t('system.role.description'),
    key: 'description'
  },
  {
    title: t('system.role.status'),
    key: 'status',
    render(row) {
      const type = row.status === 'inactive' ? 'warning' : 'success';
      const text = row.status === 'inactive' ? t('common.status.disable') : t('common.status.enable');
      return h(NTag, { type }, { default: () => text });
    }
  },
  {
    title: t('common.createTime'),
    key: 'createdAt',
    render(row) {
      return formatDate(row.createdAt);
    }
  },
  {
    title: t('common.operation'),
    key: 'actions',
    fixed: 'right',
    width: 240,
    render(row) {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                onClick: () => handleEdit(row)
              },
              { default: () => t('common.edit') }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                ghost: true,
                onClick: () => handleDelete(row)
              },
              { default: () => t('common.delete') }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'info',
                ghost: true,
                onClick: () => handlePermission(row)
              },
              { default: () => t('system.role.linkPermission') }
            )
          ]
        }
      );
    }
  }
];

// 加载表格数据
async function loadTableData() {
  loading.value = true;
  try {
    const { data } = await getRoleList({
      ...searchModel.value,
      page: pagination.page,
      size: pagination.pageSize,
    });
    tableData.value = data.records;
    pagination.itemCount = data.total;
  } finally {
    loading.value = false;
  }
}

// 处理搜索
function handleSearch() {
  pagination.page = 1;
  loadTableData();
}

// 处理重置
function handleReset() {
  pagination.page = 1;
  loadTableData();
}

// 处理分页变化
function handlePageChange(page: number) {
  pagination.page = page;
  loadTableData();
}

// 处理每页条数变化
function handlePageSizeChange(pageSize: number) {
  pagination.pageSize = pageSize;
  pagination.page = 1;
  loadTableData();
}

// 新增角色
function handleAdd() {
  currentId.value = undefined;
  editData.value = null;
  showForm.value = true;
}

// 编辑角色
function handleEdit(row: RoleInfo) {
  currentId.value = row._id;
  editData.value = row;
  showForm.value = true;
}

// 删除角色
async function handleDelete(row: RoleInfo) {
  window.$dialog?.warning({
    title: t('common.warning'),
    content: t('common.confirmDelete', { name: row.name }),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      await deleteRole(row._id);
      message.success(t('common.deleteSuccess'));
      if (tableData.value.length === 1 && pagination.page > 1) {
        pagination.page -= 1;
      }
      loadTableData();
    }
  });

}

// 处理表单提交
async function handleFormSubmit(data: RoleForm) {
  formLoading.value = true;
  try {
    if (currentId.value) {
      await updateRole(currentId.value, data);
      message.success(t('common.updateSuccess'));
    } else {
      await createRole(data);
      message.success(t('common.createSuccess'));
    }
    showForm.value = false;
    loadTableData();
  } catch (err) {
    message.error(currentId.value ? t('common.updateError') : t('common.createError'));
  } finally {
    formLoading.value = false;
  }
}

// 处理权限设置
function handlePermission(row: RoleInfo) {
  currentRoleId.value = row._id;
  showPermission.value = true;
}

// 初始加载
loadTableData();
</script>

<template>
  <div class="flex flex-col gap-4">
    <Search v-model:model="searchModel" @search="handleSearch" @reset="handleReset" />

    <NCard>
      <template #header>
        <NSpace justify="space-between">
          <span>{{ t('system.role.title') }}</span>
          <NButton type="primary" @click="handleAdd" ghost>
            <template #icon>
              <div class="i-material-symbols:add" />
            </template>
            {{ t('common.add') }}
          </NButton>
        </NSpace>
      </template>

      <NDataTable :loading="loading" :columns="columns" :data="tableData" :pagination="pagination"
        @update:page="handlePageChange" @update:page-size="handlePageSizeChange" remote />
    </NCard>

    <Form ref="formRef" v-model:show="showForm" :loading="formLoading" :is-edit="!!currentId" :edit-data="editData"
      @submit="handleFormSubmit" />

    <LinkPermission v-model:show="showPermission" :role-id="currentRoleId" />
  </div>
</template>
