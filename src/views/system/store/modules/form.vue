<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NTimePicker, NSelect } from 'naive-ui';
import type { FormInst } from 'naive-ui';
import { fetchCreateStore, fetchUpdateStore } from '@/service/api/store';

const props = defineProps<{
  mode: 'create' | 'edit'
  editingRecord: Api.Store.StoreInfo | null
}>();

const emit = defineEmits<{
  (e: 'submit'): void
}>();

const { t } = useI18n();

const formRef = ref<FormInst | null>(null);
const show = defineModel<boolean>()
const formModel = ref<Api.Store.CreateStoreParams>({
  name: '',
  code: '',
  address: {
    province: '',
    city: '',
    district: '',
    detail: ''
  },
  contact: {
    phone: '',
    email: ''
  },
  businessHours: {
    openTime: '09:00',
    closeTime: '18:00',
    workDays: []
  }
});

// 工作日选项
const workDayOptions = [
  { label: t('system.store.workDay.monday'), value: 1 },
  { label: t('system.store.workDay.tuesday'), value: 2 },
  { label: t('system.store.workDay.wednesday'), value: 3 },
  { label: t('system.store.workDay.thursday'), value: 4 },
  { label: t('system.store.workDay.friday'), value: 5 },
  { label: t('system.store.workDay.saturday'), value: 6 },
  { label: t('system.store.workDay.sunday'), value: 7 }
];

// 表单验证规则
const rules = {
  name: { required: true, message: t('system.store.nameRequired') },
  code: { required: true, message: t('system.store.codeRequired') },
  'address.province': { required: true, message: t('system.store.provinceRequired') },
  'address.city': { required: true, message: t('system.store.cityRequired') },
  'address.district': { required: true, message: t('system.store.districtRequired') },
  'address.detail': { required: true, message: t('system.store.addressDetailRequired') },
  'contact.phone': { required: true, message: t('system.store.phoneRequired') },
  'contact.email': { required: true, message: t('system.store.emailRequired') },
  'businessHours.openTime': { required: true, message: t('system.store.openTimeRequired') },
  'businessHours.closeTime': { required: true, message: t('system.store.closeTimeRequired') },
  'businessHours.workDays': { required: true, type: 'array', message: t('system.store.workDaysRequired') }
};

// 监听编辑记录变化
watch(
  () => props.editingRecord,
  (record) => {
    if (record) {
      Object.assign(formModel.value, {
        name: record.name,
        code: record.code,
        address: { ...record.address },
        contact: { ...record.contact },
        businessHours: { ...record.businessHours }
      });
    } else {
      Object.assign(formModel.value, {
        name: '',
        code: '',
        address: {
          province: '',
          city: '',
          district: '',
          detail: ''
        },
        contact: {
          phone: '',
          email: ''
        },
        businessHours: {
          openTime: '09:00',
          closeTime: '18:00',
          workDays: []
        }
      });
    }
  }
);

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    
    if (props.mode === 'create') {
      await fetchCreateStore(formModel.value);
      window.$message?.success(t('common.createSuccess'));
    } else {
      await fetchUpdateStore(props.editingRecord!._id, formModel.value);
      window.$message?.success(t('common.updateSuccess'));
    }
    show.value = false
    emit('submit');
  } catch (error) {
    window.$message?.error(t('common.error'));
  }
}

// 关闭抽屉
function handleClose() {
 show.value = false
}
</script>

<template>
  <NDrawer
    v-model:show="show"
    :mask-closable="true"
    :title="mode === 'create' ? t('common.add') : t('common.edit')"
  >
    <NDrawerContent>
      <NForm
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-placement="left"
        label-width="100"
        require-mark-placement="right-hanging"
      >
        <NFormItem :label="t('system.store.name')" path="name">
          <NInput v-model:value="formModel.name" />
        </NFormItem>
        
        <NFormItem :label="t('system.store.code')" path="code">
          <NInput v-model:value="formModel.code" />
        </NFormItem>

        <NFormItem :label="t('system.store.province')" path="address.province">
          <NInput v-model:value="formModel.address.province" />
        </NFormItem>

        <NFormItem :label="t('system.store.city')" path="address.city">
          <NInput v-model:value="formModel.address.city" />
        </NFormItem>

        <NFormItem :label="t('system.store.district')" path="address.district">
          <NInput v-model:value="formModel.address.district" />
        </NFormItem>

        <NFormItem :label="t('system.store.addressDetail')" path="address.detail">
          <NInput v-model:value="formModel.address.detail" />
        </NFormItem>

        <NFormItem :label="t('system.store.phone')" path="contact.phone">
          <NInput v-model:value="formModel.contact.phone" />
        </NFormItem>

        <NFormItem :label="t('system.store.email')" path="contact.email">
          <NInput v-model:value="formModel.contact.email" />
        </NFormItem>

        <NFormItem :label="t('system.store.openTime')" path="businessHours.openTime">
          <NTimePicker v-model:value="formModel.businessHours.openTime" format="HH:mm" />
        </NFormItem>

        <NFormItem :label="t('system.store.closeTime')" path="businessHours.closeTime">
          <NTimePicker v-model:value="formModel.businessHours.closeTime" format="HH:mm" />
        </NFormItem>

        <NFormItem :label="t('system.store.workDays')" path="businessHours.workDays">
          <NSelect
            v-model:value="formModel.businessHours.workDays"
            :options="workDayOptions"
            multiple
          />
        </NFormItem>
      </NForm>

      <div class="flex justify-end gap-12px mt-24px">
        <NButton @click="handleClose">{{ t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ t('common.confirm') }}</NButton>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.gap-12px {
  gap: 12px;
}

.mt-24px {
  margin-top: 24px;
}
</style>