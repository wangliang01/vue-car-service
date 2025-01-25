<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NSelect, NInputNumber, NButton, NSpace } from 'naive-ui';
import type { FormInst } from 'naive-ui';
import { fetchCreatePermission, fetchUpdatePermission } from '@/service/api/permission';

interface Props {
  show: boolean;
  editingRecord: Api.Permission.PermissionInfo | null;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  editingRecord: null
});

const emit = defineEmits<{
  'update:show': [value: boolean];
  'submit': [];
}>();

const { t } = useI18n();

const formRef = ref<FormInst | null>(null);
const loading = ref(false);

const formModel = ref<Api.Permission.CreatePermissionParams>({
  name: '',
  code: '',
  type: 'menu',
  parentId: null,
  path: '',
  component: '',
  sort: 1,
  icon: ''
});

const rules = {
  name: { required: true, message: t('system.permission.nameRequired') },
  code: { required: true, message: t('system.permission.codeRequired') },
  type: { required: true, message: t('system.permission.typeRequired') }
};

// 监听编辑记录变化
watch(
  () => props.editingRecord,
  (record) => {
    if (record) {
      Object.assign(formModel.value, record);
    } else {
      Object.assign(formModel.value, {
        name: '',
        code: '',
        type: 'menu',
        parentId: null,
        path: '',
        component: '',
        sort: 1,
        icon: ''
      });
    }
  }
);

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    loading.value = true;

    if (props.editingRecord?._id) {
      await fetchUpdatePermission(props.editingRecord._id, formModel.value);
    } else {
      await fetchCreatePermission(formModel.value);
    }
    // 清空表单
    Object.assign(formModel.value, {
      name: '',
      code: '',
      type: 'menu',
      parentId: null,
      path: '',
      component: '',
      sort: 1,
      icon: ''
    });
    formRef.value?.restoreValidation();
    emit('update:show', false);
    emit('submit');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <NDrawer
    :show="show"
    @update:show="value => emit('update:show', value)"
    :width="500"
  >
    <NDrawerContent :title="editingRecord ? t('common.edit') : t('common.add')">
      <NForm
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-placement="left"
        label-width="100"
        require-mark-placement="right-hanging"
      >
        <NFormItem :label="t('system.permission.name')" path="name">
          <NInput v-model:value="formModel.name" />
        </NFormItem>

        <NFormItem :label="t('system.permission.code')" path="code">
          <NInput v-model:value="formModel.code" />
        </NFormItem>

        <NFormItem :label="t('system.permission.type')" path="type">
          <NSelect
            v-model:value="formModel.type"
            :options="[
              { label: t('system.permission.menu'), value: 'menu' },
              { label: t('system.permission.operation'), value: 'operation' }
            ]"
          />
        </NFormItem>

        <NFormItem :label="t('system.permission.path')" path="path">
          <NInput v-model:value="formModel.path" />
        </NFormItem>

        <NFormItem :label="t('system.permission.component')" path="component">
          <NInput v-model:value="formModel.component" />
        </NFormItem>

        <NFormItem :label="t('system.permission.sort')" path="sort">
          <NInputNumber v-model:value="formModel.sort" style="width: 100%;"/>
        </NFormItem>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="emit('update:show', false)">{{ t('common.cancel') }}</NButton>
          <NButton type="primary" :loading="loading" @click="handleSubmit">
            {{ t('common.confirm') }}
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
