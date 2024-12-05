<template>
  <n-drawer v-model:show="props.show" :width="500" :title="drawerTitle">
    <n-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-placement="left"
      :label-width="100"
      class="py-4 px-4"
    >
      <n-form-item :label="t('menu.vehicle.brand')" path="brand">
        <n-select
          v-model:value="formModel.brand"
          :options="props.brands.map(brand => ({ label: brand, value: brand }))"
          :placeholder="t('common.pleaseSelect')"
          @update:value="handleBrandChange"
        />
      </n-form-item>
      <n-form-item :label="t('menu.vehicle.model')" path="model">
        <n-select
          v-model:value="formModel.model"
          :options="props.models.map(model => ({ label: model, value: model }))"
          :placeholder="t('common.pleaseSelect')"
        />
      </n-form-item>
      <n-form-item :label="t('menu.vehicle.licensePlate')" path="licensePlate">
        <n-input
          v-model:value="formModel.licensePlate"
          :placeholder="t('common.pleaseInput')"
        />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space>
        <n-button @click="closeDrawer">{{ t('common.cancel') }}</n-button>
        <n-button type="primary" :loading="submitLoading" @click="handleSubmit">
          {{ t('common.confirm') }}
        </n-button>
      </n-space>
    </template>
  </n-drawer>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import type { FormInst } from 'naive-ui';
import {
  NDrawer,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpace,
  NSelect,
} from 'naive-ui';

const { t } = useI18n();

const props = defineProps<{
  show: boolean;
  editData?: Partial<Api.Vehicle.VehicleInfo>;
  brands: string[];
  models: string[];
}>();

const emit = defineEmits<{
  (e: 'update:show', show: boolean): void;
  (e: 'submit-success'): void;
  (e: 'brand-change', brand: string): void;
}>();

const formRef = ref<FormInst | null>(null);
const submitLoading = ref(false);

const defaultFormModel: Api.Vehicle.VehicleInfo = {
  brand: '',
  model: '',
  licensePlate: '',
  customerId: '',
  year: 0,
  vin: '',
  mileage: 0,
};

const formModel = reactive({ ...defaultFormModel, ...props.editData });

const rules = {
  brand: {
    required: true,
    message: t('common.required'),
    trigger: ['blur', 'change'],
  },
  model: {
    required: true,
    message: t('common.required'),
    trigger: ['blur', 'change'],
  },
  licensePlate: {
    required: true,
    message: t('common.required'),
    trigger: ['blur', 'input'],
  },
};

const drawerTitle = computed(() => {
  return props.editData?._id
    ? t('common.edit')
    : t('common.add');
});

const closeDrawer = () => {
  emit('update:show', false);
};

const resetForm = () => {
  formRef.value?.restoreValidation();
  Object.assign(formModel, defaultFormModel);
};

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      submitLoading.value = true;
      emit('submit-success');
      submitLoading.value = false;
      resetForm();
      closeDrawer();
    }
  });
};

const handleBrandChange = (brand: string) => {
  emit('brand-change', brand);
};
</script>
