<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NInputNumber, NSelect, NButton } from 'naive-ui';
import type { SelectOption } from 'naive-ui';
import { fetchMaterialList } from '@/service/api/material';

interface Props {
  show: boolean;
  editData?: Api.Inventory.InventoryItem | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:show', 'submit']);
const { t } = useI18n();

const isEdit = computed(() => props.editData !== null);

const formRef = ref(null);
const formData = ref<Api.Inventory.CreateInventoryParams>({
  materialId: null,
  quantity: 0,
  alertThreshold: 100,
  maxQuantity: 10000,
  remarks: ''
});

const rules = {
  materialId: {
    required: true,
    message: '请选择材料',
    trigger: 'blur'
  },
  quantity: {
    required: true,
    message: '请输入库存数量',
    trigger: 'blur',
    type: 'number' as const
  },
  alertThreshold: {
    required: true,
    message: '请输入预警阈值',
    trigger: 'blur',
    type: 'number' as const
  },
  maxQuantity: {
    required: true,
    message: '请输入最大库存',
    trigger: 'blur',
    type: 'number' as const
  }
};

const materialOptions = ref<SelectOption[]>([]);

const handleShow = async () => {
  materialOptions.value = [];
  const res = await fetchMaterialList({});
  materialOptions.value = res.data.records.map((item) => ({
    label: item.name,
    value: item._id
  }));
};

const handleClose = () => {
  initFormData();
};

const initFormData = () => {
  formData.value = {
    materialId: null,
    quantity: 0,
    alertThreshold: 100,
    maxQuantity: 10000,
    remarks: ''
  };
};

// 监听编辑数据变化
watch(
  () => props.editData,
  (newVal) => {
    if (newVal) {
      formData.value = {
        materialId: newVal.material._id,
        quantity: newVal.quantity,
        alertThreshold: newVal.alertThreshold,
        maxQuantity: newVal.maxQuantity,
        remarks: newVal.remarks || ''
      };
    } else {
      initFormData();
    }
  },
  { immediate: true }
);


// 提交表单
const handleSubmit = () => {
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      console.log('formData', formData.value);
      emit('submit', formData.value);
      emit('update:show', false);
    }
  });
};

// 取消
const handleCancel = () => {
  emit('update:show', false);
};
</script>

<template>
  <NDrawer
    :show="show"
    @update:show="v => emit('update:show', v)"
    :on-after-enter="handleShow"
    :on-after-leave="handleClose"
    :width="500"
  >
    <NDrawerContent
      :title="editData ? t('common.edit') : t('common.add')"
      :native-scrollbar="false"
    >
      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="medium"
      >
        <NFormItem :label="t('inventory.material')" path="materialId">
          <NSelect
            v-model:value="formData.materialId"
            filterable
            :disabled="isEdit"
            :options="materialOptions"
            :placeholder="t('inventory.materialPlaceholder')"
          />
        </NFormItem>
        <NFormItem :label="t('inventory.quantity')" path="quantity">
          <NInputNumber
            v-model:value="formData.quantity"
            style="width: 100%"
            :min="0"
            :precision="0"
            :placeholder="t('inventory.quantityPlaceholder')"
          />
        </NFormItem>
        <NFormItem :label="t('inventory.alertThreshold')" path="alertThreshold">
          <NInputNumber
            v-model:value="formData.alertThreshold"
            style="width: 100%"
            :min="0"
            :precision="0"
            :placeholder="t('inventory.alertThresholdPlaceholder')"
          />
        </NFormItem>
        <NFormItem :label="t('inventory.maxQuantity')" path="maxQuantity">
          <NInputNumber
            v-model:value="formData.maxQuantity"
            style="width: 100%"
            :min="0"
            :precision="0"
            :placeholder="t('inventory.maxQuantityPlaceholder')"
          />
        </NFormItem>
        <NFormItem :label="t('common.remark')" path="remarks">
          <NInput
            v-model:value="formData.remarks"
            type="textarea"
            :placeholder="t('common.remarkPlaceholder')"
          />
        </NFormItem>
      </NForm>

      <template #footer>
        <div class="flex-center-y justify-end gap-4">
          <NButton @click="handleCancel" class="mr-4">
            {{ t('common.cancel') }}
          </NButton>
          <NButton type="primary" @click="handleSubmit">
            {{ t('common.confirm') }}
          </NButton>
        </div>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<script lang="ts">
export default {
  name: 'InventoryForm'
};
</script>
