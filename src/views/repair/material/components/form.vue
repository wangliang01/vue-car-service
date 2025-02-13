<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NSpace,
  NButton,
  NGrid,
  NFormItemGi
} from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { createMaterial, updateMaterial } from '@/service/api/material';

const { t } = useI18n();

const props = defineProps<{
  type: 'add' | 'edit';
  editData?: Api.Material.MaterialInfo | null;
}>();

const emits = defineEmits(['success', 'close']);

const show = defineModel('show', {
  type: Boolean,
  required: true
});

const formRef = ref();
const loading = ref(false);

const formModel = ref<Api.Material.CreateParams>({
  name: '',
  code: '',
  category: null,
  specification: '',
  unit: null,
  purchasePrice: 0,
  managementFeeRate: 0,
  sellingPrice: 0,
  stockQuantity: 0,
  stockThreshold: 10,
  supplier: {
    name: '',
    contact: '',
    phone: ''
  },
  remarks: ''
});

const categoryOptions = [
  { label: t('material.categoryTypes.parts'), value: '油品' },
  { label: t('material.categoryTypes.oil'), value: '耗材' },
  { label: t('material.categoryTypes.parts'), value: '配件' }
];

const unitOptions = [
  { label: '升', value: '升' },
  { label: '瓶', value: '瓶' },
  { label: '个', value: '个' },
  { label: '台', value: '台' },
  { label: '套', value: '套' },
  { label: '件', value: '件' },
  { label: '包', value: '包' },
  { label: '箱', value: '箱' },
  { label: '条', value: '条' },
  { label: '盒', value: '盒' },
  { label: '袋', value: '袋' },
  { label: '双', value: '双' },
  { label: '支', value: '支' }
];

watch(
  () => props.editData,
  (val) => {
    if (val) {
      Object.assign(formModel.value, val);
    }
  }
);

function handleCancel() {
  show.value = false
}

// 定义更新接口的类型
interface UpdateMaterialParams {
  name: string;
  code: string;
  category: string;
  specification?: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  stockThreshold: number;
  supplier: {
    name: string;
    contact: string;
    phone: string;
  };
  remarks?: string;
}

// 从 formModel 中提取需要的字段
const updateData = Object.keys(formModel.value).reduce((acc, key) => {
  if (key in formModel.value) {
    acc[key] = formModel.value[key];
  }
  return acc;
}, {} as UpdateMaterialParams);

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    loading.value = true;

    if (props.type === 'add') {
      await createMaterial(formModel.value);
    } else {
      const updateData: UpdateMaterialParams = {
        name: formModel.value.name,
        code: formModel.value.code,
        category: formModel.value.category,
        specification: formModel.value.specification,
        unit: formModel.value.unit,
        purchasePrice: formModel.value.purchasePrice,
        sellingPrice: formModel.value.sellingPrice,
        stockQuantity: formModel.value.stockQuantity,
        stockThreshold: formModel.value.stockThreshold,
        supplier: formModel.value.supplier as any ,
        remarks: formModel.value.remarks
      };
      await updateMaterial(props.editData!._id, updateData);
    }

    window.$message?.success(t('common.success'));
    emits('success');
  } catch (error) {
    window.$message?.error(t('common.error'));
  } finally {
    loading.value = false;
  }
}

function handleClose() {
  formRef.value?.restoreValidation();
  Object.assign(formModel.value, {
    name: '',
    code: '',
    category: '',
    specification: '',
    unit: '',
    purchasePrice: 0,
    managementFeeRate: 0,
    sellingPrice: 0,
    stockQuantity: 0,
    stockThreshold: 10,
    supplier: {
      name: '',
      contact: '',
      phone: ''
    },
    remarks: ''
  });
  emits('close');
}
</script>

<template>
  <NDrawer
    v-model:show="show"
    :width="800"
    placement="right"
    @close="handleClose"
  >
    <NDrawerContent
      :title="t(type === 'add' ? 'common.add' : 'common.edit')"
      :native-scrollbar="false"
    >
      <NForm
        ref="formRef"
        :model="formModel"
        label-placement="left"
        label-width="120"
      >
        <NGrid :cols="2" :x-gap="24">
          <!-- 基本信息 -->
          <NFormItemGi :span="1">
            <NFormItem
              :label="t('material.name')"
              path="name"
              class="w-full"
              :rule="{
                required: true,
                message: t('common.required')
              }"
            >
              <NInput v-model:value="formModel.name" class="w-full" />
            </NFormItem>
          </NFormItemGi>

          <NFormItemGi :span="1">
            <NFormItem :label="t('material.code')" path="code" class="w-full">
              <NInput v-model:value="formModel.code" class="w-full" />
            </NFormItem>
          </NFormItemGi>

          <NFormItemGi :span="1">
            <NFormItem
              :label="t('material.category')"
              path="category"
              class="w-full"
              :rule="{
                required: true,
                message: t('common.required')
              }"
            >
              <NSelect
                v-model:value="formModel.category"
                :options="categoryOptions"
                :placeholder="t('common.select')"
                class="w-full"
                clearable
              />
            </NFormItem>
          </NFormItemGi>

          <NFormItemGi :span="1">
            <NFormItem :label="t('material.specification')" path="specification" class="w-full">
              <NInput v-model:value="formModel.specification" class="w-full" />
            </NFormItem>
          </NFormItemGi>

          <NFormItemGi :span="1">
            <NFormItem
              :label="t('material.unit')"
              path="unit"
              class="w-full"


              :rule="{
                required: true,
                message: t('common.required')
              }"
            >
              <NSelect
                v-model:value="formModel.unit"
                :options="unitOptions"
                :placeholder="t('common.select')"
                class="w-full"
                clearable
              />
            </NFormItem>
          </NFormItemGi>

          <!-- 价格信息 -->
          <NFormItemGi :span="1">
            <NFormItem
              :label="t('material.purchasePrice')"
              path="purchasePrice"
              class="w-full"
              :rule="{
                required: true,
                message: t('common.required')
              }"
            >
              <NInputNumber
                v-model:value="formModel.purchasePrice"
                :min="0"
                :precision="2"
                class="w-full"
              />
            </NFormItem>
          </NFormItemGi>

          <NFormItemGi :span="1">
            <NFormItem
              :label="t('material.sellingPrice')"
              path="sellingPrice"
              class="w-full"
              :rule="{
                required: true,
                message: t('common.required')
              }"
            >
              <NInputNumber
                v-model:value="formModel.sellingPrice"
                :min="0"
                :precision="2"
                class="w-full"
              />
            </NFormItem>
          </NFormItemGi>

          <!-- 库存信息 -->
          <NFormItemGi :span="1">
            <NFormItem :label="t('material.stockQuantity')" path="stockQuantity" class="w-full">
              <NInputNumber
                v-model:value="formModel.stockQuantity"
                :min="0"
                :precision="0"
                class="w-full"
              />
            </NFormItem>
          </NFormItemGi>

          <NFormItemGi :span="1">
            <NFormItem :label="t('material.stockThreshold')" path="stockThreshold" class="w-full">
              <NInputNumber
                v-model:value="formModel.stockThreshold"
                :min="0"
                :precision="0"
                class="w-full"
              />
            </NFormItem>
          </NFormItemGi>

          <!-- 供应商信息 -->
          <NFormItemGi :span="1">
            <NFormItem :label="t('material.supplier.name')" path="supplier.name" class="w-full">
              <NInput v-model:value="formModel.supplier.name" class="w-full" />
            </NFormItem>
          </NFormItemGi>

          <NFormItemGi :span="1">
            <NFormItem :label="t('material.supplier.contact')" path="supplier.contact" class="w-full">
              <NInput v-model:value="formModel.supplier.contact" class="w-full" />
            </NFormItem>
          </NFormItemGi>

          <NFormItemGi :span="1">
            <NFormItem :label="t('material.supplier.phone')" path="supplier.phone" class="w-full">
              <NInput v-model:value="formModel.supplier.phone" class="w-full" />
            </NFormItem>
          </NFormItemGi>

          <!-- 备注信息 跨两列 -->
          <NFormItemGi :span="2">
            <NFormItem :label="t('common.remark')" path="remarks" class="w-full">
              <NInput
                v-model:value="formModel.remarks"
                type="textarea"
                :rows="3"
                class="w-full"
              />
            </NFormItem>
          </NFormItemGi>
        </NGrid>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="handleCancel">
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
