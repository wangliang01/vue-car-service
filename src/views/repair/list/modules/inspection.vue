<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NSelect, NInputNumber, NSpace, NButton, NGrid, NGridItem, NCard, NUpload, NImage } from 'naive-ui'
import { uploadFile } from '@/service/api/upload';
import { deleteFile } from '@/service/api/upload';

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
  'submit': [orderId: string, data: InspectionData]
}>()

interface InspectionItem {
  name: string
  result: 'normal' | 'abnormal'
  remark: string
  images: Array<{
    id: string
    url: string
  }>
}

interface CustomerItem {
  name: string
  quantity: number
  remark: string
  images: Array<{
    id: string
    url: string
  }>
}

interface InspectionData {
  inspectionItems: InspectionItem[]
  customerItems: CustomerItem[]
}

const inspectionData = ref<InspectionData>({
  inspectionItems: [],
  customerItems: []
})

const drawerTitle = computed(() => t('repairOrder.inspection.title'))

function addInspectionItem() {
  inspectionData.value.inspectionItems.push({
    name: '',
    result: 'normal',
    remark: '',
    images: []
  })
}

function removeInspectionItem(index: number) {
  inspectionData.value.inspectionItems.splice(index, 1)
}

function addCustomerItem() {
  inspectionData.value.customerItems.push({
    name: '',
    quantity: 1,
    remark: '',
    images: []
  })
}

function removeCustomerItem(index: number) {
  inspectionData.value.customerItems.splice(index, 1)
}

function handleClose() {
  emit('update:show', false)
}

// 添加表单引用和校验方法
const formRef = ref<typeof NForm | null>(null)

// 定义校验规则
const rules = {
  inspectionItems: {
    type: 'array' as const,
    message: t('common.required'),
    trigger: 'submit',
    validator: (rule: any, value: InspectionItem[]) => {
      if (!value || value.length === 0) {
        return new Error(t('repairOrder.inspection.atLeastOneItem'))
      }
      return true
    }
  },
  'inspectionItems.*': {
    type: 'object' as const,
    trigger: 'submit',
    rule: {
      name: {
        required: true,
        trigger: 'blur',
        validator: (rule: any, value: string) => {
          if (!value?.trim()) {
            return new Error(t('repairOrder.inspection.nameRequired'))
          }
          return true
        }
      },
      result: {
        required: true,
        trigger: 'change',
        validator: (rule: any, value: string) => {
          if (!value) {
            return new Error(t('repairOrder.inspection.resultRequired'))
          }
          return true
        }
      }
    }
  },
  customerItems: {
    type: 'array' as const,
    trigger: 'submit',
    validator: (rule: any, value: CustomerItem[]) => {
      if (value && value.length > 0) {
        return true
      }
      return true
    }
  },
  'customerItems.*': {
    type: 'object' as const,
    trigger: 'submit',
    rule: {
      name: {
        required: true,
        trigger: 'blur',
        validator: (rule: any, value: string) => {
          if (!value?.trim()) {
            return new Error(t('repairOrder.inspection.customerItemNameRequired'))
          }
          return true
        }
      },
      quantity: {
        required: true,
        trigger: ['input', 'change'],
        validator: (rule: any, value: number) => {
          if (typeof value !== 'number' || value < 0) {
            return new Error(t('repairOrder.inspection.quantityInvalid'))
          }
          return true
        }
      }
    }
  }
}

// 修改提交方法
async function handleSubmit() {
  try {
    // 表单校验
    await formRef.value?.validate()

    // 在提交前再次确认数据的完整性
    const { inspectionItems } = inspectionData.value
    if (!inspectionItems.length) {
      window.$message?.warning(t('repairOrder.inspection.atLeastOneItem'))
      return
    }

    // 检查所有必填字段
    const hasInvalidItem = inspectionItems.some(item =>
      !item.name?.trim() || !item.result
    )

    if (hasInvalidItem) {
      window.$message?.warning(t('repairOrder.inspection.completeAllRequired'))
      return
    }

    if (props.orderId) {
      emit('submit', props.orderId, inspectionData.value)
      handleClose() // 提交成功后关闭抽屉
    }
  } catch (errors) {
    console.error('Validation error:', errors)
    window.$message?.error(t('common.invalidForm'))
  }
}

// 修改上传配置
const uploadConfig = {
  max: 5,
  accept: '.jpg,.jpeg,.png',
  listType: 'image-card' as const,
  'show-file-list': true,
  customRequest: handleCustomUpload,
  beforeUpload
}

// 自定义上传方法
async function handleCustomUpload({ file, onFinish, onError, item }: {
  file: { file: File }
  onFinish: (response: any) => void
  onError: (err: Error) => void
  item: InspectionItem | CustomerItem
}) {
  try {
    const { data } = await uploadFile(file.file, 'inspection');
    if (!item.images) {
      item.images = [];
    }
    item.images.push({
      id: data.id,
      url: data.url
    });
    onFinish(data);
    window.$message?.success(t('common.uploadSuccess'));
  } catch (error: any) {
    onError(error);
    window.$message?.error(error.message || t('common.uploadFailed'));
  }
}

// 添加删除图片的方法
async function handleRemoveImage(item: InspectionItem, imageId: string) {
  try {
    await deleteFile(imageId);
    const index = item.images?.findIndex(img => img.id === imageId);
    if (index !== undefined && index > -1) {
      item.images?.splice(index, 1);
    }
    window.$message?.success(t('common.deleteSuccess'));
  } catch (error) {
    window.$message?.error(t('common.error'));
  }
}

// 预览相关
const showPreview = ref(false)
const previewImages = ref<string[]>([])
const previewIndex = ref(0)

function handlePreview(item: InspectionItem) {
  if (item.images && item.images.length > 0) {
    previewImages.value = item.images.map(img => img.url)
    previewIndex.value = 0
    showPreview.value = true
  }
}

// 上传前验证
function beforeUpload(file: File) {
  // 验证文件大小(例如最大5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    window.$message?.error(t('common.fileTooLarge'))
    return false
  }

  // 验证文件类型
  const allowTypes = ['image/jpeg', 'image/png']
  if (!allowTypes.includes(file.type)) {
    window.$message?.error(t('common.invalidFileType'))
    return false
  }

  return true
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
        :model="inspectionData"
        :rules="rules"
      >
        <div class="section">
          <div class="section-header">
            <div class="flex justify-between items-center">
              <span>{{ t('repairOrder.inspection.items') }}</span>
              <NButton size="small" type="primary" ghost @click="addInspectionItem">
                <template #icon>
                  <div class="i-material-symbols:add" />
                </template>
                {{ t('common.add') }}
              </NButton>
            </div>
          </div>
          <NSpace vertical>
            <NCard
              v-for="(item, index) in inspectionData.inspectionItems"
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
                  @click="removeInspectionItem(index)"
                >
                  <template #icon>
                    <div class="i-material-symbols:close" />
                  </template>
                </NButton>
              </div>
              <NGrid :cols="24" :x-gap="12">
                <NGridItem :span="6">
                  <NFormItem
                    :label="t('repairOrder.inspection.itemName')"
                    required
                  >
                    <NInput v-model:value="item.name" />
                  </NFormItem>
                </NGridItem>
                <NGridItem :span="6">
                  <NFormItem
                    :label="t('repairOrder.inspection.result')"
                    required
                  >
                    <NSelect
                      v-model:value="item.result"
                      :options="[
                        { label: t('repairOrder.inspection.normal'), value: 'normal' },
                        { label: t('repairOrder.inspection.abnormal'), value: 'abnormal' }
                      ]"
                    />
                  </NFormItem>
                </NGridItem>
                <NGridItem :span="12">
                  <NFormItem :label="t('repairOrder.inspection.remark')">
                    <NInput v-model:value="item.remark" type="textarea" :rows="1" />
                  </NFormItem>
                </NGridItem>
                <NGridItem :span="24">
                  <NFormItem :label="t('repairOrder.inspection.images')">
                    <div class="upload-container">
                      <div class="image-preview-list">
                        <div
                          v-for="image in item.images"
                          :key="image.id"
                          class="image-preview-item"
                          @click="() => handlePreview(item)"
                        >
                          <NImage
                            :src="image.url"
                            class="preview-image"
                            object-fit="contain"
                          />
                          <div class="image-actions">
                            <NButton
                              circle
                              size="tiny"
                              type="error"
                              ghost
                              @click.stop="() => handleRemoveImage(item, image.id)"
                            >
                              <template #icon>
                                <div class="i-material-symbols:close" />
                              </template>
                            </NButton>
                          </div>
                        </div>
                        <NUpload
                          v-bind="uploadConfig"
                          :custom-request="(options) => handleCustomUpload({ ...options, item })"
                        >
                          <div class="upload-trigger">
                            <div class="i-material-symbols:add text-2xl" />
                          </div>
                        </NUpload>
                      </div>
                    </div>
                  </NFormItem>
                </NGridItem>
              </NGrid>
            </NCard>
          </NSpace>
        </div>

        <div class="section">
          <div class="section-header">
            <div class="flex justify-between items-center">
              <span>{{ t('repairOrder.inspection.customerItems.title') }}</span>
              <NButton size="small" type="primary" ghost @click="addCustomerItem">
                <template #icon>
                  <div class="i-material-symbols:add" />
                </template>
                {{ t('common.add') }}
              </NButton>
            </div>
          </div>
          <NSpace vertical>
            <NCard
              v-for="(item, index) in inspectionData.customerItems"
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
                  @click="removeCustomerItem(index)"
                >
                  <template #icon>
                    <div class="i-material-symbols:close" />
                  </template>
                </NButton>
              </div>
              <NGrid :cols="24" :x-gap="12">
                <NGridItem :span="8">
                  <NFormItem
                    :label="t('repairOrder.inspection.customerItems.name')"
                    required
                  >
                    <NInput v-model:value="item.name" />
                  </NFormItem>
                </NGridItem>
                <NGridItem :span="4">
                  <NFormItem
                    :label="t('repairOrder.inspection.customerItems.quantity')"
                    required
                  >
                    <NInputNumber v-model:value="item.quantity" :min="0" />
                  </NFormItem>
                </NGridItem>
                <NGridItem :span="12">
                  <NFormItem :label="t('repairOrder.inspection.customerItems.remark')">
                    <NInput v-model:value="item.remark" type="textarea" :rows="1" />
                  </NFormItem>
                </NGridItem>
                <NGridItem :span="24">
                  <NFormItem :label="t('repairOrder.inspection.customerItems.images')">
                    <div class="upload-container">
                      <div class="image-preview-list">
                        <div
                          v-for="image in item.images"
                          :key="image.id"
                          class="image-preview-item"
                          @click="() => handlePreview(item as any)"
                        >
                          <NImage
                            :src="image.url"
                            class="preview-image"
                            object-fit="contain"
                          />
                          <div class="image-actions">
                            <NButton
                              circle
                              size="tiny"
                              type="error"
                              ghost
                              @click.stop="() => handleRemoveImage(item as any, image.id)"
                            >
                              <template #icon>
                                <div class="i-material-symbols:close" />
                              </template>
                            </NButton>
                          </div>
                        </div>
                        <NUpload
                          v-bind="uploadConfig"
                          :custom-request="(options) => handleCustomUpload({ ...options, item })"
                        >
                          <div class="upload-trigger">
                            <div class="i-material-symbols:add text-2xl" />
                          </div>
                        </NUpload>
                      </div>
                    </div>
                  </NFormItem>
                </NGridItem>
              </NGrid>
            </NCard>
          </NSpace>
        </div>
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

.upload-container {
  width: 100%;
}

.image-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.image-preview-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  background-color: #f5f7fa;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 1;
}

.image-preview-item:hover .image-actions {
  opacity: 1;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-trigger:hover {
  border-color: var(--primary-color);
}

.upload-text {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

:deep(.n-upload-trigger) {
  width: 100px;
  height: 100px;
}

:deep(.n-image img) {
  object-fit: contain;
}
</style>
