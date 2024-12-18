<script setup lang="ts">
import { reactive, h, ref, computed } from 'vue';
import { NButton, NSpace, NCard, NDataTable, NSelect, useDialog, useMessage, NDrawer } from 'naive-ui';
import { useTable } from '@/hooks/common/table';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/store/modules/app';
import {
  fetchVehicleList,
  fetchDeleteVehicle,
  fetchExportVehicle,
  fetchVehicleBrands,
  fetchVehicleModels,
  fetchDeleteVehicleBatch
} from '@/service/api/vehicle';
import VehicleSearch from './modules/search.vue';
import VehicleForm from './modules/form.vue';
import { BRAND_LOGOS, DEFAULT_BRAND_LOGO, getBrandLogo, getBrandLabel } from '@/constants/brand';

defineOptions({ name: 'VehicleList' });
const { t } = useI18n();

const searchModel = reactive<Api.Vehicle.VehicleSearchParams>({
  customerId: '',
  brand: '',
  model: '',
  licensePlate: ''
});

const appStore = useAppStore();

const columns = computed(() => [
  { type: 'selection' as const },
  { title: t('common.index'), key: 'index', width: 80 },
  
  { 
    title: t('menu.vehicle.brand'), 
    key: 'brand', 
    width: 120,
    render: (row: Api.Vehicle.VehicleInfo) => {
      return h(NSpace, { align: 'center' }, () => [
        h('img', {
          src: getBrandLogo(row.brand),
          alt: row.brand,
          style: {
            width: '24px',
            height: '24px',
            objectFit: 'contain'
          }
        }),
        h('span', null, row.brand)
      ]);
    }
  },
  { title: t('menu.vehicle.model'), key: 'model', width: 120 },
  { 
    title: t('menu.customer.name'), 
    key: 'customer', 
    width: 120,
    render: (row: Api.Vehicle.VehicleInfo) => {
      return row.customer?.name || '-';
    }
  },
  { title: t('menu.vehicle.year'), key: 'year', width: 100 },
  { title: t('menu.vehicle.licensePlate'), key: 'licensePlate', width: 120 },
  { title: t('menu.vehicle.vin'), key: 'vin', width: 180 },
  { 
    title: t('menu.vehicle.mileage'), 
    key: 'mileage', 
    width: 120, 
    render: (row: Api.Vehicle.VehicleInfo) => `${row.mileage}${t('common.unit.kilometer')}` 
  },
  {
    title: t('common.action'),
    key: 'actions',
    width: 160,
    fixed: 'right',
    render: (row: Api.Vehicle.VehicleInfo) => {
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
]);

const checkedRowKeys = ref<string[]>([]);
const brands = ref<string[]>([]);
const models = ref<string[]>([]);

const {
  loading,
  data: dataList,
  pagination,
  getData,
  columns: tableColumns,
  updateSearchParams,
  resetSearchParams
} = useTable({
  apiFn: fetchVehicleList,
  columns: () => columns.value,
  apiParams: {
    customerId: '',
    brand: '',
    model: '',
    licensePlate: ''
  },
  immediate: true,
  rowKey: '_id'
});

const showDrawer = ref(false);
const drawerType = ref<'add' | 'edit'>('add');
const editData = ref<Api.Vehicle.VehicleInfo>();

const $dialog = useDialog();
const $message = useMessage();

const handleEdit = (row: Api.Vehicle.VehicleInfo) => {
  // Open the drawer for editing
  showDrawer.value = true;
  drawerType.value = 'edit';
  editData.value = row;
};

const handleDelete = async (row: Api.Vehicle.VehicleInfo) => {
  try {
    await $dialog.warning({
      title: t('common.warning'),
      content: t('common.confirmDelete', { name:  row.licensePlate }),
      positiveText: t('common.confirm'),
      negativeText: t('common.cancel'),
      onPositiveClick: async () => {
        if (!row._id) {
          return;
        }
        await fetchDeleteVehicle(row._id);
        $message.success(t('common.deleteSuccess'));
        getData();
      }
    });
  } catch (error) {
    console.error('Delete failed:', error);
  }
};

const exporting = ref(false);

// Add handleSearch method
const handleSearch = () => {
  updateSearchParams(searchModel);
  pagination.page = 1;
  getData();
};

// 获取品牌列表
async function getBrands() {
  try {
    const { data } = await fetchVehicleBrands();
    brands.value = data;
  } catch (error) {
    console.error('Failed to fetch brands:', error);
  }
}

// 获取车型列表
async function getModels(brand: string) {
  try {
    const { data } = await fetchVehicleModels(brand);
    models.value = data;
  } catch (error) {
    console.error('Failed to fetch models:', error);
    models.value = [];
  }
}

// 重置搜索条件的方法
const handleReset = () => {
   // 重置 searchModel
   Object.assign(searchModel, {
    customerId: '',
    brand: '',
    model: '',
    licensePlate: ''
  });
  resetSearchParams();
  models.value = [];
  pagination.page = 1;
  getData();
};

// 添加 handleAdd 方法
const handleAdd = () => {
  showDrawer.value = true;
  drawerType.value = 'add';
  editData.value = {
    _id: '',
    customerId: '',
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    vin: '',
    mileage: '',
    createdAt: '',
    updatedAt: ''
  };
};

const handleBatchDelete = async () => {
  if (!checkedRowKeys.value.length) {
    $message.warning(t('common.pleaseCheckValue'));
    return;
  }
  try {
    await $dialog.warning({
      title: t('common.warning'),
      content: t('common.batchDeleteConfirm', { count: checkedRowKeys.value.length }),
      positiveText: t('common.confirm'),
      negativeText: t('common.cancel'),
      onPositiveClick: async () => {
        await fetchDeleteVehicleBatch({ ids: checkedRowKeys.value });
        $message.success(t('common.deleteSuccess'));
        checkedRowKeys.value = [];
        getData();
      }
    });
  } catch (error) {
    console.error('批量删除失败:', error);
    $message.error(t('common.error')); 
  }
};

const handleRefresh = () => {
  getData();
};

// 导出函数
async function handleExport() {
  if (exporting.value) return;

  exporting.value = true;
  try {
    const {data:blob}= await fetchExportVehicle(searchModel);

    console.log(blob);

    if(blob instanceof Blob) {
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `车辆列表_${new Date().toLocaleDateString()}.xlsx`;
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

const handleSubmitSuccess = () => {
  showDrawer.value = false;
  getData();
  $message.success(drawerType.value === 'add' ? t('common.addSuccess') : t('common.updateSuccess'));
};

// 初始化加载品牌列表
getBrands();
</script>

<template>
  <div class="h-full">
    <VehicleSearch
      v-model:searchModel="searchModel"
      :brands="brands"
      :models="models"
      @search="handleSearch"
      @reset="handleReset"
      @brand-change="getModels"
    />
    <NCard :bordered="false" class="flex-1">
      <template #header>
        <div class="flex-y-center justify-between">
          <div class="flex-y-center">
            <span class="text-16px font-medium">{{ t("menu.vehicle.list") }}</span>
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
        :row-key="(row: Api.Vehicle.VehicleInfo) => row._id"
        @update:checked-row-keys="checkedRowKeys = $event"
        @update:page="getData"
      />
    </NCard>
    <VehicleForm
      v-model:show="showDrawer"
      :type="drawerType"
      :edit-data="editData"
      :brands="brands"
      :models="models"
      @submit-success="handleSubmitSuccess"
      @brand-change="getModels"
    />
  </div>
</template>

<style scoped>
.h-full {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
