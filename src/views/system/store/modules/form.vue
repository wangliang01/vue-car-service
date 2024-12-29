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
const show = defineModel<boolean>(`modelValue`, { required: true });
const loading = ref(false);

const formModel = ref<Api.Store.CreateStoreParams>({
  name: '',
  code: '',
  address: ''
});



// 表单验证规则
const rules = {
  name: { required: true, message: t('system.store.nameRequired') },
  code: { required: false, message: t('system.store.codeRequired') },
};

// 监听编辑记录变化
watch(
  () => props.editingRecord,
  (record) => {
    if (record) {
      Object.assign(formModel.value, {
        name: record.name,
        code: record.code,
        address: record.address,
      });
    } else {
      Object.assign(formModel.value, {
        name: '',
        code: '',
        address: '',
      });
    }
  }
);



// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    loading.value = true;
    
    if (props.mode === 'create') {
      await fetchCreateStore(formModel.value);
    } else {
      await fetchUpdateStore(props.editingRecord!._id, formModel.value);
    }
    show.value = false
    emit('submit');
  }  finally {
    loading.value = false;
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
    :width="500"
    :mask-closable="true"
   
  >
    <NDrawerContent  :title="props.mode === 'create' ? t('common.add') : t('common.edit')">
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

        <NFormItem :label="t('system.store.address')" path="address">
          <NInput v-model:value="formModel.address" />
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