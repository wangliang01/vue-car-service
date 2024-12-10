<script setup lang="ts">
import { reactive, h, ref, computed } from 'vue';
import { NButton, NSpace, NCard, NDataTable, NSelect, NTag, useDialog, useMessage } from 'naive-ui';
import dayjs from 'dayjs';
import { useTable } from '@/hooks/common/table';
import { useI18n } from 'vue-i18n';
import { fetchRepairOrderList, fetchUpdateRepairOrderStatus } from '@/service/api/repair-order';
import RepairOrderSearch from './modules/search.vue';
import RepairOrderForm from './modules/form.vue';

defineOptions({ name: 'RepairOrderList' });

const { t } = useI18n();

const searchModel = reactive<Api.RepairOrder.SearchParams>({
  status: '',
  orderNo: '',
  customerName: '',
  licensePlate: ''
});

const statusOptions = computed(() => [
  { label: t('repairOrder.status.pending'), value: 'pending' },
  { label: t('repairOrder.status.inspecting'), value: 'inspecting' },
  { label: t('repairOrder.status.repairing'), value: 'repairing' },
  { label: t('repairOrder.status.completed'), value: 'completed' },
  { label: t('repairOrder.status.delivered'), value: 'delivered' }
]);

const statusTagTypes: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'default',
  inspecting: 'warning',
  repairing: 'info',
  completed: 'success',
  delivered: 'success'
};

const columns = computed(() => [
  { type: 'selection' as const, width: 50 },
  { title: t('common.index'), key: 'index', width: 60 },
  { title: t('menu.repairOrder.orderNo'), key: 'orderNo', width: 100 },
  { 
    title: t('menu.repairOrder.status'), 
    key: 'status',
    width: 80,
    render: (row: Api.RepairOrder.RepairOrderInfo) => {
      return h(
        NTag,
        {
          type: statusTagTypes[row.status],
          round: true,
          bordered: false
        },
        { default: () => t(`repairOrder.status.${row.status}`) }
      );
    }
  },
  { 
    title: t('menu.customer.name'), 
    key: 'customer',
    width: 100,
    render: (row: Api.RepairOrder.RepairOrderInfo) => {
      return row.customer?.name || '-';
    }
  },
  { 
    title: t('menu.vehicle.licensePlate'),
    key: 'vehicle',
    width: 100,
    render: (row: Api.RepairOrder.RepairOrderInfo) => {
      return row.vehicle?.licensePlate || '-';
    }
  },
  { title: t('menu.repairOrder.faultDesc'), key: 'faultDesc', width: 150 },
  { title: t('menu.repairOrder.mechanic'), key: 'mechanic', width: 100 },
  { 
    title: t('menu.repairOrder.createTime'), 
    key: 'createdAt', 
    width: 150,
    render: (row: Api.RepairOrder.RepairOrderInfo) => {
      return dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  { 
    title: t('menu.repairOrder.estimatedTime'), 
    key: 'estimatedCompletionTime', 
    width: 150,
    render: (row: Api.RepairOrder.RepairOrderInfo) => {
      return row.estimatedCompletionTime 
        ? dayjs(row.estimatedCompletionTime).format('YYYY-MM-DD HH:mm:ss')
        : '-';
    }
  },
  { 
    title: t('menu.repairOrder.actualTime'), 
    key: 'actualCompletionTime', 
    width: 150,
    render: (row: Api.RepairOrder.RepairOrderInfo) => {
      return row.actualCompletionTime
        ? dayjs(row.actualCompletionTime).format('YYYY-MM-DD HH:mm:ss')
        : '-';
    }
  },
  { 
    title: t('menu.repairOrder.deliveryTime'), 
    key: 'deliveryTime', 
    width: 150,
    render: (row: Api.RepairOrder.RepairOrderInfo) => {
      return row.deliveryTime
        ? dayjs(row.deliveryTime).format('YYYY-MM-DD HH:mm:ss')
        : '-';
    }
  },
  {
    title: t('common.action'),
    key: 'actions',
    fixed: 'right',
    width: 200,
    render: (row: Api.RepairOrder.RepairOrderInfo) => {
      return h(NSpace, { justify: 'center' }, {
        default: () => [
          row.status === 'pending' && h(
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
              size: 'small',
              ghost: true,
              onClick: () => handleView(row)
            },
            { default: () => t('common.view') }
          )
        ]
      });
    }
  }
]);

const {
  loading,
  data: dataList,
  pagination,
  getData,
  columns: tableColumns,
  updateSearchParams,
  resetSearchParams
} = useTable({
  apiFn: fetchRepairOrderList,
  columns: () => columns.value,
  apiParams: searchModel,
  immediate: true
});

const showDrawer = ref(false);
const drawerType = ref<'add' | 'edit'>('add');
const editData = ref<Api.RepairOrder.RepairOrderInfo | null>(null);

function handleAdd() {
  showDrawer.value = true;
}

function handleSearch() {
  updateSearchParams(searchModel);
  pagination.page = 1;
  getData();
}

function handleReset() {
  Object.assign(searchModel, {
    status: '',
    orderNo: '',
    customerName: '',
    licensePlate: ''
  });
  getData();
}

function handleRefresh() {
  getData();
}

function handleSubmitSuccess() {
  showDrawer.value = false;
  getData();
  window.$message?.success(t('common.addSuccess'));
}

function handleEdit(row: Api.RepairOrder.RepairOrderInfo) {
  drawerType.value = 'edit';
  editData.value = row;
  showDrawer.value = true;
}

function handleView(row: Api.RepairOrder.RepairOrderInfo) {
  drawerType.value = 'view';
  editData.value = row;
  showDrawer.value = true;
}

function handleDrawerClose() {
  editData.value = null;
}
</script>

<template>
  <div class="h-full">
    <RepairOrderSearch
      :search-model="searchModel"
      @search="handleSearch"
      @reset="handleReset"
    />
    <NCard :bordered="false" class="flex-1">
      <template #header>
        <div class="flex-y-center justify-between">
          <div class="flex-y-center">
            <span class="text-16px font-medium">{{ t("menu.repairOrder.list") }}</span>
          </div>
          <NSpace>
            <NButton type="primary" @click="handleAdd" ghost>
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

      <NDataTable
        :loading="loading"
        :columns="tableColumns"
        :data="dataList"
        :pagination="pagination"
        :scroll-x="1600"
        :row-key="(row: Api.RepairOrder.RepairOrderInfo) => row._id"
        @update:page="getData"
      />
    </NCard>
    <RepairOrderForm
      v-model:show="showDrawer"
      :type="drawerType"
      :edit-data="editData"
      @submit-success="handleSubmitSuccess"
      @update:show="handleDrawerClose"
    />
  </div>
</template> 