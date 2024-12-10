<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { NForm, NFormItem, NInput, NDrawer, NDrawerContent, NSpace, NButton } from 'naive-ui';
import { fetchCreateCustomer, fetchUpdateCustomer } from '@/service/api/customer';

defineOptions({ name: 'CustomerForm' });

interface Props {
  show: boolean;
  type: 'add' | 'edit';
  editData?: Api.Customer.CustomerInfo;
}

interface Emits {
  (e: 'update:show', value: boolean): void;
  (e: 'submit-success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const { formRef, validate } = useNaiveForm();

const formModel = reactive({
  name: '',
  phone: '',
  email: '',
  address: ''
});

const rules = {
  name: { required: true, message: t('form.required') },
  phone: {
    required: true,
    message: t('form.phone.required'),
    validator: (_rule: unknown, value: string) => /^1[3-9]\d{9}$/.test(value) || new Error(t('form.phone.invalid'))
  },
  email: {
    required: true,
    message: t('form.email.required'),
    validator: (_rule: unknown, value: string) => /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value) || new Error(t('form.email.invalid'))
  }
};

const loading = ref(false);

function resetForm() {
  Object.assign(formModel, {
    name: '',
    phone: '',
    email: '',
    address: ''
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
      await fetchCreateCustomer(formModel);
      window.$message?.success(t('common.addSuccess'));
    } else {
      await fetchUpdateCustomer(props.editData!._id, formModel);
      window.$message?.success(t('common.updateSuccess'));
    }
    emit('submit-success');
    handleClose();
  } finally {
    loading.value = false;
  }
}

// 编辑时填充表单
watch(
  () => props.editData,
  newData => {
    if (newData && props.type === 'edit') {
      Object.assign(formModel, {
        name: newData.name,
        phone: newData.phone,
        email: newData.email,
        address: newData.address
      });
    }
  },
  { immediate: true }
);
</script>

<template>
  <NDrawer v-model:show="props.show" :width="500" :mask-closable="true">
    <NDrawerContent :title="props.type === 'add' ? t('common.add') : t('common.edit')">
      <NForm ref="formRef" :model="formModel" :rules="rules" label-placement="left" :label-width="80">
        <NFormItem :label="t('menu.customer.name')" path="name">
          <NInput v-model:value="formModel.name" :placeholder="t('menu.customer.nameSearch')" />
        </NFormItem>
        <NFormItem :label="t('menu.customer.phone')" path="phone">
          <NInput v-model:value="formModel.phone" :placeholder="t('menu.customer.phoneSearch')" />
        </NFormItem>
        <NFormItem :label="t('menu.customer.email')" path="email">
          <NInput v-model:value="formModel.email" :placeholder="t('menu.customer.emailSearch')" />
        </NFormItem>
        <NFormItem :label="t('menu.customer.address')" path="address">
          <NInput v-model:value="formModel.address" :placeholder="t('menu.customer.addressSearch')" />
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
