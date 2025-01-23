<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { NForm, NFormItem, NInput, NDrawer, NDrawerContent, NSpace, NButton } from 'naive-ui';
import { fetchCreateCustomer, fetchUpdateCustomer } from '@/service/api/customer';

defineOptions({ name: 'CustomerForm' });

interface Props {
  type: 'add' | 'edit';
  editData?: Api.Customer.CustomerInfo;
}

interface Emits {
  (e: 'submit-success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const { formRef, validate } = useNaiveForm();

const show = defineModel<boolean>('show')

const formModel = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  contact: '',
  bankAccount: '',
  bankName: ''
});

const rules = {
  name: { required: true, message: t('form.required') },
  phone: {
    required: true,
    message: t('form.phone.required'),
    validator: (_rule: unknown, value: string) => /^1[3-9]\d{9}$/.test(value) || new Error(t('form.phone.invalid'))
  },
  contact: {
    required: true,
    message: t('form.contact.required')
  },
  email: { required: false },
  address: { required: false },
  bankAccount: { required: false },
  bankName: { required: false }
};

const loading = ref(false);

function resetForm() {
  Object.assign(formModel, {
    name: '',
    phone: '',
    email: '',
    address: '',
    contact: '',
    bankAccount: '',
    bankName: ''
  });
}

function handleClose() {
  show.value = false
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
    handleClose();
    emit('submit-success');
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
        address: newData.address,
        contact: newData.contact,
        bankAccount: newData.bankAccount,
        bankName: newData.bankName
      });
    }
  },
  { immediate: true }
);
</script>

<template>
  <NDrawer v-model:show="show" :width="500" :mask-closable="true">
    <NDrawerContent :title="props.type === 'add' ? t('common.add') : t('common.edit')">
      <NForm 
        ref="formRef" 
        :model="formModel" 
        :rules="rules" 
        label-placement="left" 
        :label-width="80"
        @keyup.enter="handleSubmit"
      >
        <NFormItem :label="t('menu.customer.name')" path="name">
          <NInput v-model:value="formModel.name" :placeholder="t('menu.customer.nameSearch')" />
        </NFormItem>
        <NFormItem :label="t('menu.customer.contact')" path="contact">
          <NInput v-model:value="formModel.contact" :placeholder="t('menu.customer.contactSearch')" />
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
        <NFormItem :label="t('menu.customer.bankAccount')" path="bankAccount">
          <NInput v-model:value="formModel.bankAccount" :placeholder="t('menu.customer.bankAccountSearch')" />
        </NFormItem>
        <NFormItem :label="t('menu.customer.bankName')" path="bankName">
          <NInput v-model:value="formModel.bankName" :placeholder="t('menu.customer.bankNameSearch')" />
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
