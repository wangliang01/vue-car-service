<template>
  <NDrawer v-model:show="props.show" :width="500" :mask-closable="true">
    <NDrawerContent :title="props.type === 'add' ? t('common.add') : t('common.edit')">
      <NForm 
        ref="formRef" 
        :model="formModel" 
        :rules="rules" 
        label-placement="left" 
        :label-width="80"
      >
        <NFormItem :label="t('menu.customer.name')" path="customerId">
          <NSelect
            v-model:value="formModel.customerId"
            :options="customerOptions"
            :placeholder="t('menu.customer.nameSearch')"
            filterable
          />
        </NFormItem>
        <NFormItem :label="t('menu.vehicle.brand')" path="brand">
          <NSelect
            v-model:value="formModel.brand"
            :options="BRAND_OPTIONS"
            :placeholder="t('menu.vehicle.brandPlaceholder')"
            filterable
          />
        </NFormItem>
        <NFormItem :label="t('menu.vehicle.model')" path="model">
          <NInput
            v-model:value="formModel.model"
            :placeholder="t('menu.vehicle.modelPlaceholder')"
          />
        </NFormItem>
        <NFormItem :label="t('menu.vehicle.year')" path="year">
          <NInputNumber
            v-model:value="formModel.year"
            :placeholder="t('menu.vehicle.yearPlaceholder')"
            :min="1900"
            :max="new Date().getFullYear()"
            style="width: 100%"
          />
        </NFormItem>
        <NFormItem :label="t('menu.vehicle.licensePlate')" path="licensePlate">
          <NInput
            v-model:value="formModel.licensePlate"
            :placeholder="t('menu.vehicle.licensePlatePlaceholder')"
          />
        </NFormItem>
        <NFormItem :label="t('menu.vehicle.vin')" path="vin">
          <NInput
            v-model:value="formModel.vin"
            :placeholder="t('menu.vehicle.vinPlaceholder')"
          />
        </NFormItem>
        <NFormItem :label="t('menu.vehicle.mileage')" path="mileage">
          <NInputNumber
            v-model:value="formModel.mileage"
            :placeholder="t('menu.vehicle.mileagePlaceholder')"
            :min="0"
            style="width: 100%"
          />
        </NFormItem>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="handleClose">{{ t('common.cancel') }}</NButton>
          <NButton type="primary" :loading="loading" @click="handleSubmit">
            {{ t('common.confirm') }}
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import {
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NButton,
  NSpace,
  NSelect,
} from 'naive-ui';
import { fetchCreateVehicle, fetchUpdateVehicle } from '@/service/api/vehicle';
import { fetchCustomers } from '@/service/api/customer';
import { BRAND_OPTIONS, DEFAULT_BRAND_LOGO, getBrandLogo, getBrandLabel } from '@/constants/brand';

defineOptions({ name: 'VehicleForm' });

const props = defineProps<{
  show: boolean;
  type: 'add' | 'edit';
  editData?: Api.Vehicle.VehicleInfo;
  brands: string[];
  models: string[];
}>();

// const show = defineModel<boolean>('show', { required: true });

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'submit-success'): void;
  (e: 'brand-change', brand: string): void;
}>();

const { t } = useI18n();
const { formRef, validate } = useNaiveForm();

const formModel = reactive({
  customerId: '',
  brand: '',
  model: '',
  licensePlate: '',
  year: new Date().getFullYear(),
  vin: '',
  mileage: 0
});

const customerOptions = ref<{ label: string; value: string }[]>([]);

// 获取所有客户列表
async function loadCustomers() {
  try {
    const { data } = await fetchCustomers();
    customerOptions.value = data.map(customer => ({
      label: customer.name,
      value: customer._id
    }));
  } catch (error) {
    console.error('Failed to load customers:', error);
  }
}

const rules = {
  customerId: { required: true, message: t('common.required') },
  brand: { required: true, message: t('common.required') },
  model: { required: true, message: t('common.required') },
  licensePlate: { required: true, message: t('common.required') },
  year: { required: true, message: t('common.required') },
  vin: { required: true, message: t('common.required') },
  mileage: { required: true, message: t('common.required') }
};

const loading = ref(false);

function resetForm() {
  Object.assign(formModel, {
    customerId: '',
    brand: '',
    model: '',
    licensePlate: '',
    year: new Date().getFullYear(),
    vin: '',
    mileage: 0
  });
}

function handleClose() {
  emit('update:show', false);
  resetForm();
}

async function handleSubmit() {
  await validate();
  loading.value = true;
  try {
    if (props.type === 'add') {
      await fetchCreateVehicle(formModel);
    } else {
      await fetchUpdateVehicle(props.editData!._id, formModel);
    }
    emit('submit-success');
  } finally {
    loading.value = false;
  }
}

const handleBrandChange = (brand: string) => {
  formModel.model = '';  // 清空型号
  emit('brand-change', brand);
};

// 监听editData变化，当编辑时自动加载客户信息
watch(
  () => props.editData,
  async newVal => {
    if (newVal && props.type === 'edit') {
      await loadCustomers();
      console.log("newVal", newVal);
      // 设置表单数据
      Object.assign(formModel, {
        ...newVal,
        customerId: newVal.customer._id // 确保客户ID被正确设置
      });
    }
  },
  { immediate: true }
);

// 监听抽屉显示状态，当关闭时重置表单
watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      resetForm();
    }
  }
);

// 组件挂载时加载客户列表
onMounted(() => {
  loadCustomers();
});
</script>
