<template>
  <n-drawer
    :show="visible"
    :width="500"
    :placement="placement"
    @update:show="emit('update:visible', $event)"
  >
    <n-drawer-content :title="t('settlement.edit')" :native-scrollbar="false">
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="100"
        require-mark-placement="right-hanging"
      >
        <n-form-item :label="t('settlement.createTime')" path="fillDate">
          <n-date-picker
            v-model:value="model.fillDate"
            type="date"
            clearable
            :format="dateFormat"
            style="width: 100%"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="emit('update:visible', false)">{{ t('common.cancel') }}</n-button>
          <n-button type="primary" :loading="loading" @click="handleSubmit">
            {{ t('common.confirm') }}
          </n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDrawer, NDrawerContent, NForm, NFormItem, NDatePicker, NButton, NSpace, DrawerPlacement, type FormRules, type FormItemRule } from 'naive-ui';
import { updateSettlement } from '@/service/api/settlement';

const { t } = useI18n();
const formRef = ref(null);
const loading = ref(false);
const placement = ref<DrawerPlacement>('right');
const dateFormat = 'yyyy-MM-dd';

interface Props {
  visible: boolean;
  data?: Api.Settlement.SettlementInfo;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  'submit-success': [];
}>();

const model = ref({
  fillDate: null as number | null
});

const rules: FormRules = {
  fillDate: {
    required: true,
    message: '请选择填表日期',
    trigger: ['blur', 'change'],
    validator: (rule: any, value: any) => {
      if (!value) {
        return new Error('请选择填表日期');
      }
      return true;
    }
  }
} as const;

watch(
  () => props.data,
  (newVal) => {
    if (newVal) {
      console.log('newVal:', newVal);
      if (newVal.fillDate) {
        const date = new Date(newVal.fillDate);
        model.value.fillDate = date.getTime();
        console.log('设置时间:', model.value.fillDate);
      }
    }
  },
  { immediate: true }
);

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    loading.value = true;

    await updateSettlement(props.data?._id, {
      fillDate: model.value.fillDate
    });

    emit('submit-success');
    emit('update:visible', false);
  } catch (error) {
    console.error('提交错误:', error);
  } finally {
    loading.value = false;
  }
}
</script>
