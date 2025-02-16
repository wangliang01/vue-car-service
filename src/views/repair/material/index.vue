<script setup lang="ts">
import { reactive, h, ref, nextTick } from 'vue';
import { NButton, NSpace, NCard, NDataTable, NTag } from 'naive-ui';
import { useTable } from '@/hooks/common/table';
import { useI18n } from 'vue-i18n';
import MaterialSearch from './components/search.vue';
import MaterialModal from './components/form.vue';
import { fetchMaterialList, updateMaterialStatus } from '@/service/api/material';

defineOptions({ name: 'MaterialList' });

const { t } = useI18n();

const searchModel = reactive<Api.Material.SearchParams>({
  name: '',
  code: '',
  category: null,
  isActive: null,
  current: 1,
  size: 10
});

const columns = ref([
  { title: t('common.index'), key: 'index', width: 60 },
  { title: t('material.name'), key: 'name', width: 120 },
  { title: t('material.code'), key: 'code', width: 100 },
  { title: t('material.category'), key: 'category', width: 100 },
  { title: t('material.specification'), key: 'specification', width: 120 },
  { title: t('material.unit'), key: 'unit', width: 80 },
  {
    title: t('material.purchasePrice'),
    key: 'purchasePrice',
    width: 120,
    render: (row: Api.Material.MaterialInfo) => {
      return h('div', { class: 'flex-y-center' }, [
        h('div', { class: 'text-14px font-medium text-green-500' }, `¥${row.purchasePrice}`)
      ]);
    }
  },
  {
    title: t('material.sellingPrice'),
    key: 'sellingPrice',
    width: 120,
    render: (row: Api.Material.MaterialInfo) => {
      return h('div', { class: 'flex-y-center' }, [
        h('div', { class: 'text-14px font-medium text-orange-500' }, `¥${row.sellingPrice}`)
      ]);
    }
  },
  {
    title: t('material.status'),
    key: 'status',
    width: 80,
    render: (row: Api.Material.MaterialInfo) => {
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
    width: 200,
    render: (row: Api.Material.MaterialInfo) => {
      return h(NSpace, { justify: 'start' }, {
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
  apiFn: fetchMaterialList as any,
  columns: () => columns.value as any,
  apiParams: searchModel,
  immediate: true,
  showTotal: true
});

const showModal = ref(false);
const modalType = ref<'add' | 'edit'>('add');
const editData = ref<Api.Material.MaterialInfo | null>(null);

function handleAdd() {
  modalType.value = 'add';
  showModal.value = true;
}

function handleEdit(row: Api.Material.MaterialInfo) {
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
    code: '',
    category: null,
    isActive: null,
    current: 1,
    size: 10
  });
  updateSearchParams(searchModel);
  getData();
}

function handleModalClose() {
  editData.value = null;
}

function handleModalSuccess() {
  showModal.value = false;
  getData();
}

async function handleToggleStatus(row: Api.Material.MaterialInfo) {
  try {
    await updateMaterialStatus(row._id, { isActive: !row.isActive });
    window.$message?.success(t('common.success'));
    getData();
  } catch (error) {
    window.$message?.error(t('common.error'));
  }
}
</script>

<template>
  <div class="h-full">
    <MaterialSearch
      :search-model="searchModel"
      @search="handleSearch"
      @reset="handleReset"
    />
    <NCard :bordered="false" class="mt-4">
      <template #header>
        <div class="flex-y-center justify-between">
          <span class="text-16px font-medium">{{ t('material.list') }}</span>
          <NButton type="primary" @click="handleAdd" ghost>
            <template #icon>
              <div class="i-material-symbols:add text-16px flex-center" />
              </template>
              <span class="flex-center">{{ t('common.add') }}</span>
            </NButton>
        </div>
      </template>

      <NDataTable
        :loading="loading"
        :columns="tableColumns"
        :data="dataList"
        :pagination="pagination"
        @update:page="getData"
        remote
      />
    </NCard>

    <MaterialModal
      v-model:show="showModal"
      :type="modalType"
      :edit-data="editData"
      @close="handleModalClose"
      @success="handleModalSuccess"
    />
  </div>
</template>
