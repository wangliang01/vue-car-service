<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NInputNumber, NSelect, NSpace, NButton } from 'naive-ui';
import type { FormInst } from 'naive-ui';
import { fetchMaterialList } from '@/service/api/material';
import { createStockIn } from '@/service/api/inventory';

defineOptions({ name: 'StockInForm' });

interface Props {
  loading?: boolean;
  formData?: Partial<Api.Inventory.CreateStockInParams> | null;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  formData: null
});

interface Emits {
  (e: 'update:show', value: boolean): void;
  (e: 'success'): void;
}

const emit = defineEmits<Emits>();
const { t } = useI18n();
const formRef = ref<FormInst | null>(null);

const show = defineModel<boolean>('show', {
  type: Boolean,
  default: false
});

const model = ref<Api.Inventory.CreateStockInParams>({
  materialId: null,
  quantity: null,
  unitPrice: null,
  supplier: null,
  remarks: ''
});

const materialOptions = ref<{ label: string; value: string; material: any }[]>([]);
const selectedMaterial = ref<any>(null);

// 获取物料列表
const fetchMaterialOptions = async () => {
  try {
    const res = await fetchMaterialList({});
    materialOptions.value = res.data.records.map(item => ({
      label: item.name,
      value: item._id,
      material: item
    }));
  } catch (error) {
    console.error('获取物料列表失败:', error);
  }
};

// 表单校验规则
const rules = {
  materialId: {
    required: true,
    message: t('inventory.stockIn.selectMaterial'),
    trigger: ['blur', 'change']
  },
  quantity: {
    required: true,
    message: t('inventory.stockIn.inputQuantity'),
    trigger: ['blur', 'change'],
    validator: (rule: any, value: any) => {
      if (value === null || value === undefined || value === '') {
        return new Error(t('inventory.stockIn.inputQuantity'));
      }
      if (typeof value === 'number' && value > 0) {
        return true;
      }
      return new Error(t('inventory.stockIn.inputQuantity'));
    }
  }
};

// 计算总金额
const totalAmount = computed(() => {
  return model.value.quantity * model.value.unitPrice;
});

// 处理物料选择变化
const handleMaterialChange = (materialId: string) => {
  const selected = materialOptions.value.find(item => item.value === materialId);
  if (selected) {
    selectedMaterial.value = selected.material;
    model.value.unitPrice = selected.material.purchasePrice;
    model.value.supplier = selected.material.supplier?.name || '';
  } else {
    selectedMaterial.value = null;
    model.value.unitPrice = 0;
    model.value.supplier = '';
  }
};

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    await createStockIn(model.value);
    show.value = false;
    emit('success');
  } catch (error) {
    // 处理错误
  }
}

// 重置表单
function resetForm() {
  model.value = {
    materialId: null,
    quantity: null,
    unitPrice: null,
    supplier: null,
    remarks: ''
  };
  selectedMaterial.value = null;
  formRef.value?.restoreValidation();
}

// 监听显示状态
watch(() => show.value, (newVal) => {
  if (newVal) {
    fetchMaterialOptions();
  } else {
    resetForm();
  }
});
</script>

<template>
  <NDrawer v-model:show="show" :width="500">
    <NDrawerContent :title="t('inventory.stockIn.create')">
      <NForm
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        :label-width="100"
      >
        <NFormItem :label="t('inventory.stockIn.material')" path="materialId">
          <NSelect
            v-model:value="model.materialId"
            filterable
            :options="materialOptions"
            :placeholder="t('inventory.stockIn.selectMaterial')"
            @update:value="handleMaterialChange"
          />
        </NFormItem>

        <NFormItem :label="t('inventory.stockIn.quantity')" path="quantity">
          <NInputNumber
            v-model:value="model.quantity"
            :min="1"
            :precision="0"
            style="width: 100%"
            :placeholder="t('inventory.stockIn.inputQuantity')"
            clearable
          />
        </NFormItem>

        <NFormItem :label="t('inventory.stockIn.unitPrice')">
          <div class="border border-gray-300 rounded-md p-2 w-full h-[34px] bg-gray-100">{{ model.unitPrice }}</div>
        </NFormItem>

        <NFormItem :label="t('inventory.stockIn.supplier')">
          <div class="border border-gray-300 rounded-md p-2 w-full h-[34px] bg-gray-100">{{ model.supplier  }}</div>
        </NFormItem>

        <NFormItem :label="t('inventory.stockIn.totalAmount')">
          <div class="border border-gray-300 rounded-md p-2 w-full h-[34px] bg-gray-100">{{ totalAmount }}</div>
        </NFormItem>

        <NFormItem :label="t('inventory.stockIn.remarks')" path="remarks">
          <NInput
            v-model:value="model.remarks"
            type="textarea"
            :placeholder="t('common.remarks')"
          />
        </NFormItem>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="show = false">
            {{ t('common.cancel') }}
          </NButton>
          <NButton
            type="primary"
            :loading="loading"
            @click="handleSubmit"
          >
            {{ t('common.confirm') }}
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
