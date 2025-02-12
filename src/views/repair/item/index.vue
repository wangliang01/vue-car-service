<script setup lang="ts">
import { reactive, h, ref } from 'vue';
import { NButton, NSpace, NCard, NDataTable, NTag } from 'naive-ui';
import { useTable } from '@/hooks/common/table';
import { useI18n } from 'vue-i18n';
import RepairItemSearch from './components/search.vue';
import RepairItemModal from './components/form.vue';
import { fetchRepairItemList, updateRepairItemStatus } from '@/service/api/repair-item';

defineOptions({ name: 'RepairItemList' });

const { t } = useI18n();


const searchModel = reactive<Api.RepairItem.SearchParams>({
  name: '',
  isActive: true,
  current: 1,
  size: 10
});

const columns = ref([
  { title: t('common.index'), key: 'index', width: 60 },
  { title: t('repairItem.name'), key: 'name', width: 150 },
  { title: t('repairItem.laborHours'), key: 'laborHours', width: 100 },
  { title: t('repairItem.laborPrice'), key: 'laborPrice', width: 100 },
  { title: t('repairItem.complexityFactor'), key: 'complexityFactor', width: 100 },
  { title: t('common.remark'), key: 'description', width: 150 },
  {
    title: t('repairItem.isActive'),
    key: 'isActive',
    width: 80,
    render: (row: Api.RepairItem.RepairItemInfo) => {
      return h(
        NTag,
        {
          type: row.isActive ? 'success' : 'error',
          round: true,
          bordered: false
        },
        { default: () => t(row.isActive ? 'common.status.enable' : 'common.status.disable') }
      );
    }
  },
  {
    title: t('common.action'),
    key: 'actions',
    fixed: 'right',
    width: 120,
    render: (row: Api.RepairItem.RepairItemInfo) => {
      return h(NSpace, { }, {
        default: () => [
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
              type: row.isActive ? 'error' : 'success',
              ghost: true,
              onClick: () => handleToggleStatus(row)
            },
            { default: () => t(row.isActive ? 'common.status.disable' : 'common.status.enable') }
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
  updateSearchParams
} = useTable({
  apiFn: fetchRepairItemList,
  columns: () => columns.value as any,
  apiParams: searchModel
});

const showModal = ref(false);
const modalType = ref<'add' | 'edit'>('add');
const editData = ref<Api.RepairItem.RepairItemInfo | null>(null);

function handleAdd() {
  modalType.value = 'add';
  editData.value = null;
  showModal.value = true;
}

function handleEdit(row: Api.RepairItem.RepairItemInfo) {
  modalType.value = 'edit';
  editData.value = row;
  showModal.value = true;
}

function handleSearch() {
  updateSearchParams(searchModel);
  pagination.page = 1;
  getData();
}

function handleReset() {
  Object.assign(searchModel, {
    name: '',
    isActive: true,
    current: 1,
    size: 10
  });
  updateSearchParams(searchModel);
  getData();
}

async function handleToggleStatus(row: Api.RepairItem.RepairItemInfo) {
  try {
    await updateRepairItemStatus(row._id, { isActive: !row.isActive });
    window.$message?.success(t('common.success'));
    getData();
  } catch (error) {
    window.$message?.error(t('common.error'));
  }
}

function handleModalClose() {
  editData.value = null;
}

function handleModalSuccess() {
  showModal.value = false;
  getData();
}
</script>

<template>
  <div class="h-full">
    <RepairItemSearch
      v-model="searchModel"
      @search="handleSearch"
      @reset="handleReset"
    />
    <NCard :bordered="false" class="mt-4">
      <template #header>
        <div class="flex-y-center justify-between">
          <span class="text-16px font-medium">{{ t('repairItem.list') }}</span>
          <NButton type="primary" @click="handleAdd">
            <template #icon>
              <div class="i-material-symbols:add text-16px" />
            </template>
            {{ t('common.add') }}
          </NButton>
        </div>
      </template>

      <NDataTable
        :loading="loading"
        :columns="tableColumns"
        :data="dataList"
        :pagination="pagination"
        @update:page="getData"
      />
    </NCard>

    <RepairItemModal
      v-model:show="showModal"
      :type="modalType"
      :edit-data="editData"
      @close="handleModalClose"
      @success="handleModalSuccess"
    />
  </div>
</template>
