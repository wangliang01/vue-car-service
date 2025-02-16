<script setup lang="ts">
import { h, ref, computed } from 'vue';
import { useMessage, NTag, NButton } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { getStockInList, cancelStockIn } from '@/service/api/inventory';
import StockInForm from './components/form.vue';
import StockInSearch from './components/search.vue';
import { useI18n } from 'vue-i18n';
import { formatDate } from '@/utils/common';
import { useTable } from '@/hooks/common/table'

defineOptions({ name: 'StockIn' });

const { t } = useI18n();

const message = useMessage();

// 表单控制
const showForm = ref(false);
const formData = ref<Partial<Api.Inventory.CreateStockInParams> | null>(null);


const getColumns = () => [
  { title: t('inventory.stockIn.stockInNo'), key: 'stockInNo', width: '160px' },
  {
    title: t('inventory.stockIn.material'),
    key: 'material',
    render: (row) => row.material.name
  },
  { title: t('inventory.stockIn.quantity'), key: 'quantity' },
  { title: t('inventory.stockIn.unitPrice'), key: 'unitPrice' },
  { title: t('inventory.stockIn.totalAmount'), key: 'totalAmount' },
  { title: t('inventory.stockIn.supplier'), key: 'supplier', render: (row) => row.material?.supplier?.name },
  {
    title: t('inventory.stockIn.stockInDate'), key: 'stockInDate', render: (row) => {
      return formatDate(row.stockInDate, 'YYYY-MM-DD')
    }
  },
  {
    title: t('inventory.stockIn.status'),
    key: 'status',
    render: (row) => {
      const type = row.status === 'active' ? 'success' : 'error';
      const text = row.status === 'active'
        ? t('inventory.stockIn.statusActive')
        : t('inventory.stockIn.statusInactive');
      return h(NTag, { type }, { default: () => text });
    }
  },
  {
    title: t('common.action'),
    key: 'actions',
    fixed: 'right',
    render: (row) => {
      if (row.status === 'active') {
        return h(
          NButton,
          {
            size: 'small',
            type: 'error',
            ghost: true,
            onClick: () => handleCancel(row._id)
          },
          { default: () => t('inventory.stockIn.cancel') }
        );
      }
      return null;
    }
  }
];

const {
  loading,
  data: dataList,
  pagination,
  searchParams: searchModel,
  getData,
  columns: tableColumns,
  updateSearchParams,
  resetSearchParams
} = useTable({
  apiFn: getStockInList as any,
  columns: () => getColumns() as any,
  apiParams: {
    current: 1,
    size: 10,
    materialId: '',
    supplier: '',
    status: undefined as 'active' | 'inactive' | undefined,
    startDate: null as number | null,
    endDate: null as number | null
  },
  immediate: true,
  showTotal: true
});



// 搜索
function handleSearch() {
  updateSearchParams(searchModel);
  getData();
}

// 重置搜索
function handleReset() {
  resetSearchParams();
  getData();
}

// 新建入库单
function handleCreate() {
  formData.value = null;
  showForm.value = true;
}

function handleRefresh() {
  getData();
}

// 取消入库
async function handleCancel(id: string) {
  try {
    await cancelStockIn(id);
    message.success(t('common.success'));
    getData();
  } catch (error) {
    message.error(t('common.error'));
  }
}

// 表单提交成功
function handleSuccess() {
  message.success(t('common.success'));
  getData();
}



</script>

<template>
  <div class="h-full flex flex-col">
    <!-- 搜索区域 -->
    <StockInSearch v-model:model="searchModel" @search="handleSearch" @reset="handleReset" />


    <!-- 列表 -->
    <NCard>
      <template #header>
        <div class="flex-y-center justify-between">
          <div class="flex-y-center">
            <span class="text-16px font-medium">{{ t("inventory.stockIn.create") }}</span>
          </div>
          <NSpace>
            <NButton type="primary" @click="handleCreate" ghost>
              <template #icon>
                <div class="i-material-symbols:add text-16px flex-center" />
              </template>
              <span class="flex-center">{{ t("common.add") }}</span>
            </NButton>
            <NButton @click="handleRefresh" ghost>
              <template #icon>
                <div class="i-material-symbols:refresh text-16px flex-center" />
              </template>
              <span class="flex-center">{{ t("common.refresh") }}</span>
            </NButton>
          </NSpace>
        </div>
      </template>
      <NSpace vertical :size="16">
        <NDataTable
          ref="tableRef"
          :loading="loading"
          :columns="tableColumns"
          :data="dataList"
          :pagination="pagination"
          remote
        />
      </NSpace>
    </NCard>

    <!-- 新建/编辑弹窗 -->
    <StockInForm v-model:show="showForm" :form-data="formData" @success="handleSuccess" />
  </div>
</template>
