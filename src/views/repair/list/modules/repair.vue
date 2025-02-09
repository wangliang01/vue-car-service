<script setup lang="ts">
import { ref, computed, watch, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NInputNumber, NSpace, NButton, NDatePicker, NSelect, NDivider, NGrid, NGridItem, NDataTable } from 'naive-ui';
import type { FormInst, SelectOption } from 'naive-ui';
import { fetchRepairItemList } from '@/service/api/repair-item';
import { fetchMaterialList } from '@/service/api/material';
import { getTechnicianList } from '@/service/api/technician';

const { t } = useI18n();
const formRef = ref<FormInst | null>(null);

const show = defineModel<boolean>('show');
const loading = defineModel<boolean>('loading', { default: false });

// 维修项目选项
const repairItemOptions = ref<SelectOption[]>([]);
// 材料选项
const materialOptions = ref<SelectOption[]>([]);
// 维修技师选项
const mechanicOptions = ref<SelectOption[]>([]);

// 获取维修项目列表
const fetchRepairItems = async () => {
  try {
    const res = await fetchRepairItemList({});
    repairItemOptions.value = res.data.records.map(item => ({
      label: item.name,
      value: item._id,
      data: item
    }));
  } catch (error) {
    console.error('获取维修项目失败:', error);
  }
};

// 获取材料列表
const fetchMaterials = async () => {
  try {
    const res = await fetchMaterialList({});
    materialOptions.value = res.data.records.map(item => ({
      ...item,
      label: item.name,
      value: item._id,
      data: item
    }));

    console.log("materialOptions", materialOptions.value);
  } catch (error) {
    console.error('获取材料列表失败:', error);
  }
};

// 获取维修技师列表
const fetchMechanics = async () => {
  const res = await getTechnicianList({});
  mechanicOptions.value = res.data.records.map(item => ({
    label: item.name,
    value: item._id,
    data: item
  }));
};

interface RepairPart {
  materialId: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  managementFee: number;
  managementDiscount: number;
}

interface RepairItem {
  repairItemId: string;
  name: string;
  laborHours: number;
  laborPrice: number;
  complexityFactor: number;
  laborDiscount: number;
  parts: RepairPart[];
}

const model = ref<{
  repairItems: RepairItem[];
  estimatedCompletionDate: number | null;
  mechanic: string;
}>({
  repairItems: [],
  estimatedCompletionDate: null,
  mechanic: null
});

const rules = {
  repairItems: {
    type: 'array',
    required: true,
    message: t('repairOrder.repair.atLeastOneItem'),
    trigger: ['blur', 'change']
  },
  estimatedCompletionDate: {
    required: false,
    message: t('repairOrder.repair.estimatedTimeRequired')
  },
  mechanic: {
    required: true,
    message: t('repairOrder.repair.mechanicRequired')
  }
};

const emit = defineEmits(['submit']);

// 添加维修项目
function addRepairItem() {
  model.value.repairItems.push({
    repairItemId: '',
    name: '',
    laborHours: 0,
    laborPrice: 0,
    complexityFactor: 1,
    laborDiscount: 0,
    parts: []
  });
}

// 删除维修项目
function removeRepairItem(index: number) {
  model.value.repairItems.splice(index, 1);
}

// 添加配件
function addPart(repairItemIndex: number) {
  model.value.repairItems[repairItemIndex].parts.push({
    materialId: '',
    name: '',
    quantity: 1,
    purchasePrice: 0,
    managementFee: 0.1,
    managementDiscount: 0
  });
}

// 删除配件
function removePart(repairItemIndex: number, partIndex: number) {
  model.value.repairItems[repairItemIndex].parts.splice(partIndex, 1);
}

// 选择维修项目
function handleRepairItemSelect(repairItemId: string, index: number) {
  const selectedItem = repairItemOptions.value.find(item => item.value === repairItemId);
  if (selectedItem?.data) {
    const item = selectedItem.data;
    model.value.repairItems[index] = {
      ...model.value.repairItems[index],
      repairItemId: item._id,
      name: item.name,
      laborHours: item.laborHours,
      laborPrice: item.laborPrice,
      complexityFactor: item.complexityFactor,
      laborDiscount: item.laborDiscountRate
    };
  }
}

// 选择材料
function handleMaterialSelect(materialId: string, repairIndex: number, partIndex: number) {
  const selectedMaterial = materialOptions.value.find(item => item.value === materialId);
  if (selectedMaterial?.data) {
    const material = selectedMaterial.data;
    model.value.repairItems[repairIndex].parts[partIndex] = {
      ...model.value.repairItems[repairIndex].parts[partIndex],
      materialId: material._id,
      name: material.name,
      purchasePrice: material.purchasePrice,
      managementFee: material.managementFeeRate,
      managementDiscount: 0
    };
  }
}

// 计算工时费
const laborAmount = computed(() => {
  return model.value.repairItems.reduce((total, item) => {
    const amount = item.laborHours * item.laborPrice * item.complexityFactor;
    return total + amount * (1 - item.laborDiscount);
  }, 0);
});

// 计算配件费
const partsAmount = computed(() => {
  return model.value.repairItems.reduce((total, item) => {
    return total + item.parts.reduce((partTotal, part) => {
      const managementAmount = part.purchasePrice * part.managementFee;
      const finalManagementAmount = managementAmount * (1 - part.managementDiscount);
      return partTotal + (part.purchasePrice + finalManagementAmount) * part.quantity;
    }, 0);
  }, 0);
});

// 总金额
const totalAmount = computed(() => {
  return laborAmount.value + partsAmount.value;
});

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    emit('submit', model.value);
  } catch (err) {
    // 表单验证失败
  }
}

// 初始化数据
async function init() {
  await Promise.all([fetchRepairItems(), fetchMaterials(), fetchMechanics()]);
  addRepairItem(); // 默认添加一个维修项目
}

// 监听显示状态
watch(() => show.value, (newVal) => {
  if (newVal) {
    init();
  } else {
    model.value = {
      repairItems: [],
      estimatedCompletionDate: null,
      mechanic: null
    };
  }
});

// 处理折扣率变化
function handleDiscountChange(value: number | null, index: number) {
  if (value !== null) {
    model.value.repairItems[index].laborDiscount = value / 100;
  }
}

// 配件表格列定义
function partsColumns(repairIndex: number) {
  return [
    {
      title: t('repairOrder.repair.partName'),
      key: 'materialId',
      width: 140,
      render: (row: RepairPart, index: number) => {
        return h(NSelect, {
          value: row.materialId,
          options: materialOptions.value,
          filterable: true,
          clearable: true,
          style: 'width: 140px',
          onUpdateValue: (value: string) => handleMaterialSelect(value, repairIndex, index)
        });
      }
    },
    {
      title: t('repairOrder.repair.quantity'),
      key: 'quantity',
      width: 120,
      render: (row: RepairPart) => {
        return h(NInputNumber, {
          value: row.quantity,
          min: 1,
          precision: 0,
          showButton: false,
          'onUpdate:value': (value: number) => row.quantity = value
        });
      }
    },
    {
      title: t('repairOrder.repair.purchasePrice'),
      key: 'purchasePrice',
      width: 120,
      render: (row: RepairPart) => {
        return h(NInputNumber, {
          value: row.purchasePrice,
          disabled: true,
          prefix: '￥',
          showButton: false
        }, {
          prefix: () => h('span', { style: 'color: var(--n-text-color-disabled)' }, '￥')
        });
      }
    },
    {
      title: t('repairOrder.repair.managementFee'),
      key: 'managementFee',
      width: 120,
      render: (row: RepairPart) => {
        return h(NInputNumber, {
          value: row.managementFee * 100,
          disabled: true,
          suffix: '%',
          showButton: false
        }, {
          suffix: () => h('span', { style: 'color: var(--n-text-color-disabled)' }, '%')
        });
      }
    },
    {
      title: t('repairOrder.repair.managementDiscount'),
      key: 'managementDiscount',
      width: 120,
      render: (row: RepairPart, index: number) => {
        return h(NInputNumber, {
          value: row.managementDiscount * 100,
          min: 0,
          max: 100,
          precision: 0,
          suffix: '%',
          showButton: false,
          'onUpdate:value': (value: number) => {
            if (value !== null) {
              row.managementDiscount = value / 100;
            }
          }
        }, {
          suffix: () => h('span', { style: 'color: var(--n-text-color-disabled)' }, '%')
        });
      }
    },
    {
      title: t('common.action'),
      key: 'actions',
      width: 80,
      render: (_, index: number) => {
        return h(NButton, {
          text: true,
          type: 'error',
          onClick: () => removePart(repairIndex, index)
        }, {
          icon: () => h('div', { class: 'i-material-symbols:delete' })
        });
      }
    }
  ];
}
</script>

<template>
  <NDrawer v-model:show="show" :width="1080">
    <NDrawerContent :title="t('repairOrder.repair.action')" :native-scrollbar="false">
      <NButton class="mt-4" @click="addRepairItem" type="primary">
        <template #icon>
          <div class="i-material-symbols:add" />
        </template>
        {{ t('repairOrder.repair.addItem') }}
      </NButton>
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="120" class="mt-4">
        <div v-for="(repairItem, repairIndex) in model.repairItems" :key="repairIndex" class="repair-item mb-4">
          <div class="repair-item-header">
            <span class="repair-item-title">{{ t('repairOrder.repair.items') }} #{{ repairIndex + 1 }}</span>
            <NButton type="error" @click="removeRepairItem(repairIndex)" ghost>
              <template #icon>
                <div class="i-material-symbols:delete" />
              </template>
              {{ t('common.delete') }}
            </NButton>
          </div>

          <!-- 维修项目选择 -->
          <NFormItem :label="t('repairOrder.repair.itemName')" :path="`repairItems[${repairIndex}].repairItemId`">
            <NSelect v-model:value="repairItem.repairItemId" :options="repairItemOptions" filterable clearable
              @update:value="value => handleRepairItemSelect(value, repairIndex)" />
          </NFormItem>

          <!-- 维修项目信息 -->
          <NGrid :cols="2" :x-gap="24" v-if="repairItem.repairItemId">
            <NGridItem>
              <NFormItem :label="t('repairOrder.repair.laborHours')">
                <NInputNumber v-model:value="repairItem.laborHours" :min="0" :precision="1" :show-button="false">

                </NInputNumber>
              </NFormItem>
            </NGridItem>

            <NGridItem>
              <NFormItem :label="t('repairOrder.repair.laborPrice')">
                <NInputNumber v-model:value="repairItem.laborPrice" :min="0" :show-button="false">
                  <template #prefix>
                    ￥
                  </template>
                </NInputNumber>
              </NFormItem>
            </NGridItem>

            <NGridItem>
              <NFormItem :label="t('repairOrder.repair.complexityFactor')">
                <NInputNumber v-model:value="repairItem.complexityFactor" :min="0" :precision="1" :step="0.1"
                  :show-button="false" />
              </NFormItem>
            </NGridItem>

            <NGridItem>
              <NFormItem :label="t('repairOrder.repair.laborDiscount')">
                <NInputNumber v-model:value="repairItem.laborDiscount" :min="0" :max="100" :precision="0" :step="1"
                  :format="value => value * 100 + ''" @update:value="value => handleDiscountChange(value, repairIndex)"
                  :show-button="false">

                  <template #suffix>
                    %
                  </template>
                </NInputNumber>
              </NFormItem>
            </NGridItem>
          </NGrid>

          <!-- 配件列表 -->
          <NFormItem :label="t('repairOrder.repair.parts')">
            <div class="bg-white rounded-md p-2 w-full">
              <NDataTable :columns="partsColumns(repairIndex)" :data="repairItem.parts" class="w-full"
                :pagination="false" v-if="repairItem.parts.length > 0" :bordered="false" />
              <NButton class="parts-add-btn w-full block" @click="addPart(repairIndex)" ghost type="primary">
                <template #icon>
                  <div class="i-material-symbols:add" />
                </template>
                {{ t('common.add') }}{{ t('repairOrder.repair.parts') }}
              </NButton>
            </div>
          </NFormItem>
        </div>



        <NDivider />

        <!-- 预计完工时间和维修技师 -->
        <NFormItem :label="t('repairOrder.repair.mechanic')" path="mechanic">
          <NSelect v-model:value="model.mechanic" filterable clearable :options="mechanicOptions" />
        </NFormItem>
        <NFormItem :label="t('repairOrder.repair.estimatedTime')" path="estimatedCompletionDate">
          <NDatePicker v-model:value="model.estimatedCompletionDate" style="width: 100%;" type="date" clearable
            :is-date-disabled="(ts: number) => ts < Date.now()" />
        </NFormItem>


      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="show = false">
            {{ t('common.cancel') }}
          </NButton>
          <NButton type="primary" :loading="loading" @click="handleSubmit">
            {{ t('common.confirm') }}
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.repair-item {
  padding: 16px;
  margin-bottom: 16px;
  background-color: rgba(239, 239, 245, 0.7);
  border-radius: 3px;
  border: 1px solid var(--n-border-color);
}

.repair-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--n-border-color);
}

.repair-item-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--n-text-color);
}

.parts-list {
  margin: 16px 0;
  padding: 16px;
  background-color: var(--n-card-color);
  border-radius: 3px;
}

.parts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.part-item {
  padding: 16px;
  margin-bottom: 16px;
  border: 1px dashed var(--n-border-color);
  border-radius: 3px;
}

.amount-summary {
  padding: 16px;
  background-color: var(--n-card-color);
  border-radius: 3px;
}

.amount-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.amount-item.total {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--n-border-color);
  font-weight: bold;
}

.amount {
  color: var(--n-text-color-success);
}

.parts-add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: var(--n-text-color-primary);
  border: 1px dashed var(--n-border-color);
  border-top: none;
  cursor: pointer;
  transition: color .3s var(--n-bezier);
}

.parts-add-btn:hover {
  color: var(--n-primary-color);
}
</style>
