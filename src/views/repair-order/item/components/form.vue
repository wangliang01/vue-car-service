<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NSpace,
  NButton,
  NGrid,
  NFormItemGi,
  NDynamicInput
} from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { createRepairItem, updateRepairItem } from '@/service/api/repair-item';
import { fetchMaterialList } from '@/service/api/material';

const { t } = useI18n();

const props = defineProps<{
  type: 'add' | 'edit';
  editData?: Api.RepairItem.RepairItemInfo | null;
}>();

const emits = defineEmits(['success', 'close']);

const show = defineModel('show', {
  type: Boolean,
  required: true
});

const formRef = ref();
const loading = ref(false);
const materials = ref<Api.Material.MaterialInfo[]>([]);

const formModel = ref<Api.RepairItem.CreateParams>({
  name: '',
  laborHours: 0,
  laborPrice: 0,
  complexityFactor: 1,
  laborDiscountRate: 1,
  materials: [],
  description: ''
});

// 获取材料列表
async function getMaterials() {
  try {
    const res = await fetchMaterialList({ current: 1, size: 999 });
    materials.value = res.records;
  } catch (error) {
    window.$message?.error(t('common.error'));
  }
}

getMaterials();

watch(
  () => props.editData,
  (val) => {
    if (val) {
      Object.assign(formModel.value, val);
    }
  }
);

function handleCancel() {
  show.value = false;
}

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    loading.value = true;

    if (props.type === 'add') {
      await createRepairItem(formModel.value);
    } else {
      await updateRepairItem(props.editData!._id, formModel.value);
    }

    window.$message?.success(t('common.success'));
    emits('success');
  } catch (error) {
    window.$message?.error(t('common.error'));
  } finally {
    loading.value = false;
  }
}

function handleClose() {
  formRef.value?.restoreValidation();
  Object.assign(formModel.value, {
    name: '',
    laborHours: 0,
    laborPrice: 0,
    complexityFactor: 1,
    laborDiscountRate: 1,
    materials: [],
    description: ''
  });
  emits('close');
}
</script>

<template>
  <NDrawer v-model:show="show" :width="800" placement="right" @close="handleClose">
    <NDrawerContent :title="t(type === 'add' ? 'common.add' : 'common.edit')" :native-scrollbar="false">
      <NForm ref="formRef" :model="formModel" label-placement="left" label-width="120">
        <NGrid :cols="2" :x-gap="24">
          <!-- 基本信息 -->
          <NFormItemGi :span="1">
            <NFormItem :label="t('repairItem.name')" path="name" class="w-full" :rule="{ required: true, message: t('common.required') }">
              <NInput v-model:value="formModel.name" class="w-full" />
            </NFormItem>
          </NFormItemGi>

          <NFormItemGi :span="1">
            <NFormItem :label="t('repairItem.laborHours')" path="laborHours" class="w-full" :rule="{ required: true, message: t('common.required') }">
              <NInputNumber v-model:value="formModel.laborHours" :min="0" :precision="1" class="w-full" />
            </NFormItem>
          </NFormItemGi>

          <NFormItemGi :span="1">
            <NFormItem :label="t('repairItem.laborPrice')" path="laborPrice" class="w-full" :rule="{ required: true, message: t('common.required') }">
              <NInputNumber v-model:value="formModel.laborPrice" :min="0" :precision="2" class="w-full" />
            </NFormItem>
          </NFormItemGi>

          <NFormItemGi :span="1">
            <NFormItem :label="t('repairItem.complexityFactor')" path="complexityFactor" class="w-full">
              <NInputNumber v-model:value="formModel.complexityFactor" :min="1" :precision="1" class="w-full" />
            </NFormItem>
          </NFormItemGi>

          <NFormItemGi :span="1">
            <NFormItem :label="t('repairItem.laborDiscountRate')" path="laborDiscountRate" class="w-full">
              <NInputNumber v-model:value="formModel.laborDiscountRate" :min="0" :max="1" :precision="2" class="w-full" />
            </NFormItem>
          </NFormItemGi>

          <!-- 材料信息 -->
          <NFormItemGi :span="2">
            <NFormItem :label="t('repairItem.materials')" path="materials">
              <NDynamicInput v-model:value="formModel.materials" :on-create="() => ({ materialId: '', quantity: 1, managementFeeRate: 0, materialDiscountRate: 1 })">
                <template #default="{ value }">
                  <NGrid :cols="4" :x-gap="12">
                    <NFormItem :rule="{ required: true, message: t('common.required') }">
                      <NSelect
                        v-model:value="value.materialId"
                        :options="materials.map(item => ({ label: item.name, value: item._id }))"
                        :placeholder="t('common.select')"
                      />
                    </NFormItem>
                    <NFormItem :rule="{ required: true, message: t('common.required') }">
                      <NInputNumber v-model:value="value.quantity" :min="1" :precision="0" />
                    </NFormItem>
                    <NFormItem>
                      <NInputNumber v-model:value="value.managementFeeRate" :min="0" :precision="2" />
                    </NFormItem>
                    <NFormItem>
                      <NInputNumber v-model:value="value.materialDiscountRate" :min="0" :max="1" :precision="2" />
                    </NFormItem>
                  </NGrid>
                </template>
              </NDynamicInput>
            </NFormItem>
          </NFormItemGi>

          <!-- 描述信息 -->
          <NFormItemGi :span="2">
            <NFormItem :label="t('common.remark')" path="description" class="w-full">
              <NInput v-model:value="formModel.description" type="textarea" :rows="3" class="w-full" />
            </NFormItem>
          </NFormItemGi>
        </NGrid>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="handleCancel">{{ t('common.cancel') }}</NButton>
          <NButton type="primary" :loading="loading" @click="handleSubmit">{{ t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>