<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NInputNumber, NSpace, NButton, NDatePicker, NSelect, NDivider } from 'naive-ui';
import type { FormInst } from 'naive-ui';

const { t } = useI18n();
const formRef = ref<FormInst | null>(null);

const show = defineModel<boolean>('show');
const loading = defineModel<boolean>('loading', { default: false });

interface RepairPart {
  name: string;
  quantity: number;
  purchasePrice: number;
  managementFee: number;
  managementDiscount: number;
}

interface RepairItem {
  name: string;
  laborHours: number;
  laborPrice: number;
  complexityFactor: number;
  laborDiscount: number;
  parts: RepairPart[];
}

const model = ref<{
  repairItems: RepairItem[];
  estimatedCompletionTime: string | null;
  mechanic: string;
}>({
  repairItems: [{
    name: '',
    laborHours: 0,
    laborPrice: 0,
    complexityFactor: 1,
    laborDiscount: 0,
    parts: [{
      name: '',
      quantity: 1,
      purchasePrice: 0,
      managementFee: 0.1,
      managementDiscount: 0
    }]
  }],
  estimatedCompletionTime: null,
  mechanic: ''
});

const rules = {
  repairItems: {
    type: 'array',
    required: true,
    message: t('repairOrder.repair.atLeastOneItem'),
    trigger: ['blur', 'change'],
    fields: {
      0: {
        type: 'object',
        fields: {
          name: {
            required: true,
            message: t('repairOrder.repair.nameRequired')
          },
          laborHours: {
            type: 'number',
            required: true,
            min: 0,
            message: t('repairOrder.repair.laborHoursInvalid')
          },
          laborPrice: {
            type: 'number',
            required: true,
            min: 0,
            message: t('repairOrder.repair.laborPriceInvalid')
          }
        }
      }
    }
  },
  estimatedCompletionTime: {
    required: true,
    message: t('repairOrder.repair.estimatedTimeRequired')
  },
  mechanic: {
    required: true,
    message: t('repairOrder.repair.mechanicRequired')
  }
};

const emit = defineEmits(['submit']);

// 添加维修项目
function addRepairItem() {
  model.value.repairItems.push({
    name: '',
    laborHours: 0,
    laborPrice: 0,
    complexityFactor: 1,
    laborDiscount: 0,
    parts: []
  });
}

// 删除维修项目
function removeRepairItem(index: number) {
  model.value.repairItems.splice(index, 1);
}

// 添加配件
function addPart(repairItemIndex: number) {
  model.value.repairItems[repairItemIndex].parts.push({
    name: '',
    quantity: 1,
    purchasePrice: 0,
    managementFee: 0.1,
    managementDiscount: 0
  });
}

// 删除配件
function removePart(repairItemIndex: number, partIndex: number) {
  model.value.repairItems[repairItemIndex].parts.splice(partIndex, 1);
}

// 计算工时费
const laborAmount = computed(() => {
  return model.value.repairItems.reduce((total, item) => {
    const amount = item.laborHours * item.laborPrice * item.complexityFactor;
    return total + amount * (1 - item.laborDiscount);
  }, 0);
});

// 计算配件费
const partsAmount = computed(() => {
  return model.value.repairItems.reduce((total, item) => {
    return total + item.parts.reduce((partTotal, part) => {
      const managementAmount = part.purchasePrice * part.managementFee;
      const finalManagementAmount = managementAmount * (1 - part.managementDiscount);
      return partTotal + (part.purchasePrice + finalManagementAmount) * part.quantity;
    }, 0);
  }, 0);
});

// 总金额
const totalAmount = computed(() => {
  return laborAmount.value + partsAmount.value;
});

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    emit('submit', model.value);
  } catch (err) {
    // 表单验证失败
  }
}
</script>

<template>
  <NDrawer v-model:show="show" :width="720">
    <NDrawerContent :title="t('repairOrder.repair.title')" :native-scrollbar="false">
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="100">
        <div v-for="(repairItem, repairIndex) in model.repairItems" :key="repairIndex">
          <NDivider>{{ t('repairOrder.repair.items') }} #{{ repairIndex + 1 }}</NDivider>
          
          <!-- 维修项目基本信息 -->
          <NFormItem :label="t('repairOrder.repair.itemName')" :path="`repairItems[${repairIndex}].name`">
            <NInput v-model:value="repairItem.name" />
          </NFormItem>
          
          <NSpace :wrap="false" :size="24">
            <NFormItem :label="t('repairOrder.repair.laborHours')" :path="`repairItems[${repairIndex}].laborHours`">
              <NInputNumber v-model:value="repairItem.laborHours" :min="0" :precision="1" />
            </NFormItem>
            
            <NFormItem :label="t('repairOrder.repair.laborPrice')" :path="`repairItems[${repairIndex}].laborPrice`">
              <NInputNumber v-model:value="repairItem.laborPrice" :min="0" />
            </NFormItem>
            
            <NFormItem :label="t('repairOrder.repair.complexityFactor')">
              <NInputNumber v-model:value="repairItem.complexityFactor" :min="0" :precision="1" :step="0.1" />
            </NFormItem>
            
            <NFormItem :label="t('repairOrder.repair.laborDiscount')">
              <NInputNumber v-model:value="repairItem.laborDiscount" :min="0" :max="1" :precision="2" :step="0.1" />
            </NFormItem>
          </NSpace>

          <!-- 配件列表 -->
          <div class="parts-list">
            <div class="parts-header">
              <span>{{ t('repairOrder.repair.parts') }}</span>
              <NButton text type="primary" @click="addPart(repairIndex)">
                <template #icon>
                  <div class="i-material-symbols:add" />
                </template>
                {{ t('common.add') }}
              </NButton>
            </div>

            <div v-for="(part, partIndex) in repairItem.parts" :key="partIndex" class="part-item">
              <NSpace :wrap="false" :size="24">
                <NFormItem :label="t('repairOrder.repair.partName')" :path="`repairItems[${repairIndex}].parts[${partIndex}].name`">
                  <NInput v-model:value="part.name" />
                </NFormItem>
                
                <NFormItem :label="t('repairOrder.repair.quantity')" :path="`repairItems[${repairIndex}].parts[${partIndex}].quantity`">
                  <NInputNumber v-model:value="part.quantity" :min="1" />
                </NFormItem>
                
                <NFormItem :label="t('repairOrder.repair.purchasePrice')" :path="`repairItems[${repairIndex}].parts[${partIndex}].purchasePrice`">
                  <NInputNumber v-model:value="part.purchasePrice" :min="0" />
                </NFormItem>
              </NSpace>

              <NSpace :wrap="false" :size="24">
                <NFormItem :label="t('repairOrder.repair.managementFee')" :path="`repairItems[${repairIndex}].parts[${partIndex}].managementFee`">
                  <NInputNumber v-model:value="part.managementFee" :min="0" :max="1" :precision="2" :step="0.1" />
                </NFormItem>
                
                <NFormItem :label="t('repairOrder.repair.managementDiscount')" :path="`repairItems[${repairIndex}].parts[${partIndex}].managementDiscount`">
                  <NInputNumber v-model:value="part.managementDiscount" :min="0" :max="1" :precision="2" :step="0.1" />
                </NFormItem>

                <NButton text type="error" @click="removePart(repairIndex, partIndex)">
                  <template #icon>
                    <div class="i-material-symbols:delete" />
                  </template>
                </NButton>
              </NSpace>
            </div>
          </div>

          <NButton text type="error" @click="removeRepairItem(repairIndex)">
            {{ t('common.delete') }}
          </NButton>
        </div>

        <NButton class="mt-4" @click="addRepairItem">
          <template #icon>
            <div class="i-material-symbols:add" />
          </template>
          {{ t('repairOrder.repair.addItem') }}
        </NButton>

        <NDivider />

        <!-- 预计完工时间和维修技师 -->
        <NFormItem :label="t('repairOrder.repair.estimatedTime')" path="estimatedCompletionTime">
          <NDatePicker v-model:value="model.estimatedCompletionTime" type="datetime" clearable />
        </NFormItem>

        <NFormItem :label="t('repairOrder.repair.mechanic')" path="mechanic">
          <NInput v-model:value="model.mechanic" />
        </NFormItem>

        <!-- 金额汇总 -->
        <NDivider />
        <div class="amount-summary">
          <div class="amount-item">
            <span>{{ t('repairOrder.repair.laborAmount') }}:</span>
            <span class="amount">¥{{ laborAmount.toFixed(2) }}</span>
          </div>
          <div class="amount-item">
            <span>{{ t('repairOrder.repair.partsAmount') }}:</span>
            <span class="amount">¥{{ partsAmount.toFixed(2) }}</span>
          </div>
          <div class="amount-item total">
            <span>{{ t('repairOrder.repair.totalAmount') }}:</span>
            <span class="amount">¥{{ totalAmount.toFixed(2) }}</span>
          </div>
        </div>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="show = false">
            {{ t('common.cancel') }}
          </NButton>
          <NButton type="primary" :loading="loading" @click="handleSubmit">
            {{ t('common.confirm') }}
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.parts-list {
  margin: 16px 0;
  padding: 16px;
  background-color: var(--n-card-color);
  border-radius: 3px;
}

.parts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.part-item {
  padding: 16px;
  margin-bottom: 16px;
  border: 1px dashed var(--n-border-color);
  border-radius: 3px;
}

.amount-summary {
  padding: 16px;
  background-color: var(--n-card-color);
  border-radius: 3px;
}

.amount-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.amount-item.total {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--n-border-color);
  font-weight: bold;
}

.amount {
  color: var(--n-text-color-success);
}
</style> 