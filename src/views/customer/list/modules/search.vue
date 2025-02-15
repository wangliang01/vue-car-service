<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { NCard, NCollapse, NCollapseItem, NForm, NGrid, NFormItemGi, NInput, NSelect, NSpace, NButton } from 'naive-ui';

defineOptions({ name: 'CustomerSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();
const { t } = useI18n();

const { formRef } = useNaiveForm();

const model = defineModel<Api.Customer.CustomerSearchParams>('model', { required: true });

// 性别选项
const genderOptions = [
  { label: t('common.gender.male'), value: 'male' },
  { label: t('common.gender.female'), value: 'female' }
];

// 状态选项
const statusOptions = [
  { label: t('common.status.enable'), value: 'enable' },
  { label: t('common.status.disable'), value: 'disable' }
];

type RuleKey = Extract<keyof Api.Customer.CustomerSearchParams, 'email' | 'phone'>;

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const { patternRules } = useFormRules();

  return {
    email: patternRules.email,
    phone: patternRules.phone
  };
});

async function reset() {
  emit('reset');
}

async function search() {
  emit('search');
}

</script>

<template>
  <NCard :bordered="false" size="small">
    <NCollapse :default-expanded-names="['0']">
      <NCollapseItem :title="t('common.search')" name="0">
        <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" :label="t('menu.customer.name')" path="name">
              <NInput v-model:value="model.name" :placeholder="t('menu.customer.nameSearch')" clearable @keyup.enter="search"/>
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="t('menu.customer.email')" path="email">
              <NInput v-model:value="model.email" :placeholder="t('menu.customer.emailSearch')" clearable @keyup.enter="search"/>
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="t('menu.customer.phone')" path="phone">
              <NInput v-model:value="model.phone" :placeholder="t('menu.customer.phoneSearch')" clearable @keyup.enter="search"/>
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="t('menu.customer.address')" path="address">
              <NInput v-model:value="model.address" :placeholder="t('menu.customer.addressSearch')" clearable @keyup.enter="search"/>
            </NFormItemGi>
            <NFormItemGi span="24">
              <NSpace class="w-full" justify="end">
                <NButton @click="reset" ghost>
                  <template #icon>
                    <div class="i-material-symbols:refresh text-16px flex-center" />
                  </template>
                  {{ t('common.reset') }}
                </NButton>
                <NButton type="primary"  @click="search">
                  <template #icon>
                    <div class="i-material-symbols:search text-16px flex-center" />
                  </template>
                  {{ t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped>
:deep(.n-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.n-button .n-button__icon) {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* 确保图标元素有正确的尺寸 */
:deep(.n-button .n-button__icon div) {
  width: 16px;
  height: 16px;
  display: inline-flex;
}
</style>
