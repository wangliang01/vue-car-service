<script setup lang="ts">
import { reactive, h, ref } from 'vue';
import { NButton, NSpace, NInput, NCard, NDataTable, NSelect, NDrawer } from 'naive-ui';
import { useTable } from '@/hooks/common/table';
import { useI18n } from 'vue-i18n';
import { fetchCustomerList, fetchDeleteCustomer, fetchExportCustomer } from '@/service/api/customer';
import CustomerSearch from './modules/search.vue';
import CustomerForm from './modules/form.vue';

defineOptions({ name: 'CustomerList' });

const { t } = useI18n();

// 性别选项
const genderOptions = [
  { label: t('common.gender.male'), value: 'male' },
  { label: t('common.gender.female'), value: 'female' }
];

// 用户状态选项
const statusOptions = [
  { label: t('common.status.enable'), value: 'enable' },
  { label: t('common.status.disable'), value: 'disable' }
];

const searchModel = reactive<Api.Customer.CustomerSearchParams>({
  name: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
  userStatus: ''
});

const columns: DataTableColumns<Api.Customer.CustomerInfo> = [
  { type: 'selection' },
  { title: t('common.index'), key: 'index', width: 80 },
  { title: t('menu.customer.name'), key: 'name', width: 150 },
  { title: t('menu.customer.email'), key: 'email', width: 200 },
  { title: t('menu.customer.phone'), key: 'phone', width: 150 },
  { title: t('menu.customer.address'), key: 'address', width: 200 },
  {
    title: t('common.action'),
    key: 'actions',
    width: 160,
    fixed: 'right',
    render: (row: Api.Customer.CustomerInfo) => {
      return h(NSpace, {}, () => [
        h(
          NButton,
          {
            type: 'primary',
            size: 'small',
            ghost: true,
            onClick: () => handleEdit(row)
          },
          { default: () => t('common.edit') }
        ),
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            ghost: true,
            onClick: () => handleDelete(row)
          },
          { default: () => t('common.delete') }
        )
      ]);
    }
  }
] as const;

// 添加选中行的状态
const checkedRowKeys = ref<string[]>([]);

// 修改表格配置，添加 rowKey 和选中行事件
const { loading, data: dataList, pagination, getData, columns: tableColumns } = useTable({
  apiFn: fetchCustomerList,
  columns: () => columns,
  immediate: true,
});

const showDrawer = ref(false);
const drawerType = ref<'add' | 'edit'>('add');
const editData = ref<Api.Customer.CustomerInfo>();

const exporting = ref(false);

// 选中行的完整数据
function handleCheckedRowKeys(rowKeys: string[]) {
  checkedRowKeys.value = rowKeys;
}

async function handleDelete(row: Api.Customer.CustomerInfo) {
  try {
    window.$dialog?.warning({
      title: t('common.warning'),
      content: t('common.confirmDelete'),
      positiveText: t('common.confirm'),
      negativeText: t('common.cancel'),
      onPositiveClick: async () => {
        await fetchDeleteCustomer(row._id);
        window.$message?.success(t('common.deleteSuccess'));
        getData();
      }
    });
  } catch(error) {
    // 处理对话框可能的错误
  }
}

function handleAdd() {
  drawerType.value = 'add';
  editData.value = undefined;
  showDrawer.value = true;
}

function handleEdit(row: Api.Customer.CustomerInfo) {
  drawerType.value = 'edit';
  editData.value = row;
  showDrawer.value = true;
}

function handleSearch() {
  getData();
}

function handleRefresh() {
  getData();
}

// 重置函数
function handleReset() {
  // 重置搜索表单
  Object.assign(searchModel, {
    name: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    userStatus: ''
  });
  // 重新获取数据
  getData();
}

// 批量删除函数
async function handleBatchDelete() {
  if (!checkedRowKeys.value.length) {
    window.$message?.warning(t('common.pleaseCheckValue'));
    return;
  }

  try {
     window.$dialog?.warning({
      title: t('common.warning'),
      content: t('common.confirmDelete'),
      positiveText: t('common.confirm'),
      negativeText: t('common.cancel'),
      onPositiveClick: async () => {
          // 批量删除
          await Promise.all(checkedRowKeys.value.map(id => fetchDeleteCustomer(id)));
          window.$message?.success(t('common.deleteSuccess'));
          // 清空选中
          checkedRowKeys.value = [];
          getData();
      }
    });
  } catch(error) {
    window.$message?.error(t('common.error'));
  }
}

// 导出函数
async function handleExport() {
  if (exporting.value) return;

  exporting.value = true;
  try {
    const { data: blob } = await fetchExportCustomer(searchModel as Api.Customer.CustomerInfo);

    if(blob instanceof Blob) {
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `客户列表_${new Date().toLocaleDateString()}.xlsx`;
      document.body.appendChild(link);
      link.click();

    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

      window.$message?.success(t('common.exportSuccess'));
    }
  } catch (error) {
    console.error('导出失败:', error);
    window.$message?.error(error instanceof Error ? error.message : t('common.error'));
  } finally {
    exporting.value = false;
  }
}

function handleSubmitSuccess() {
  getData();
}
</script>

<template>
  <div class="h-full">
    <CustomerSearch
      v-model:model="searchModel"
      @search="handleSearch"
      @reset="handleReset"
    />
    <!-- 列表区域 -->
    <NCard :bordered="false" class="flex-1">
      <template #header>
        <div class="flex-y-center justify-between">
          <div class="flex-y-center">
            <span class="text-16px font-medium">{{ t("menu.customer.list") }}</span>
          </div>
          <NSpace>
            <NButton type="primary" @click="handleAdd" ghost>
              <template #icon>
                <div class="i-material-symbols:add text-16px flex-center" />
              </template>
              <span class="flex-center">{{ t("common.add") }}</span>
            </NButton>
            <NButton type="error" @click="handleBatchDelete" ghost>
              <template #icon>
                <div class="i-material-symbols:delete text-16px flex-center" />
              </template>
              <span class="flex-center">{{ t("common.batchDelete") }}</span>
            </NButton>
            <NButton @click="handleRefresh" ghost>
              <template #icon>
                <div class="i-material-symbols:refresh text-16px flex-center" />
              </template>
              <span class="flex-center">{{ t("common.refresh") }}</span>
            </NButton>
            <NButton @click="handleExport" ghost>
              <template #icon>
                <div class="i-material-symbols:download text-16px flex-center" />
              </template>
              <span class="flex-center">{{ t("common.export") }}</span>
            </NButton>
          </NSpace>
        </div>
      </template>
      <NDataTable
        ref="tableRef"
        :loading="loading"
        :columns="tableColumns"
        :data="dataList"
        :pagination="pagination"
        :scroll-x="1200"
        :row-key="(row: Api.Customer.CustomerInfo) => row._id"
        @update:checked-row-keys="checkedRowKeys = $event"
        @update:page="getData"
      />
    </NCard>
    <CustomerForm
      v-model:show="showDrawer"
      :type="drawerType"
      :edit-data="editData"
      @submit-success="handleSubmitSuccess"
    />
  </div>
</template>

<style scoped>
.h-full {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

:deep(.n-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.n-button .n-button__icon) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.n-card > .n-card-header) {
  padding: 12px 24px;
}
</style>
