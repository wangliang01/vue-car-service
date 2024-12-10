import { ref } from 'vue';
import type { FormInst } from 'naive-ui';

export function useNaiveForm() {
  const formRef = ref<FormInst | null>(null);

  async function validate() {
    await formRef.value?.validate();
  }

  return {
    formRef,
    validate
  };
}

export function useFormRules() {
  const patternRules = {
    email: {
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: '邮箱格式不正确',
      trigger: 'blur'
    },
    phone: {
      pattern: /^1[3456789]\d{9}$/,
      message: '手机号格式不正确', 
      trigger: 'blur'
    }
  };

  return {
    patternRules
  };
}
