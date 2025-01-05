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
        <NFormItem v-if="!isEdit" :label="t('system.technician.selectUser')" path="userId">
          <NSelect
            v-model:value="selectedUserId"
            :options="userOptions"
            :loading="loading"
            filterable
            remote
            :placeholder="t('system.technician.selectUser')"
            @search="handleSearch"
            style="width: 100%"
          />
        </NFormItem>

        <template v-if="selectedUserId">
          <div class="bg-gray-100 dark:bg-gray-800 rounded p-4 mb-4">
            <NFormItem :label="t('system.technician.name')" path="name">
              <span>{{ model.name }}</span>
            </NFormItem>

            <NFormItem :label="t('system.technician.phone')" path="phone">
              <span>{{ model.phone }}</span>
            </NFormItem>

            <NFormItem :label="t('system.technician.email')" path="email">
              <span>{{ model.email }}</span>
            </NFormItem>
          </div>
        </template>

        <NFormItem :label="t('system.technician.level')" path="level">
          <NSelect
            v-model:value="model.level"
            :options="levelOptions"
            :placeholder="t('system.technician.levelPlaceholder')"
            style="width: 100%"
          />
        </NFormItem>

        <NFormItem :label="t('system.technician.specialties')" path="specialties">
          <NSelect
            v-model:value="model.specialties"
            :options="specialtiesOptions"
            multiple
            :placeholder="t('system.technician.specialtiesPlaceholder')"
            style="width: 100%"
          />
        </NFormItem>

        <NFormItem :label="t('system.technician.workYears')" path="workYears">
          <NInputNumber
            v-model:value="model.workYears"
            :min="0"
            :precision="0"
            :placeholder="t('system.technician.workYearsPlaceholder')"
            style="width: 100%"
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
import { NDrawer, NDrawerContent, NForm, NFormItem, NSpace, NButton, NSelect, NInputNumber, useMessage } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { createTechnician, updateTechnician } from '@/service/api/technician'
import { searchUsers } from '@/service/api/user'
import type { UserInfo } from '@/service/api/user'

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
const formRef = ref<FormInst | null>(null)

const show = defineModel<boolean>('show', {
  type: Boolean,
  default: false
})

const selectedUserId = ref('')
const loading = ref(false)
const userOptions = ref<{ label: string; value: string; user: UserInfo }[]>([])

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

const rules: FormRules = {
  level: [{
    required: true,
    message: t('system.technician.levelRequired'),
    trigger: ['blur', 'change']
  }],
  specialties: [{
    required: true,
    type: 'array',
    message: t('system.technician.specialtiesRequired'),
    trigger: ['blur', 'change']
  }],
  workYears: [{
    required: true,
    type: 'number',
    message: t('system.technician.workYearsRequired'),
    trigger: ['blur', 'change']
  }]
}

// 搜索用户
async function handleSearch(query: string) {
  if (!query) return
  
  loading.value = true
  try {
    const { data } = await searchUsers({ keyword: query })
    userOptions.value = data.map(user => ({
      label: `${user.name}(${user.phone})`,
      value: user._id,
      user
    }))
  } catch (err) {
    console.error('搜索用户失败:', err)
  } finally {
    loading.value = false
  }
}

// 监听用户选择变化
watch(selectedUserId, (newId) => {
  if (!newId) return
  const selectedOption = userOptions.value.find(opt => opt.value === newId)
  if (selectedOption) {
    const { user } = selectedOption
    model.value.name = user.name
    model.value.avatar = user.avatar || ''
    model.value.phone = user.phone
    model.value.email = user.email
  }
})

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate()
    const submitData = {
      ...model.value,
      userId: selectedUserId.value
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
  selectedUserId.value = ''
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