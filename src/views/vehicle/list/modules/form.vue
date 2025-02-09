<template>
  <NDrawer v-model:show="show" :width="500" :mask-closable="true">
    <NDrawerContent :title="props.type === 'add' ? t('common.add') : t('common.edit')">
      <NForm
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-placement="left"
        :label-width="100"
      >
        <NFormItem :label="t('menu.customer.name')" path="customerId">
          <NSelect
            v-model:value="formModel.customerId"
            :options="customerOptions"
            :placeholder="t('menu.customer.nameSearch')"
            filterable
          />
        </NFormItem>
        <NFormItem :label="t('menu.vehicle.licensePlate')" path="licensePlate">
          <NInput
            v-model:value="formModel.licensePlate"
            :placeholder="t('menu.vehicle.licensePlatePlaceholder')"
          />
        </NFormItem>
        <NFormItem :label="t('menu.vehicle.color')" path="color">
          <NInput
            v-model:value="formModel.color"
            :placeholder="t('menu.vehicle.colorPlaceholder')"
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

        <NFormItem :label="t('menu.vehicle.vin')" path="vin">
          <NInput
            v-model:value="formModel.vin"
            :placeholder="t('menu.vehicle.vinPlaceholder')"
          />
        </NFormItem>
        <NFormItem :label="t('menu.vehicle.engineNo')" path="engineNo">
          <NInput
            v-model:value="formModel.engineNo"
            :placeholder="t('menu.vehicle.engineNoPlaceholder')"
          />
        </NFormItem>
        <NFormItem :label="t('menu.vehicle.displacement')" path="displacement">
          <NInput
            v-model:value="formModel.displacement"
            :placeholder="t('menu.vehicle.displacementPlaceholder')"
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
import { ref, reactive, watch, onMounted, nextTick } from 'vue';
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
  type: 'add' | 'edit';
  editData?: Api.Vehicle.VehicleInfo;
  brands: string[];
  models: string[];
}>();

const show = defineModel<boolean>('show', { required: true, default: false });

const emit = defineEmits<{
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
  engineNo: '',
  color: '',
  displacement: '',
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
  model: { required: false },
  licensePlate: { required: true, message: t('common.required') },
  year: { required: false },
  vin: { required: false },
  engineNo: { required: false },
  color: { required: true, message: t('common.required') },
  displacement: { required: false },
  mileage: { required: false }
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
    engineNo: '',
    color: '',
    displacement: '',
    mileage: 0
  });
}

function handleClose() {
  show.value = false;
  resetForm();
}

async function handleSubmit() {
  await validate();
  loading.value = true;
  try {
    if (props.type === 'add') {
      await fetchCreateVehicle(formModel);
    } else {
      console.log("formModel", formModel);
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
      Object.assign(formModel, {
        ...newVal,
        customerId: newVal.customer._id
      });
    }
  }
);

// 监听抽屉显示状态，当关闭时重置表单
watch(
  () => show.value,
  (newVal) => {
    if (!newVal && props.type === 'add') {  // 只在添加模式下重置表单
      resetForm();
    }
  }
);

// 组件挂载时加载客户列表
onMounted(() => {
  loadCustomers();
});
</script>
