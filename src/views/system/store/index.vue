<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NSpace, NButton, NDataTable, NPagination, NTag, NPopconfirm, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import {
  fetchStoreList,
  fetchDeleteStore,
  fetchBatchUpdateStoreStatus,
  fetchExportStores,
  getStoreUsers,
  updateStoreUsers,
  fetchUpdateStoreStatus
} from '@/service/api/store';
import StoreForm from './modules/form.vue';
import StoreSearch from './modules/search.vue';
import LinkUser from './modules/link-user.vue';

const { t } = useI18n();
const message = useMessage();

// 搜索表单
const searchModel = ref<Api.Store.SearchParams>({
  name: '',
  code: '',
  status: null,
  current: 1,
  size: 10
});

// 表格数据
const loading = ref(false);
const dataList = ref<Api.Store.StoreInfo[]>([]);
const pagination = ref({
  current: 1,
  size: 10,
  total: 0,
  pageSizes: [10, 20, 30, 50]
});

// 选中行
const checkedRowKeys = ref<string[]>([]);

// 表单抽屉
const formVisible = ref(false);
const formMode = ref<'create' | 'edit'>('create');
const editingRecord = ref<Api.Store.StoreInfo | null>(null);

// 关联用户控制
const showLinkUser = ref(false);
const linkUserLoading = ref(false);
const currentStoreId = ref<string>();
const currentStoreName = ref('');
const linkedUserIds = ref<string[]>([]);

// 表格列定义
const columns: DataTableColumns<Api.Store.StoreInfo> = [
  { type: 'selection' },
  { title: t('system.store.name'), key: 'name' },
  { title: t('system.store.code'), key: 'code' },
  {
    title: t('system.store.status._value'),
    key: 'status',
    render(row) {
      return h(NTag, {
        type: row.status === 'active' ? 'success' : 'error',
        size: 'small'
      }, {
        default: () => t(`system.store.status.${row.status}`)
      });
    }
  },
  {
    title: t('system.store.address'),
    key: 'address',
  },
  {
    title: t('common.operation'),
    key: 'actions',
    width: 280,
    fixed: 'right',

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
                type: 'info',
                ghost: true,
                onClick: () => handleLinkUser(row)
              },
              { default: () => t('system.store.linkUser.action') }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: row.status === 'active' ? 'warning' : 'success',
                ghost: true,
                onClick: () => handleUpdateStatus(row)
              },
              { default: () => row.status === 'active' ? t('system.store.status.deactivate') : t('system.store.status.activate') }
            ),
            h(NButton, {
              size: 'small',
              type: 'error',
              ghost: true,
              onClick: () => handleDelete(row )
            }, { default: () => t('common.delete') }),
          ]
        }
      );
    }
  }
];

// 获取数据
async function getData(page = pagination.value.current) {
  loading.value = true;
  try {
    const { data } = await fetchStoreList({
      ...searchModel.value,
      current: page,
      size: pagination.value.size,
    });
    dataList.value = data.records;
    pagination.value.total = data.total;
  } finally {
    loading.value = false;
  }
}

// 搜索
function handleSearch() {
  console.log("搜索", searchModel.value);
  getData(1);
}

// 重置
function handleReset() {
  Object.assign(searchModel.value, {
    name: '',
    code: '',
    status: null,
  });
  searchModel.value.name = ''
  searchModel.value.code = ''
  searchModel.value.status = null
  getData(1);
}

// 新增
function handleAdd() {
  formMode.value = 'create';
  editingRecord.value = null;
  formVisible.value = true;
}

// 编辑
function handleEdit(record: Api.Store.StoreInfo) {
  formMode.value = 'edit';
  editingRecord.value = { ...record };
  formVisible.value = true;
}

// 删除
async function handleDelete(row: Api.Store.StoreInfo) {
  try {
    window.$dialog?.warning({
      title: t('common.warning'),
      content: t('common.confirmDelete', { name: row.name }),
      positiveText: t('common.confirm'),
      negativeText: t('common.cancel'),
      onPositiveClick: async () => {
        await fetchDeleteStore(row._id);
        window.$message?.success(t('common.deleteSuccess'));
        getData();
      }
    });
  } catch (error) {
    window.$message?.error(t('common.error'));
  }
}

// 批量更新状态
async function handleBatchUpdateStatus(status: string) {
  if (!checkedRowKeys.value.length) {
    window.$message?.warning(t('common.pleaseCheckValue'));
    return;
  }

  try {
    await fetchBatchUpdateStoreStatus(checkedRowKeys.value, status);
    window.$message?.success(t('common.updateSuccess'));
    checkedRowKeys.value = [];
    getData();
  } catch (error) {
    window.$message?.error(t('common.error'));
  }
}

// 导出
async function handleExport() {
  try {
    const {data: blob} = await fetchExportStores();
    console.log("blob", blob)
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stores_${Date.now()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    window.$message?.success(t('common.exportSuccess'));
  } catch (error) {
    window.$message?.error(t('common.error'));
  }
}

// 表单提交回调
function handleFormSubmit() {
  formVisible.value = false;
  getData();
  window.$message?.success(
    formMode.value === 'create'
      ? t('common.addSuccess')
      : t('common.updateSuccess')
  );
}

// 处理关联用户
async function handleLinkUser(row: Api.Store.StoreInfo) {
  currentStoreId.value = row._id;
  currentStoreName.value = row.name;
  showLinkUser.value = true;

  try {
    const { data } = await getStoreUsers(row._id);

    console.log("data", data);
    linkedUserIds.value = data.list.map(item => item._id);
  } catch (err) {
    message.error(t('common.loadError'));
  }
}

// 处理关联用户提交
async function handleLinkUserSubmit(userIds: string[]) {
  if (!currentStoreId.value) return;

  linkUserLoading.value = true;
  try {
    await updateStoreUsers(currentStoreId.value, userIds);
    message.success(t('common.updateSuccess'));
    showLinkUser.value = false;
    getData();
  } catch (err) {
    message.error(t('common.updateError'));
  } finally {
    linkUserLoading.value = false;
  }
}

// 更新门店状态
async function handleUpdateStatus(row: Api.Store.StoreInfo) {
  const newStatus = row.status === 'active' ? 'inactive' : 'active';
  const actionText = newStatus === 'active' ? t('system.store.status.activate') : t('system.store.status.deactivate');

  try {
    await fetchUpdateStoreStatus(row._id, newStatus);
    message.success(actionText + t('common.success'));
    getData();
  } catch (err) {
    message.error(actionText + t('common.failed'));
  }
}

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="h-full flex flex-col gap-16px">
    <!-- 搜索区域 -->
    <StoreSearch
      v-model:model="searchModel"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 列表区域 -->
    <NCard class="flex-1">
      <div class="flex justify-between items-center mb-16px">
        <h3 class="text-16px font-medium">{{ t('menu.system.store') }}</h3>
        <NSpace>
          <NButton type="primary" @click="handleAdd" ghost>
            <template #icon>
              <div class="i-material-symbols:add" />
            </template>
            {{ t('common.add') }}
          </NButton>
          <NButton type="error" @click="handleBatchUpdateStatus('inactive')" ghost>
            {{ t('system.store.batchDeactivate') }}
          </NButton>
          <NButton type="success" @click="handleBatchUpdateStatus('active')" ghost>
            {{ t('system.store.batchActivate') }}
          </NButton>
          <NButton @click="handleExport" ghost>
            <template #icon>
              <div class="i-material-symbols:download" />
            </template>
            {{ t('common.export') }}
          </NButton>
        </NSpace>
      </div>

      <!-- 表格 -->
      <NDataTable
        :loading="loading"
        :columns="columns"
        :data="dataList"
        :row-key="row => row._id"
        :checked-row-keys="checkedRowKeys"
        @update:checked-row-keys="checkedRowKeys = $event"
      />

      <!-- 分页 -->
      <div class="mt-16px flex justify-end">
        <NPagination
          v-model:page="pagination.current"
          v-model:page-size="pagination.size"
          :item-count="pagination.total"
          :page-sizes="pagination.pageSizes"
          @update:page="getData"
          @update:page-size="getData(1)"
        />
      </div>
    </NCard>

    <!-- 表单抽屉 -->
    <StoreForm
      v-model="formVisible"
      :mode="formMode"
      :editing-record="editingRecord"
      @submit="handleFormSubmit"
    />

    <LinkUser
      v-model:show="showLinkUser"
      :loading="linkUserLoading"
      :store-id="currentStoreId"
      :store-name="currentStoreName"
      :linked-user-ids="linkedUserIds"
      @submit="handleLinkUserSubmit"
    />
  </div>
</template>

<style scoped>
.flex {
  display: flex;
}

.flex-1 {
  flex: 1;
}

.flex-col {
  flex-direction: column;
}

.gap-16px {
  gap: 16px;
}

.justify-between {
  justify-content: space-between;
}

.justify-end {
  justify-content: flex-end;
}

.items-center {
  align-items: center;
}

.mb-16px {
  margin-bottom: 16px;
}

.mt-16px {
  margin-top: 16px;
}

.text-16px {
  font-size: 16px;
}

.font-medium {
  font-weight: 500;
}
</style>
