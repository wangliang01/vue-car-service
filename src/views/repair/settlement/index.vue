<script setup lang="tsx">
import { ref, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NSpace, NDataTable, NButton } from 'naive-ui';
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
  { title: t('settlement.repairOrder'), key: 'repairOrder', render: (row) => row.repairOrder.orderNo },
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
  { title: t('settlement.partsAmount'), key: 'partsAmount' },
  { title: t('settlement.laborAmount'), key: 'laborAmount' },
  { title: t('settlement.totalAmount'), key: 'totalAmount' },
  { title: t('settlement.paymentMethod'), key: 'paymentMethod' },
  { title: t('settlement.statusLabel'), key: 'status' },
  {
    title: t('common.action'),
    key: 'actions',
    render: (row) => {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                onClick: () => handlePay(row._id)
              },
              { default: () => t('common.pay') }
            )
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
      limit: pagination.value.pageSize
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