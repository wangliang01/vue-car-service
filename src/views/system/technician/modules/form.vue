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
        <NFormItem :label="t('system.technician.avatar')" path="avatar">
          <NUpload
            accept="image/*"
            :max="1"
            :custom-request="handleAvatarUpload"
          >
            <NButton>{{ t('common.upload') }}</NButton>
          </NUpload>
          <template v-if="model.avatar">
            <img :src="model.avatar" class="avatar-preview" />
          </template>
        </NFormItem>

        <NFormItem :label="t('system.technician.name')" path="name">
          <NInput 
            v-model:value="model.name" 
            :placeholder="t('system.technician.namePlaceholder')"
          />
        </NFormItem>

        <NFormItem :label="t('system.technician.phone')" path="phone">
          <NInput 
            v-model:value="model.phone" 
            :placeholder="t('system.technician.phonePlaceholder')"
          />
        </NFormItem>

        <NFormItem :label="t('system.technician.email')" path="email">
          <NInput 
            v-model:value="model.email" 
            :placeholder="t('system.technician.emailPlaceholder')"
          />
        </NFormItem>

        <NFormItem :label="t('system.technician.level')" path="level">
          <NSelect
            v-model:value="model.level"
            :options="levelOptions"
            :placeholder="t('system.technician.levelPlaceholder')"
          />
        </NFormItem>

        <NFormItem :label="t('system.technician.specialties')" path="specialties">
          <NSelect
            v-model:value="model.specialties"
            :options="specialtiesOptions"
            multiple
            :placeholder="t('system.technician.specialtiesPlaceholder')"
          />
        </NFormItem>

        <NFormItem :label="t('system.technician.workYears')" path="workYears">
          <NInputNumber
            v-model:value="model.workYears"
            :min="0"
            :precision="0"
            :placeholder="t('system.technician.workYearsPlaceholder')"
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

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NSpace, NButton, NSelect, NInputNumber, NUpload, useMessage } from 'naive-ui'
import type { FormInst, UploadFileInfo } from 'naive-ui'
import { createTechnician, updateTechnician } from '@/service/api/technician'
import { uploadFile } from '@/service/api/upload'
import { useAuthStore } from '@/store/modules/auth'

defineOptions({ name: 'TechnicianForm' })

interface Props {
  loading?: boolean
  isEdit?: boolean
  editData?: Api.Technician.TechnicianInfo | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  isEdit: false,
  editData: null
})

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'submit'): void
}

const emit = defineEmits<Emits>()
const { t } = useI18n()
const message = useMessage()
const authStore = useAuthStore()
const formRef = ref<FormInst | null>(null)

const show = defineModel<boolean>('show', {
  type: Boolean,
  default: false
})

const model = ref<Omit<Api.Technician.CreateParams, 'userId'>>({
  name: '',
  avatar: '',
  phone: '',
  email: '',
  level: '',
  specialties: [],
  workYears: 0
})

// 技师等级选项
const levelOptions = [
  { label: '初级技师', value: '初级技师' },
  { label: '中级技师', value: '中级技师' },
  { label: '高级技师', value: '高级技师' },
  { label: '资深技师', value: '资深技师' }
]

// 专长领域选项
const specialtiesOptions = [
  { label: '发动机维修', value: '发动机维修' },
  { label: '变速箱维修', value: '变速箱维修' },
  { label: '底盘维修', value: '底盘维修' },
  { label: '电气系统', value: '电气系统' },
  { label: '空调系统', value: '空调系统' },
  { label: '钣金喷漆', value: '钣金喷漆' }
]

const rules = {
  name: {
    required: true,
    message: t('system.technician.nameRequired'),
    trigger: ['blur', 'input']
  },
  phone: {
    required: true,
    message: t('system.technician.phoneRequired'),
    trigger: ['blur', 'input'],
    pattern: /^1[3-9]\d{9}$/
  },
  email: {
    required: true,
    message: t('system.technician.emailRequired'),
    trigger: ['blur', 'input'],
    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  },
  level: {
    required: true,
    message: t('system.technician.levelRequired'),
    trigger: ['blur', 'change']
  },
  specialties: {
    required: true,
    type: 'array',
    message: t('system.technician.specialtiesRequired'),
    trigger: ['blur', 'change']
  },
  workYears: {
    required: true,
    type: 'number',
    message: t('system.technician.workYearsRequired'),
    trigger: ['blur', 'change']
  }
}

// 头像上传
async function handleAvatarUpload(options: any) {
  try {
    const { file } = options
    const formData = new FormData()
    formData.append('file', file.file)
    const { data } = await uploadFile(formData)
    model.value.avatar = data.url
    message.success(t('common.uploadSuccess'))
  } catch (err) {
    console.error(err)
    message.error(t('common.uploadFailed'))
  }
}

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate()
    const submitData = {
      ...model.value,
      userId: authStore.userInfo.userId
    }
    if (props.isEdit && props.editData) {
      await updateTechnician(props.editData._id, model.value)
      message.success(t('common.updateSuccess'))
    } else {
      await createTechnician(submitData)
      message.success(t('common.createSuccess'))
    }
    emit('submit')
    handleClose()
  } catch (err) {
    console.error(err)
    message.error(t('common.error'))
  }
}

// 关闭抽屉
function handleClose() {
  emit('update:show', false)
}

// 重置表单
function resetForm() {
  model.value = {
    name: '',
    avatar: '',
    phone: '',
    email: '',
    level: '',
    specialties: [],
    workYears: 0
  }
  formRef.value?.restoreValidation()
}

// 监听编辑数据变化
watch(
  () => props.editData,
  (newData) => {
    if (newData) {
      const { name, avatar, phone, email, level, specialties, workYears } = newData
      model.value = { name, avatar, phone, email, level, specialties, workYears }
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// 监听抽屉关闭
watch(
  () => show.value,
  (newVal) => {
    if (!newVal) {
      resetForm()
    }
  }
)

// 获取标题
const title = computed(() => {
  if (props.isEdit) {
    return t('common.edit') + ' - ' + model.value.name
  }
  return t('common.add')
})

defineExpose({
  resetForm
})
</script>

<style scoped>
.avatar-preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-top: 8px;
}
</style> 