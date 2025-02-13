<script setup lang="ts">
import { ref, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NSpace, NButton, NInput, NDataTable, NPopconfirm, useMessage } from 'naive-ui';
import { getInventoryList, createInventory, adjustInventory } from '@/service/api/inventory';
import { formatDate } from '@/utils/common';
import InventoryForm from './components/form.vue';
import InventorySearch from './components/search.vue';
const { t } = useI18n();
const message = useMessage();
const tableRef = ref(null);
const loading = ref(false);
const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40]
});

const handlePageChange = (page: number) => {
  pagination.value.page = page;
  loadData();
};

const handlePageSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize;
  loadData();
};

const showModal = ref(false);
const editData = ref<Api.Inventory.InventoryItem | null>(null);

const openModal = (data?: Api.Inventory.InventoryItem) => {
  editData.value = data || null;
  console.log('editData', editData.value);
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editData.value = null;
};

const searchModel = ref<Api.Inventory.SearchParams>({
  code: '',
  name: '',
  category: '',
  supplier: '',
  page: 1,
  size: 10
});

const columns = [
  { title: '材料编号', key: 'code', width: '100px', render: (row: Api.Inventory.InventoryItem) => row.material.code },
  { title: '材料名称', key: 'name', width: '100px', render: (row: Api.Inventory.InventoryItem) => row.material.name },
  { title: '类别', key: 'category', width: '100px', render: (row: Api.Inventory.InventoryItem) => row.material.category },
  { title: '库存数量', key: 'quantity', width: '100px' },
  { title: '单位', key: 'unit', width: '100px', render: (row: Api.Inventory.InventoryItem) => row.material.unit },
  { title: '采购单价', key: 'purchasePrice', width: '100px', render: (row: Api.Inventory.InventoryItem) => row.material.purchasePrice },
  { title: '销售单价', key: 'sellingPrice', width: '100px', render: (row: Api.Inventory.InventoryItem) => row.material.sellingPrice },
  { title: '供应商', key: 'supplier', width: '160px', render: (row: Api.Inventory.InventoryItem) => {
    const { name, contact, phone } = row.material.supplier;
    return h('div', {}, [
      h('div', {}, name),
      h('div', {}, contact + ' ' + phone)
    ]);
  } },
  { title: '备注', key: 'remarks', width: '120px' },
  { title: '创建时间', key: 'createTime', width: '180px', render: (row: Api.Inventory.InventoryItem) => formatDate(row.createTime) },
  { title: '更新时间', key: 'updateTime', width: '180px', render: (row: Api.Inventory.InventoryItem) => formatDate(row.updateTime) },
  {
    title: '操作',
    key: 'actions',
    width: '180px',
    fixed: 'right' as const,
    render: (row: Api.Inventory.InventoryItem) => {
      return h(NSpace, {}, {
        default: () => [
          h(NButton, {
            size: 'small',
            type: 'primary',
            ghost: true,
            onClick: () => handleEdit(row)
          }, { default: () => '编辑' }),
        ]
      });
    }
  }
];

const data = ref<Api.Inventory.InventoryItem[]>([]);

const handleAdd = () => {
  openModal();
};

const handleRefresh = () => {
  loadData();
};

// 获取数据
const loadData = async () => {
  loading.value = true;
  try {
    data.value = [];
    const params = {
      ...searchModel.value,
      page: pagination.value.page,
      size: pagination.value.pageSize
    };
    const res = await getInventoryList(params);
    data.value = res.data.records;
    pagination.value.itemCount = res.data.total;
  } catch (error) {
    message.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 编辑记录
const handleEdit = (row: Api.Inventory.InventoryItem) => {
  openModal(row);
};

// 处理表单提交
const handleFormSubmit = async (formData: Api.Inventory.CreateInventoryParams) => {
  loading.value = true;
  try {
    if (editData.value) {
      const updateParams: Api.Inventory.UpdateInventoryParams = {
        quantity: formData.quantity,
        remarks: formData.remarks,
        alertThreshold: formData.alertThreshold,
        maxQuantity: formData.maxQuantity
      };
      await adjustInventory(editData.value._id, updateParams);
      message.success('编辑成功');
    } else {
      await createInventory(formData);
      message.success('新增成功');
    }
    closeModal();
    await loadData();
  } catch (error) {
    message.error(editData.value ? '编辑失败' : '新增失败');
  } finally {
    loading.value = false;
  }
};

// 处理搜索
const handleSearch = () => {
  pagination.value.page = 1;
  console.log('search', searchModel.value);
  loadData();
};

// 处理重置
const handleReset = () => {
  searchModel.value = {
    code: '',
    name: '',
    category: '',
    supplier: '',
    minQuantity: undefined,
    maxQuantity: undefined,
    minPrice: undefined,
    maxPrice: undefined
  };
  pagination.value.page = 1;
  loadData();
};

// 初始加载
loadData();
</script>

<template>
  <div class="p-4">
    <InventorySearch
      v-model:model="searchModel"
      @search="handleSearch"
      @reset="handleReset"
    />

    <NCard class="mt-4">
      <template #header>
        <div class="flex-y-center justify-between">
          <div class="flex-y-center">
            <span class="text-16px font-medium">{{ t("menu.inventory.list") }}</span>
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
      <NSpace vertical :size="16">
        <NDataTable
          ref="tableRef"
          :loading="loading"
          :columns="columns"
          :data="data"
          :pagination="pagination"
          x-scroll="1000"
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
        />
      </NSpace>
    </NCard>

    <InventoryForm
      v-model:show="showModal"
      :edit-data="editData"
      @submit="handleFormSubmit"
    />
  </div>
</template>
