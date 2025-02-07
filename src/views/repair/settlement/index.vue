<script setup lang="tsx">
import { ref, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NSpace, NDataTable, NButton, NTag } from 'naive-ui';
import { fetchSettlementList, updateSettlementStatus } from '@/service/api/settlement';
import Search from './modules/search.vue';

const { t } = useI18n();
const loading = ref(false);
const tableData = ref<Api.Settlement.SettlementInfo[]>([]);
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
});

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
      <div class="mt-1 text-gray-500">
       {row.vehicle.licensePlate}
      </div>
    </div>
  )
}

const columns = [
  { title: t('settlement.settlementNo'), key: 'settlementNo'},
  { title: t('settlement.repairOrderNo'), key: 'repairOrderNo', render: (row) => row.repairOrder.orderNo },
  {
    title: t('settlement.customer'),
    key: 'customer',
    render: (row) => (
      <div>
        <div>{row.customer.name}</div>
        <div class="text-gray-500 text-sm">{row.customer.phone}</div>
      </div>
    )
  },
  {
    title: t('settlement.vehicle'),
    key: 'vehicle',
    render: resolveVehicle
  },
  { title: t('settlement.partsAmount'), key: 'partsAmount', render: row => row.formattedPartsAmount },
  { title: t('settlement.laborAmount'), key: 'laborAmount', render: row => row.formattedLaborAmount },
  { title: t('settlement.totalAmount'), key: 'totalAmount', render: row => row.formattedTotalAmount },
  { title: t('settlement.paymentMethod'), key: 'paymentMethod' },
  { title: t('settlement.statusLabel'), key: 'paymentStatus', render: row => <NTag type={row.paymentStatus === 'paid' ? 'success' : 'warning'}>{paymentStatusMap[row.paymentStatus]}</NTag> },
  {
    title: t('common.action'),
    key: 'actions',
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
                ghost: true,
                onClick: () => handleView(row)
              },
              { default: () => t('common.view') }
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
                type: 'success',
                ghost: true,
                onClick: () => handleEdit(row)
              },
              { default: () => t('common.download') }
            ),
          ]
        }
      );
    }
  }
];

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

async function handleView(row) {}


async function handleEdit(row) {}

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
  </div>
</template>

<style scoped>
.settlement-container {
  padding: 16px;
}
</style>
