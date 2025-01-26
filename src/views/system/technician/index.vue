<script setup lang="ts">
import { ref, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NSpace, NButton, NDataTable, NTag, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { getTechnicianList, deleteTechnician, updateTechnicianStatus } from '@/service/api/technician';
import Search from './modules/search.vue';
import Form from './modules/form.vue';

defineOptions({ name: 'TechnicianManagement' });

const { t } = useI18n();
const message = useMessage();



// 表格相关
const loading = ref(false);
const tableData = ref<Api.Technician.TechnicianInfo[]>([]);
const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40]
});

// 搜索相关
const searchModel = ref({
  name: '',
  phone: '',
  email: '',
  level: '',
  status: ''
});

// 表单相关
const formRef = ref();
const showForm = ref(false);
const formLoading = ref(false);
const currentId = ref('');
const editData = ref<Api.Technician.TechnicianInfo | null>(null);

// 表格列定义
const columns: DataTableColumns<Api.Technician.TechnicianInfo> = [
  {
    title: t('system.technician.employeeId'),
    key: 'employeeId',
    width: 120
  },
  {
    title: t('system.technician.name'),
    key: 'name',
    width: 120
  },
  {
    title: t('system.technician.phone'),
    key: 'phone',
    width: 120
  },
  {
    title: t('system.technician.email'),
    key: 'email',
    width: 180
  },
  {
    title: t('system.technician.level'),
    key: 'level',
    width: 120
  },
  {
    title: t('system.technician.specialties'),
    key: 'specialties',
    width: 200,
    render(row) {
      return row.specialties.map(item => h(NTag, { class: { 'mr-2': true, 'mb-2': true } }, { default: () => item }));
    }
  },
  {
    title: t('system.technician.workYears'),
    key: 'workYears',
    width: 100
  },
  {
    title: t('system.technician.status'),
    key: 'status',
    width: 100,
    render(row) {
      const statusMap = {
        active: { type: 'success', text: t('system.technician.statusActive') },
        onLeave: { type: 'warning', text: t('system.technician.statusOnLeave') },
        deleted: { type: 'error', text: t('system.technician.statusDeleted') },
        terminated: { type: 'error', text: t('system.technician.statusTerminated') }
      };
      const status = statusMap[row.status];
      return h(NTag, { type: status.type }, { default: () => status.text });
    }
  },
  {
    title: t('common.action'),
    key: 'actions',
    width: 200,
    fixed: 'right',
    render(row) {
      return h(NSpace, {}, {
        default: () => [
          h(NButton, {
            size: 'small',
            onClick: () => handleEdit(row)
          }, { default: () => t('common.edit') }),
          h(NButton, {
            size: 'small',
            ghost: true,
            type: 'error',
            onClick: () => handleDelete(row)
          }, { default: () => t('common.delete') }),

        ]
      });
    }
  }
];

// 加载表格数据
async function loadTableData() {
  loading.value = true;
  try {
    const params = {
      ...searchModel.value,
      page: pagination.value.page,
      size: pagination.value.pageSize
    };
    const { data } = await getTechnicianList(params) as any
    tableData.value = data.records;
    pagination.value.itemCount = data.total;
  } finally {
    loading.value = false;
  }
}

// 搜索
async function handleSearch() {
  pagination.value.page = 1;
  await loadTableData();
}

// 重置搜索
async function handleReset() {
  pagination.value.page = 1;
  await loadTableData();
}

// 分页改变
async function handlePageChange(page: number) {
  pagination.value.page = page;
  await loadTableData();
}

// 每页条数改变
async function handlePageSizeChange(pageSize: number) {
  pagination.value.pageSize = pageSize;
  pagination.value.page = 1;
  await loadTableData();
}

// 新增
function handleAdd() {
  currentId.value = undefined;
  editData.value = null;
  showForm.value = true;
}

// 编辑
function handleEdit(row: Api.Technician.TechnicianInfo) {
  currentId.value = row._id;
  editData.value = row;
  showForm.value = true;
}

// 删除
async function handleDelete(row: Api.Technician.TechnicianInfo) {
  window.$dialog?.warning({
    title: t('common.warning'),
    content: t('common.confirmDelete', { name: row.name }),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      await deleteTechnician(row._id);
      message.success(t('common.deleteSuccess'));
      if (tableData.value.length === 1 && pagination.value.page > 1) {
        pagination.value.page -= 1;
      }
      await loadTableData();
    }
  });
}

// 更新状态
async function handleUpdateStatus(id: string, status: Api.Technician.TechnicianInfo['status']) {
  await updateTechnicianStatus(id, { status });
  message.success(t('common.updateSuccess'));
  await loadTableData();
}

// 表单提交
async function handleFormSubmit() {
  await loadTableData();
  showForm.value = false;
}

// 初始化
loadTableData();

</script>

<template>
  <div class="h-full flex flex-col gap-16px">
    <Search v-model:model="searchModel" @search="handleSearch" @reset="handleReset" />

    <NCard class="flex-1">
      <template #header>
        <NSpace justify="space-between">
          <span>{{ t('system.technician.title') }}</span>
          <NButton type="primary" @click="handleAdd" ghost>
            <template #icon>
              <div class="i-material-symbols:add" />
            </template>
            {{ t('common.add') }}
          </NButton>
        </NSpace>
      </template>

      <NDataTable :loading="loading" :columns="columns" :data="tableData" :pagination="pagination"
        @update:page="handlePageChange" @update:page-size="handlePageSizeChange" />
    </NCard>

    <Form ref="formRef" v-model:show="showForm" :loading="formLoading" :is-edit="!!currentId" :edit-data="editData"
      @submit="handleFormSubmit" />
  </div>
</template>

<style scoped>
.action-column {
  display: flex;
  gap: 8px;
}

.delete-confirm {
  padding: 8px 0;
}

.confirm-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--n-title-text-color);
}

.confirm-content {
  font-size: 14px;
  color: var(--n-text-color);
}
</style>
