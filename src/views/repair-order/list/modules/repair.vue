<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NInputNumber, NSpace, NButton, NGrid, NGridItem, NCard, NDatePicker } from 'naive-ui'
import type { RepairItem, RepairPart } from '@/types/repair-order'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  show: boolean
  orderId: string | null
}>(), {
  show: false,
  orderId: null
})

const emit = defineEmits<{
  'update:show': [value: boolean]
  'submit': [orderId: string, data: RepairData]
}>()

interface RepairData {
  repairItems: RepairItem[]
  estimatedCompletionTime: number | null
  mechanic: string
}

const repairData = ref<RepairData>({
  repairItems: [],
  estimatedCompletionTime: null,
  mechanic: ''
})

const drawerTitle = computed(() => t('repairOrder.repair.title'))

// 添加表单引用和校验方法
const formRef = ref<typeof NForm | null>(null)

// 定义校验规则
const rules = {
  repairItems: {
    type: 'array' as const,
    message: t('common.required'),
    trigger: 'submit',
    validator: (rule: any, value: RepairItem[]) => {
      if (!value || value.length === 0) {
        return new Error(t('repairOrder.repair.atLeastOneItem'))
      }
      return true
    }
  },
  'repairItems.*': {
    type: 'object',
    trigger: 'submit',
    rule: {
      name: {
        required: true,
        trigger: 'blur',
        validator: (rule: any, value: string) => {
          if (!value?.trim()) {
            return new Error(t('repairOrder.repair.nameRequired'))
          }
          return true
        }
      },
      price: {
        required: true,
        trigger: ['input', 'change'],
        validator: (rule: any, value: number) => {
          if (typeof value !== 'number' || value < 0) {
            return new Error(t('repairOrder.repair.priceInvalid'))
          }
          return true
        }
      }
    }
  },
  estimatedCompletionTime: {
    required: true,
    trigger: ['blur', 'change'],
    message: t('repairOrder.repair.estimatedTimeRequired')
  },
  mechanic: {
    required: true,
    trigger: 'blur',
    message: t('repairOrder.repair.mechanicRequired')
  }
}

// 计算维修项目总价
function calculateItemTotal(item: RepairItem) {
  // 配件总价
  const partsTotal = item.parts.reduce((sum, part) => {
    return sum + (part.price * part.quantity)
  }, 0)
  return partsTotal
}

// 监听配件变化，自动更新维修费用
function updateItemPrice(item: RepairItem) {
  item.price = calculateItemTotal(item)
}

function addRepairItem() {
  repairData.value.repairItems.push({
    name: '',
    price: 0, // 初始价格为0
    parts: []
  })
}

function removeRepairItem(index: number) {
  repairData.value.repairItems.splice(index, 1)
}

function addPart(item: RepairItem) {
  item.parts.push({
    name: '',
    quantity: 1,
    price: 0
  })
}

function removePart(item: RepairItem, index: number) {
  item.parts.splice(index, 1)
}

// 当配件数量或价格变化时更新维修费用
function handlePartChange(item: RepairItem) {
  updateItemPrice(item)
}

function handleClose() {
  emit('update:show', false)
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    
    const { repairItems } = repairData.value
    if (!repairItems.length) {
      window.$message?.warning(t('repairOrder.repair.atLeastOneItem'))
      return
    }

    if (props.orderId) {
      const submitData = {
        ...repairData.value
      }
      emit('submit', props.orderId, submitData)
      handleClose()
    }
  } catch (errors) {
    console.error('Validation error:', errors)
    window.$message?.error(t('common.invalidForm'))
  }
}
</script>

<template>
  <NDrawer
    :show="show"
    @update:show="emit('update:show', $event)"
    :width="800"
    placement="right"
  >
    <NDrawerContent :title="drawerTitle">
      <NForm
        ref="formRef"
        :model="repairData"
        :rules="rules"
      >
        <div class="section">
          <div class="section-header">
            <div class="flex justify-between items-center">
              <span>{{ t('repairOrder.repair.items') }}</span>
              <NButton size="small" type="primary" ghost @click="addRepairItem">
                <template #icon>
                  <div class="i-material-symbols:add" />
                </template>
                {{ t('common.add') }}
              </NButton>
            </div>
          </div>
          <NSpace vertical>
            <NCard 
              v-for="(item, index) in repairData.repairItems" 
              :key="index" 
              size="small"
              class="relative"
            >
              <div class="absolute right-2 top-2">
                <NButton 
                  circle
                  size="tiny"
                  type="error"
                  ghost
                  @click="removeRepairItem(index)"
                >
                  <template #icon>
                    <div class="i-material-symbols:close" />
                  </template>
                </NButton>
              </div>
              <NGrid :cols="24" :x-gap="12">
                <NGridItem :span="12">
                  <NFormItem 
                    :label="t('repairOrder.repair.itemName')"
                    required
                  >
                    <NInput v-model:value="item.name" />
                  </NFormItem>
                </NGridItem>
                <NGridItem :span="12">
                  <NFormItem 
                    :label="t('repairOrder.repair.price')"
                    required
                  >
                    <NInputNumber 
                      v-model:value="item.price" 
                      :min="0" 
                      readonly 
                      disabled
                    />
                  </NFormItem>
                </NGridItem>
              </NGrid>

              <!-- 配件列表 -->
              <div class="mt-4">
                <div class="flex justify-between items-center mb-2">
                  <span>{{ t('repairOrder.repair.parts') }}</span>
                  <NButton size="tiny" type="primary" ghost @click="addPart(item)">
                    <template #icon>
                      <div class="i-material-symbols:add" />
                    </template>
                    {{ t('common.add') }}
                  </NButton>
                </div>
                <NSpace vertical>
                  <NCard 
                    v-for="(part, partIndex) in item.parts" 
                    :key="partIndex"
                    size="small"
                    class="relative"
                  >
                    <div class="absolute right-2 top-2">
                      <NButton 
                        circle
                        size="tiny"
                        type="error"
                        ghost
                        @click="removePart(item, partIndex)"
                      >
                        <template #icon>
                          <div class="i-material-symbols:close" />
                        </template>
                      </NButton>
                    </div>
                    <NGrid :cols="24" :x-gap="12">
                      <NGridItem :span="8">
                        <NFormItem 
                          :label="t('repairOrder.repair.partName')"
                          required
                        >
                          <NInput v-model:value="part.name" />
                        </NFormItem>
                      </NGridItem>
                      <NGridItem :span="8">
                        <NFormItem 
                          :label="t('repairOrder.repair.quantity')"
                          required
                        >
                          <NInputNumber 
                            v-model:value="part.quantity" 
                            :min="1" 
                            @update:value="() => handlePartChange(item)"
                          />
                        </NFormItem>
                      </NGridItem>
                      <NGridItem :span="8">
                        <NFormItem 
                          :label="t('repairOrder.repair.partPrice')"
                          required
                        >
                          <NInputNumber 
                            v-model:value="part.price" 
                            :min="0"
                            @update:value="() => handlePartChange(item)"
                          />
                        </NFormItem>
                      </NGridItem>
                    </NGrid>
                  </NCard>
                </NSpace>
              </div>
            </NCard>
          </NSpace>
        </div>

        <NGrid :cols="24" :x-gap="12">
          <NGridItem :span="12">
            <NFormItem 
              :label="t('repairOrder.repair.estimatedTime')"
              required
            >
              <NDatePicker
                v-model:value="repairData.estimatedCompletionTime"
                type="datetime"
                clearable
                value-format="yyyy.MM.dd HH:mm:ss"
                :is-date-disabled="(timestamp: number) => timestamp < Date.now()"
              />
            </NFormItem>
          </NGridItem>
          <NGridItem :span="12">
            <NFormItem 
              :label="t('repairOrder.repair.mechanic')"
              required
            >
              <NInput v-model:value="repairData.mechanic" />
            </NFormItem>
          </NGridItem>
        </NGrid>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="handleClose">
            {{ t('common.cancel') }}
          </NButton>
          <NButton type="primary" @click="handleSubmit">
            {{ t('common.confirm') }}
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.section {
  margin-bottom: 24px;
}

.section-header {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.right-2 {
  right: 8px;
}

.top-2 {
  top: 8px;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.mt-4 {
  margin-top: 16px;
}

.mb-2 {
  margin-bottom: 8px;
}
</style> 