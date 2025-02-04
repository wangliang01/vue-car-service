<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NInputNumber, NSelect, NDatePicker, NSpace, NButton } from 'naive-ui';
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
  materialId: '',
  quantity: 0,
  unitPrice: 0,
  supplier: '',
  stockInDate: null,
  remarks: ''
});

const materialOptions = ref<{ label: string; value: string }[]>([]);

// 获取物料列表
const fetchMaterialOptions = async () => {
  try {
    const res = await fetchMaterialList({});
    materialOptions.value = res.data.records.map(item => ({
      label: item.name,
      value: item._id
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
    trigger: ['blur', 'change']
  },
  unitPrice: {
    required: true,
    message: t('inventory.stockIn.inputUnitPrice'),
    trigger: ['blur', 'change']
  },
  supplier: {
    required: true,
    message: t('inventory.stockIn.inputSupplier'),
    trigger: ['blur', 'change']
  },
  stockInDate: {
    required: true,
    message: t('inventory.stockIn.selectDate'),
    trigger: ['blur', 'change']
  }
};

// 计算总金额
const totalAmount = computed(() => {
  return model.value.quantity * model.value.unitPrice;
});

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

// 监听显示状态
watch(() => show.value, (newVal) => {
  if (newVal) {
    fetchMaterialOptions();
  } else {
    model.value = {
      materialId: '',
      quantity: 0,
      unitPrice: 0,
      supplier: '',
      stockInDate: null,
      remarks: ''
    };
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
            :options="materialOptions"
            :placeholder="t('inventory.stockIn.selectMaterial')"
          />
        </NFormItem>

        <NFormItem :label="t('inventory.stockIn.quantity')" path="quantity">
          <NInputNumber
            v-model:value="model.quantity"
            :min="0"
            :placeholder="t('inventory.stockIn.inputQuantity')"
          />
        </NFormItem>

        <NFormItem :label="t('inventory.stockIn.unitPrice')" path="unitPrice">
          <NInputNumber
            v-model:value="model.unitPrice"
            :min="0"
            :precision="2"
            :placeholder="t('inventory.stockIn.inputUnitPrice')"
          />
        </NFormItem>

        <NFormItem :label="t('inventory.stockIn.supplier')" path="supplier">
          <NInput
            v-model:value="model.supplier"
            :placeholder="t('inventory.stockIn.inputSupplier')"
          />
        </NFormItem>

        <NFormItem :label="t('inventory.stockIn.stockInDate')" path="stockInDate">
          <NDatePicker
            v-model:value="model.stockInDate"
            type="date"
            format="yyyy-MM-dd"
            :placeholder="t('inventory.stockIn.selectDate')"
          />
        </NFormItem>

        <NFormItem :label="t('inventory.stockIn.remarks')" path="remarks">
          <NInput
            v-model:value="model.remarks"
            type="textarea"
            :placeholder="t('common.remarks')"
          />
        </NFormItem>

        <NFormItem :label="t('inventory.stockIn.totalAmount')">
          <span>{{ totalAmount }}</span>
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
