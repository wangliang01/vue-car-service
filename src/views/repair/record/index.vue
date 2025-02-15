<script setup lang="ts">
import { reactive, h, ref, computed, nextTick } from 'vue';
import { NButton, NSpace, NCard, NDataTable, NSelect, NTag, useDialog, useMessage } from 'naive-ui';
import dayjs from 'dayjs';
import { useTable } from '@/hooks/common/table';
import { useI18n } from 'vue-i18n';
import { fetchRepairOrderList } from '@/service/api/repair-order';
import RepairOrderSearch from './components/search.vue';
import RepairOrderDetail from './components/Detail.vue';

defineOptions({ name: 'RepairOrderList' });

const { t } = useI18n();

const searchModel = reactive<Api.RepairOrder.SearchParams>({
  status: 'completed,delivered',
  orderNo: '',
  customerName: '',
  licensePlate: ''
});


const statusTagTypes: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'default',
  checked: 'warning',
  repairing: 'info',
  completed: 'success',
  delivered: 'success'
};

const columns = computed(() => [
  { title: t('common.index'), key: 'index', width: 60 },
  { title: t('menu.repairOrder.orderNo'), key: 'orderNo', width: 150 },
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
  {
    title: `${t('menu.customer.contact')}/${t('menu.customer.phone')}`,
    key: 'customerContact',
    width: 200,
    render: (row: Api.RepairOrder.RepairOrderInfo) => {
      return row.customer ? `${row.customer.contact || '-'} / ${row.customer.phone || '-'}` : '-';
    }
  },

  {
    title: `${t('menu.vehicle.brand')}/${t('menu.vehicle.model')}`,
    key: 'vehicleBrandModel',
    width: 150,
    render: (row: Api.RepairOrder.RepairOrderInfo) => {
      return row.vehicle ? h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }
        },
        [
          h('img', {
            src: `/src/assets/imgs/brand/${row.vehicle.brand.toLowerCase()}.png`,
            style: {
              width: '24px',
              height: '24px',
              objectFit: 'contain'
            },
            alt: row.vehicle.brand
          }),
          `${row.vehicle.brand || '-'}/${row.vehicle.model || '-'}`
        ]
      ) : '-';
    }
  },
  {
    title: `${t('menu.vehicle.color')}/${t('menu.vehicle.engineNo')}`,
    key: 'vehicleColor',
    width: 160,
    render: (row: Api.RepairOrder.RepairOrderInfo) => {
      return row.vehicle ? `${row.vehicle.color || '-'}/${row.vehicle.engineNo || '-'}` : '-';
    }
  },
  {
    title: t('menu.vehicle.mileage'),
    key: 'vehicleMileage',
    width: 100,
    render: (row: Api.RepairOrder.RepairOrderInfo) => {
      return row.vehicle?.mileage ? `${row.vehicle.mileage}${t('common.unit.kilometer')}` : '-';
    }
  },

  { title: t('menu.repairOrder.faultDesc'), key: 'faultDesc', width: 150 },
  { title: t('common.remark'), key: 'remark', width: 150 },
  { title: t('menu.repairOrder.mechanic'), key: 'mechanic', width: 100, render: (row: Api.RepairOrder.RepairOrderInfo<Api.RepairOrder.MechanicInfo>) => {
    return row.mechanic ? `${row.mechanic.name || '-'}` : '-';
  } },
  {
    title: t('menu.repairOrder.inDate'),
    key: 'inDate',
    width: 120,
    render: (row) => {
      return dayjs(row.inDate).format('YYYY-MM-DD');
    }
  },
  {
    title: t('menu.repairOrder.estimatedTime'),
    key: 'estimatedCompletionDate',
    width: 150,
    render: (row: Api.RepairOrder.RepairOrderInfo) => {
      return row.estimatedCompletionDate
        ? dayjs(row.estimatedCompletionDate).format('YYYY-MM-DD')
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
          h(
            NButton,
            {
              size: 'small',
              ghost: true,
              onClick: () => handleView(row as any)
            },
            { default: () => t('common.view') }
          ),
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
  apiFn: fetchRepairOrderList as any,
  columns: () => columns.value as any,
  apiParams: searchModel,
  immediate: true,
  showTotal: true
});

const showDetail = ref(false);
const currentOrder = ref(null);


function handleSearch() {
  updateSearchParams(searchModel as Partial<Api.Common.CommonSearchParams>);
  pagination.page = 1;
  getData();
}

async function handleReset() {
  Object.assign(searchModel, {
    orderNo: '',
    customerName: '',
    licensePlate: ''
  });
  updateSearchParams(searchModel as Partial<Api.Common.CommonSearchParams>);
  nextTick(() => {
    console.log('reset', searchModel);
    getData();
  });
}

function handleRefresh() {
  getData();
}

function handleView(row: Api.RepairOrder.RepairOrderInfo<Api.RepairOrder.MechanicInfo>) {
  currentOrder.value = row;
  showDetail.value = true;
}

const scrollX = computed(() => {
  return tableColumns.value.reduce((acc, col) => acc + Number(col.width || 0), 0);
});


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
        remote
        :scroll-x="scrollX"
        :style="{ maxWidth: '100%' }"
        :row-key="(row: Api.RepairOrder.RepairOrderInfo) => row._id"
        @update:page="getData"
      />
    </NCard>

    <RepairOrderDetail
      v-model:show="showDetail"
      :edit-data="currentOrder"
    />
  </div>
</template>
