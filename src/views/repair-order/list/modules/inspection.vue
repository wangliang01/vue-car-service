<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { InspectionData } from '@/types/repair-order'
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NSelect, NInputNumber, NSpace, NButton, NGrid, NGridItem, NCard, NUpload, NImage } from 'naive-ui'

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

const inspectionData = ref<InspectionData>({
  inspectionItems: [],
  customerItems: []
})

const drawerTitle = computed(() => t('repairOrder.inspection'))

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

function handleSubmit() {
  if (props.orderId) {
    emit('submit', props.orderId, inspectionData.value)
  }
}

// 图片上传相关配置
const uploadConfig = {
  action: '/api/upload', // 上传接口
  max: 5, // 最大上传数量
  accept: '.jpg,.jpeg,.png', // 接受的文件类型
  'show-file-list': false // 不显示文件列表
}

function handleUploadSuccess(item: InspectionItem, { file }: { file: { id: string; url: string } }) {
  if (!item.images) {
    item.images = []
  }
  item.images.push({
    id: file.id,
    url: file.url
  })
}

function handleRemoveImage(item: InspectionItem, imageId: string) {
  const index = item.images?.findIndex(img => img.id === imageId)
  if (index !== undefined && index > -1) {
    item.images?.splice(index, 1)
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
</script>

<template>
  <NDrawer
    :show="show"
    @update:show="emit('update:show', $event)"
    :width="800"
    placement="right"
  >
    <NDrawerContent :title="drawerTitle">
      <NForm>
        <div class="section">
          <div class="section-header">
            <div class="flex justify-between items-center">
              <span>{{ t('repairOrder.inspectionItems') }}</span>
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
                  <NFormItem :label="t('repairOrder.itemName')">
                    <NInput v-model:value="item.name" />
                  </NFormItem>
                </NGridItem>
                <NGridItem :span="6">
                  <NFormItem :label="t('repairOrder.result')">
                    <NSelect
                      v-model:value="item.result"
                      :options="[
                        { label: t('repairOrder.normal'), value: 'normal' },
                        { label: t('repairOrder.abnormal'), value: 'abnormal' }
                      ]"
                    />
                  </NFormItem>
                </NGridItem>
                <NGridItem :span="12">
                  <NFormItem :label="t('repairOrder.remark')">
                    <NInput v-model:value="item.remark" type="textarea" :rows="1" />
                  </NFormItem>
                </NGridItem>
                <NGridItem :span="24">
                  <NFormItem :label="t('repairOrder.images')">
                    <div class="upload-container">
                      <div class="image-preview-list">
                        <div 
                          v-for="image in item.images" 
                          :key="image.id" 
                          class="image-preview-item"
                        >
                          <NImage
                            :src="image.url"
                            :width="100"
                            :height="100"
                            class="preview-image"
                            preview-disabled
                            @click="handlePreview(item)"
                          />
                          <div class="image-actions">
                            <NButton
                              circle
                              size="tiny"
                              type="error"
                              @click.stop="handleRemoveImage(item, image.id)"
                            >
                              <template #icon>
                                <div class="i-material-symbols:close" />
                              </template>
                            </NButton>
                          </div>
                        </div>
                        
                        <NUpload
                          v-if="!item.images?.length || item.images.length < 5"
                          v-bind="uploadConfig"
                          :on-success="(options) => handleUploadSuccess(item, options)"
                        >
                          <div class="upload-trigger">
                            <div class="i-material-symbols:add" />
                            <div class="upload-text">{{ t('common.upload') }}</div>
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
              <span>{{ t('repairOrder.customerItems') }}</span>
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
                  <NFormItem :label="t('repairOrder.itemName')">
                    <NInput v-model:value="item.name" />
                  </NFormItem>
                </NGridItem>
                <NGridItem :span="4">
                  <NFormItem :label="t('repairOrder.quantity')">
                    <NInputNumber v-model:value="item.quantity" :min="0" />
                  </NFormItem>
                </NGridItem>
                <NGridItem :span="12">
                  <NFormItem :label="t('repairOrder.remark')">
                    <NInput v-model:value="item.remark" type="textarea" :rows="1" />
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

  <!-- 图片预览 -->
  <NImage
    v-if="showPreview"
    v-model:show="showPreview"
    :src="previewImages[previewIndex]"
    :show-toolbar="true"
    :show-next="previewImages.length > 1"
    :show-prev="previewImages.length > 1"
    @prev="previewIndex = Math.max(0, previewIndex - 1)"
    @next="previewIndex = Math.min(previewImages.length - 1, previewIndex + 1)"
  />
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