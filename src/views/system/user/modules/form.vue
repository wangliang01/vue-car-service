<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NSpace, NButton, NSelect } from 'naive-ui';
import type { FormInst } from 'naive-ui';
import type { UserForm } from '@/service/api/user';

defineOptions({ name: 'UserForm' });

interface Props {
  loading?: boolean;
  isEdit?: boolean;
  editData?: UserForm | null;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  isEdit: false,
  editData: null
});

interface Emits {
  (e: 'update:show', value: boolean): void;
  (e: 'submit', data: UserForm): void;
}

const emit = defineEmits<Emits>();
const { t } = useI18n();
const formRef = ref<FormInst | null>(null);

const show = defineModel<boolean>('show', {
  type: Boolean,
  default: false
});

const model = ref<UserForm>({
  username: '',
  password: '',
  name: '',
  phone: '',
  email: '',
  type: 'user'
});

// 用户类型选项
const typeOptions = [
  { label: t('system.user.typeAdmin'), value: 'admin' },
  { label: t('system.user.typeUser'), value: 'user' }
];

const rules = {
  username: {
    required: true,
    message: t('system.user.usernameRequired'),
    trigger: ['blur', 'input']
  },
  password: {
    required: !props.isEdit,
    message: t('system.user.passwordRequired'),
    trigger: ['blur', 'input']
  },
  name: {
    required: true,
    message: t('system.user.nameRequired'),
    trigger: ['blur', 'input']
  },
  phone: {
    required: true,
    message: t('system.user.phoneRequired'),
    trigger: ['blur', 'input'],
    pattern: /^1[3-9]\d{9}$/
  },
  email: {
    required: false,
    message: t('system.user.emailRequired'),
    trigger: ['blur', 'input'],
    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  },
  type: {
    required: true,
    message: t('system.user.typeRequired'),
    trigger: ['blur', 'change']
  }
};

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    const submitData = { ...model.value };
    // 编辑时不提交密码字段
    if (props.isEdit) {
      delete submitData.password;
    }
    emit('submit', submitData);
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
    username: '',
    password: '',
    name: '',
    phone: '',
    email: '',
    type: 'user'
  };
  formRef.value?.restoreValidation();
}

// 监听编辑数据变化
watch(
  () => props.editData,
  (newData) => {
    if (newData) {
      model.value = { ...newData };

      console.log(model.value);
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
const title = computed(() => {
  if (props.isEdit) {
    return t('common.edit') + ' - ' + model.value.username;
  }
  return t('common.add');
});

defineExpose({
  resetForm
});
</script>

<template>
  <NDrawer v-model:show="show" :width="500">
    <NDrawerContent 
      :title="title"
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
        <NFormItem :label="t('system.user.username')" path="username">
          <NInput 
            v-model:value="model.username" 
            :placeholder="t('system.user.usernamePlaceholder')"
            :disabled="isEdit"
          />
        </NFormItem>

        <NFormItem 
          v-if="!isEdit"
          :label="t('system.user.password')" 
          path="password"
        >
          <NInput
            v-model:value="model.password"
            type="password"
            show-password-on="click"
            :placeholder="t('system.user.passwordPlaceholder')"
          />
        </NFormItem>

        <NFormItem :label="t('system.user.name')" path="name">
          <NInput 
            v-model:value="model.name" 
            :placeholder="t('system.user.namePlaceholder')"
          />
        </NFormItem>

        <NFormItem :label="t('system.user.phone')" path="phone">
          <NInput 
            v-model:value="model.phone" 
            :placeholder="t('system.user.phonePlaceholder')"
          />
        </NFormItem>

        <NFormItem :label="t('system.user.email')" path="email">
          <NInput 
            v-model:value="model.email" 
            :placeholder="t('system.user.emailPlaceholder')"
          />
        </NFormItem>

        <NFormItem :label="t('system.user.type')" path="type">
          <NSelect
            v-model:value="model.type"
            :options="typeOptions"
            :placeholder="t('system.user.typePlaceholder')"
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