<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NSpace, NButton, NSelect } from 'naive-ui';
import type { FormInst } from 'naive-ui';
import type { RoleForm } from '@/service/api/role';

defineOptions({ name: 'RoleForm' });

interface Props {
  loading?: boolean;
  isEdit?: boolean;
  editData?: RoleForm | null;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  isEdit: false,
  editData: null
});

interface Emits {
  (e: 'update:show', value: boolean): void;
  (e: 'submit', data: RoleForm): void;
}

const emit = defineEmits<Emits>();
const { t } = useI18n();
const formRef = ref<FormInst | null>(null);

const show = defineModel<boolean>('show', {
  type: Boolean,
  default: false
});

const model = ref<RoleForm>({
  name: '',
  code: '',
  description: '',
  status: 'enable'
});

// 状态选项
const statusOptions = [
  { label: t('common.status.active'), value: 'active' },
  { label: t('common.status.inactive'), value: 'inactive' }
];

const rules = {
  name: {
    required: true,
    message: t('system.role.nameRequired'),
    trigger: ['blur', 'input']
  },
  code: {
    required: true,
    message: t('system.role.codeRequired'),
    trigger: ['blur', 'input']
  },
  status: {
    required: true,
    message: t('system.role.statusRequired'),
    trigger: ['blur', 'change']
  }
};

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    emit('submit', model.value);
  } catch (err) {
    // 表单验证失败
  }
}

// 关闭抽屉
function handleClose() {
  emit('update:show', false);
}

// 重置表单
function resetForm() {
  model.value = {
    name: '',
    code: '',
    description: '',
    status: 'enable'
  };
  formRef.value?.restoreValidation();
}

// 监听编辑数据变化
watch(
  () => props.editData,
  (newData) => {
    if (newData) {
      model.value = { ...newData };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// 监听抽屉关闭
watch(
  () => show.value,
  (newVal) => {
    if (!newVal) {
      resetForm();
    }
  }
);

// 获取标题
const getTitle = () => {
  if (props.isEdit) {
    return t('common.edit') + ' - ' + model.value.name;
  }
  return t('common.add');
};

defineExpose({
  resetForm
});
</script>

<template>
  <NDrawer v-model:show="show" :width="500">
    <NDrawerContent
      :title="getTitle()"
      :native-scrollbar="false"
    >
      <NForm
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        :label-width="100"
        require-mark-placement="right-hanging"
      >
        <NFormItem :label="t('system.role.name')" path="name">
          <NInput
            v-model:value="model.name"
            :placeholder="t('system.role.namePlaceholder')"
          />
        </NFormItem>

        <NFormItem :label="t('system.role.code')" path="code">
          <NInput
            v-model:value="model.code"
            :placeholder="t('system.role.codePlaceholder')"
            :disabled="isEdit"
          />
        </NFormItem>

        <NFormItem :label="t('system.role.description')" path="description">
          <NInput
            v-model:value="model.description"
            type="textarea"
            :placeholder="t('system.role.descriptionPlaceholder')"
          />
        </NFormItem>

        <NFormItem :label="t('system.role.status')" path="status">
          <NSelect
            v-model:value="model.status"
            :options="statusOptions"
            :placeholder="t('system.role.statusPlaceholder')"
          />
        </NFormItem>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="handleClose">
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
