<script setup lang="tsx">
import { ref, h, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NSpace, NDataTable, NButton, NTag } from 'naive-ui';
import { fetchSettlementList, updateSettlementStatus } from '@/service/api/settlement';
import Search from './modules/search.vue';
import Detail from './modules/detail.vue';
import Edit from './modules/edit.vue';

const { t } = useI18n();
const loading = ref(false);
const tableData = ref<Api.Settlement.SettlementInfo[]>([]);
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
});
const detailVisible = ref(false);
const currentRow = ref<Api.Settlement.SettlementInfo | null>(null);
const editVisible = ref(false);
const editRow = ref<Api.Settlement.SettlementInfo | null>(null);

const searchModel = ref({
  status: '',
  paymentMethod: '',
  startDate: '',
  endDate: '',
  minAmount: undefined,
  maxAmount: undefined
});

const paymentStatusMap = {
  'unpaid': t('settlement.status.unpaid'),
  'paid': t('settlement.status.paid')
};

const resolveVehicle = (row: any) => {
  return (
    <div>
      <div class="flex items-center gap-2">
        <img
          src={`/src/assets/imgs/brand/${row.vehicle.brand.toLowerCase()}.png`}
          class="w-6 h-6"
          alt={row.vehicle.brand}
        />
        <span>{row.vehicle.brand}</span><span>{row.vehicle.model} </span>
      </div>
    </div>
  )
}

const columns: {
  title: string;
  key: string;
  width?: number;
  fixed?: 'left' | 'right';
  render?: (row: any) => any;
}[] = [
  { title: t('settlement.settlementNo'), key: 'settlementNo', width: 150 },
  { title: t('settlement.repairOrderNo'), key: 'repairOrderNo', width: 150, render: (row) => row.repairOrder.orderNo },
  {
    title: t('settlement.customer'),
    key: 'customer',
    width: 120,
    render: (row) => (
      <div>
        <div>{row.customer.name}</div>
      </div>
    )
  },
  {
    title: t('settlement.contact'),
    key: 'contact',
    width: 120,
    render: (row) => (
      <div>
        <div>{row.customer.contact}</div>
        <div class="text-gray-500 text-sm">{row.customer.phone}</div>
      </div>
    )
  },
  {
    title: t('settlement.licensePlate'),
    key: 'licensePlate',
    width: 100,
    render: (row) => row?.vehicle?.licensePlate
  },
  {
    title: t('settlement.vehicleBrand'),
    key: 'vehicleBrand',
    width: 130,
    render: resolveVehicle
  },
  { title: t('settlement.partsAmount'), key: 'partsAmount', width: 100, render: row => row.formattedPartsAmount },
  { title: t('settlement.laborAmount'), key: 'laborAmount', width: 100, render: row => row.formattedLaborAmount },
  { title: t('settlement.totalAmount'), key: 'totalAmount', width: 100, render: row => row.formattedTotalAmount },
  { title: t('settlement.statusLabel'), key: 'paymentStatus', width: 100, render: row => <NTag type={row.paymentStatus === 'paid' ? 'success' : 'warning'}>{paymentStatusMap[row.paymentStatus]}</NTag> },
  {
    title: t('common.action'),
    key: 'actions',
    fixed: 'right',
    width: 200,
    render: (row) => {
      return h(
        NSpace,
        {},
        {
          default: () => [
            row.paymentStatus === 'unpaid' && h(
              NButton,
              {
                size: 'small',
                type: 'warning',
                ghost: true,
                onClick: () => handlePay(row._id)
              },
              { default: () => t('common.pay') }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
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
            ),

            // h(
            //   NButton,
            //   {
            //     size: 'small',
            //     type: 'success',
            //     ghost: true,
            //     onClick: () => handleDownload(row)
            //   },
            //   { default: () => t('common.download') }
            // ),
          ]
        }
      );
    }
  }
];

const scrollX = computed(() => {
  return columns.reduce((acc, col) => acc + Number(col.width || 0), 0);
});

async function loadData() {
  loading.value = true;
  try {
    const { data } = await fetchSettlementList({
      ...searchModel.value,
      page: pagination.value.page,
      size: pagination.value.pageSize
    });

    console.log(  'data', data);
    tableData.value = data.records;
    pagination.value.total = data.total;
  } finally {
    loading.value = false;
  }
}

async function handlePay(id: string) {
  try {
    await updateSettlementStatus(id, { status: 'paid' });
    await loadData();
  } catch (error) {
    // 错误处理
  }
}

async function handleView(row: Api.Settlement.SettlementInfo) {
  currentRow.value = row;
  detailVisible.value = true;
}

async function handleDownload(row: Api.Settlement.SettlementInfo) {
  currentRow.value = row;
  detailVisible.value = true;
}

async function handleEdit(row: Api.Settlement.SettlementInfo) {
  editRow.value = row;
  editVisible.value = true;
}

function handleEditSuccess() {
  loadData();
}

// 初始加载
loadData();
</script>

<template>
  <div class="settlement-container">
    <Search
      v-model:model="searchModel"
      @search="loadData"
      @reset="loadData"
    />

    <NCard>
      <template #header>
        <NSpace justify="space-between">
          <span>{{ t('settlement.title') }}</span>
          <NSpace>

          </NSpace>
        </NSpace>
      </template>

      <NDataTable
        :loading="loading"
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        @update:page="loadData"
        @update:page-size="loadData"
      />
    </NCard>

    <Detail
      v-model:visible="detailVisible"
      :data="currentRow"
      :type="'view'"
    />

    <Edit
      v-model:visible="editVisible"
      :data="editRow"
      @submit-success="handleEditSuccess"
    />
  </div>
</template>

<style scoped>
.settlement-container {
  padding: 16px;
}
</style>
