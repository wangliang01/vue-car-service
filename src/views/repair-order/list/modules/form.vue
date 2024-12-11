<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NSelect, NSpace, NButton, NDivider, NInputNumber, NSwitch, NGrid, NGi, NDescriptions, NDescriptionsItem, useThemeVars, NTag } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { fetchCustomers, fetchCustomerById } from '@/service/api/customer';
import { fetchVehicleByPlate } from '@/service/api/vehicle';
import { fetchCreateRepairOrder, fetchUpdateRepairOrder, fetchRepairOrderDetail } from '@/service/api/repair-order';
import dayjs from 'dayjs';

defineOptions({ name: 'RepairOrderForm' });

interface Props {
  show?: boolean;
  type: 'add' | 'edit' | 'view';
  editData?: Api.RepairOrder.RepairOrderInfo;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  type: 'add',
  editData: undefined
});

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'submit-success'): void;
}>();

const { t } = useI18n();
const { formRef, validate } = useNaiveForm();

interface FormModel extends Omit<Api.RepairOrder.CreateParams, 'customer' | 'vehicle'> {
  customer: {
    _id?: string;
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  vehicle: {
    _id?: string;
    brand?: string;
    model?: string;
    year?: number;
    licensePlate: string;
    vin?: string;
    mileage?: number;
  };
  faultDesc: string;
  remark?: string;
  isNewCustomer?: boolean;
}

const formModel = reactive<FormModel>({
  customer: {
    _id: '',
    name: '',
    phone: '',
    email: '',
    address: ''
  },
  vehicle: {
    _id: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    vin: '',
    mileage: 0
  },
  faultDesc: '',
  remark: '',
  isNewCustomer: false
});

const customerOptions = ref<{ label: string; value: string }[]>([]);
const loading = ref(false);

const rules = {
  'customer._id': { required: true, message: t('common.required') },
  'customer.name': { required: true, message: t('common.required') },
  'customer.phone': { required: true, message: t('common.required') },
  'customer.email': { required: true, message: t('common.required') },
  'customer.address': { required: true, message: t('common.required') },
  'vehicle._id': { required: true, message: t('common.required') },
  faultDesc: { required: true, message: t('common.required') }
};

const customerInfo = ref({
  phone: '',
  email: '',
  address: ''
});

const vehicleInfo = ref({
  brand: '',
  model: '',
  year: '',
  vin: ''
});

async function loadCustomers() {
  try {
    const { data } = await fetchCustomers();
    customerOptions.value = data.map(customer => ({
      label: customer.name,
      value: customer._id
    }));
  } catch (error) {
    console.error('Failed to load customers:', error);
  }
}

async function handleSubmit() {
  try {
    await validate();
    loading.value = true;
    const submitData = {
      ...formModel,
      isNewCustomer: !formModel.customer._id
    };
    
    if (props.type === 'add') {
      await fetchCreateRepairOrder(submitData);
      window.$message?.success(t('common.addSuccess'));
    } else {
      await fetchUpdateRepairOrder(props.editData!._id, submitData);
      window.$message?.success(t('common.updateSuccess'));
    }
    
    resetForm();
    emit('update:show', false);
    emit('submit-success');
  } catch (error) {
    console.error('Submit failed:', error);
  } finally {
    loading.value = false;
  }
}

function handleClose() {
  emit('update:show', false);
  resetForm();
}

async function handleCustomerChange(customerId: string) {
  if (!customerId) {
    customerInfo.value = { 
      phone: '', 
      email: '', 
      address: '' 
    };
    Object.assign(formModel.customer, {
      _id: '',
      name: '',
      phone: '',
      email: '',
      address: ''
    });
    return;
  }
  try {
    const { data } = await fetchCustomerById(customerId);
    customerInfo.value = {
      phone: data.phone,
      email: data.email,
      address: data.address
    };
    Object.assign(formModel.customer, {
      _id: data._id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address
    });
  } catch (error) {
    console.error('Failed to fetch customer details:', error);
  }
}

// 根据车牌号查询车辆信息
async function handleLicensePlateSearch() {
  if (!formModel.vehicle.licensePlate) {
    resetVehicleInfo();
    return;
  }

  try {
    loading.value = true;
    const { data } = await fetchVehicleByPlate(formModel.vehicle.licensePlate);
    
    if (data) {
      // 回填车辆信息
      Object.assign(formModel.vehicle, {
        _id: data._id,
        brand: data.brand,
        model: data.model,
        year: data.year,
        vin: data.vin,
        mileage: data.mileage
      });
      
      // 如果有关联的客户信息，同时回填
      if (data.customer) {
        Object.assign(formModel.customer, {
          _id: data.customer._id,
          name: data.customer.name,
          phone: data.customer.phone,
          email: data.customer.email,
          address: data.customer.address
        });
      }
    } else {
      resetVehicleInfo();
    }
  } catch (error) {
    console.error('获取车辆信息失败:', error);
    resetVehicleInfo();
  } finally {
    loading.value = false;
  }
}

// 重置车辆信息
function resetVehicleInfo() {
  Object.assign(formModel.vehicle, {
    _id: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    mileage: 0
  });
}

function resetForm() {
  Object.assign(formModel, {
    customer: {
      _id: '',
      name: '',
      phone: '',
      email: '',
      address: ''
    },
    vehicle: {
      _id: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      vin: '',
      mileage: 0
    },
    faultDesc: '',
    remark: '',
    isNewCustomer: false
  });
  customerInfo.value = { 
    phone: '', 
    email: '', 
    address: '' 
  };
}

loadCustomers();

const themeVars = useThemeVars();

// 获取工单详情
async function getOrderDetail() {
  if (!props.editData?._id) return;
  
  try {
    loading.value = true;
    const { data } = await fetchRepairOrderDetail(props.editData._id);
    
    // 回显数据
    Object.assign(formModel, {
      faultDesc: data.faultDesc,
      remark: data.remark,
      isNewCustomer: false
    });

    // 回显车辆信息
    if (data.vehicle) {
      Object.assign(formModel.vehicle, {
        _id: data.vehicle._id,
        brand: data.vehicle.brand,
        model: data.vehicle.model,
        year: data.vehicle.year,
        licensePlate: data.vehicle.licensePlate,
        vin: data.vehicle.vin,
        mileage: data.vehicle.mileage
      });
    }

    // 回显客户信息
    if (data.customer) {
      Object.assign(formModel.customer, {
        _id: data.customer._id,
        name: data.customer.name,
        phone: data.customer.phone,
        email: data.customer.email,
        address: data.customer.address
      });
    }
  } catch (error) {
    window.$message?.error(t('common.error'));
  } finally {
    loading.value = false;
  }
}

// 监听抽屉显示状态和类型变化
watch(
  () => [props.show, props.type],
  async ([show, type]) => {
    if (show && (type === 'edit' || type === 'view')) {
      await getOrderDetail();
    }
  },
  { immediate: true }
);

// 添加状态标签类型映射
const statusTagTypes: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'default',
  inspecting: 'warning',
  repairing: 'info',
  completed: 'success',
  delivered: 'success'
};

// 添加时间格式化函数
function formatTime(time?: string) {
  if (!time) return '-';
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}
</script>

<template>
  <NDrawer v-model:show="props.show" :width="600">
    <NDrawerContent :title="props.type === 'add' ? t('common.add') : props.type === 'edit' ? t('common.edit') : t('common.view')">
      <!-- 查看模式 -->
      <template v-if="props.type === 'view'">
        <div class="detail-container">
          <!-- 基础信息卡片 -->
          <div class="detail-section">
            <div class="section-header">
              <span>基础信息</span>
            </div>
            <div class="section-content">
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">工单编号</span>
                  <span class="value">{{ editData?.orderNo }}</span>
                </div>
                <div class="info-item">
                  <span class="label">工单状态</span>
                  <NTag 
                    :type="statusTagTypes[editData?.status]" 
                    size="small" 
                    class="status-tag"
                  >
                    {{ t(`repairOrder.status.${editData?.status}`) }}
                  </NTag>
                </div>
                <div class="info-item">
                  <span class="label">创建时间</span>
                  <span class="value">{{ formatTime(editData?.createdAt) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">更新时间</span>
                  <span class="value">{{ formatTime(editData?.updatedAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 车辆信息卡片 -->
          <div class="detail-section">
            <div class="section-header">
              <span>车辆信息</span>
            </div>
            <div class="section-content">
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">车牌号</span>
                  <span class="value highlight">{{ formModel.vehicle.licensePlate }}</span>
                </div>
                <div class="info-item">
                  <span class="label">品牌型号</span>
                  <span class="value">{{ formModel.vehicle.brand }} {{ formModel.vehicle.model }}</span>
                </div>
                <div class="info-item">
                  <span class="label">年份</span>
                  <span class="value">{{ formModel.vehicle.year }}</span>
                </div>
                <div class="info-item">
                  <span class="label">行驶里程</span>
                  <span class="value">{{ formModel.vehicle.mileage }} km</span>
                </div>
                <div class="info-item full-width">
                  <span class="label">车架号</span>
                  <span class="value">{{ formModel.vehicle.vin || '-' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 客户信息卡片 -->
          <div class="detail-section">
            <div class="section-header">
              <span>客户信息</span>
            </div>
            <div class="section-content">
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">客户姓名</span>
                  <span class="value">{{ formModel.customer.name }}</span>
                </div>
                <div class="info-item">
                  <span class="label">联系电话</span>
                  <span class="value">{{ formModel.customer.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">电子邮箱</span>
                  <span class="value">{{ formModel.customer.email || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">联系地址</span>
                  <span class="value">{{ formModel.customer.address || '-' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 维修信息卡片 -->
          <div class="detail-section">
            <div class="section-header">
              <span>维修信息</span>
            </div>
            <div class="section-content">
              <div class="info-grid">
                <div class="info-item full-width">
                  <span class="label">故障描述</span>
                  <div class="desc-box">{{ formModel.faultDesc }}</div>
                </div>
                <div class="info-item full-width" v-if="formModel.remark">
                  <span class="label">备注信息</span>
                  <div class="desc-box">{{ formModel.remark }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 进度追踪卡片 -->
          <div class="detail-section" v-if="editData?.statusLogs?.length">
            <div class="section-header">
              <span>进度追踪</span>
            </div>
            <div class="section-content">
              <div class="timeline">
                <div class="timeline-item" v-for="(log, index) in editData.statusLogs" :key="index">
                  <div class="time">{{ formatTime(log.createdAt) }}</div>
                  <div class="status">
                    <NTag :type="statusTagTypes[log.status]" size="small">
                      {{ t(`repairOrder.status.${log.status}`) }}
                    </NTag>
                  </div>
                  <div class="operator">{{ log.operator }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 编辑模式 -->
      <template v-else>
        <NForm
          ref="formRef"
          :model="formModel"
          :rules="rules"
          label-placement="left"
          :label-width="80"
        >
          <!-- 车辆信息块 -->
          <div class="form-section" :style="{ '--section-marker-color': themeVars.primaryColor }">
            <h3 class="section-title">
              <span>{{ t('menu.repairOrder.vehicle') }}</span>
            </h3>
            <div class="section-content">
              <NFormItem :label="t('menu.vehicle.licensePlate')" path="vehicle.licensePlate">
                <NInput 
                  v-model:value="formModel.vehicle.licensePlate" 
                  :placeholder="t('menu.vehicle.licensePlatePlaceholder')"
                  :loading="loading"
                  @blur="handleLicensePlateSearch"
                />
              </NFormItem>
              <NGrid :cols="2" :x-gap="12">
                <NGi>
                  <NFormItem :label="t('menu.vehicle.brand')" path="vehicle.brand">
                    <NInput v-model:value="formModel.vehicle.brand" />
                  </NFormItem>
                </NGi>
                <NGi>
                  <NFormItem :label="t('menu.vehicle.model')" path="vehicle.model">
                    <NInput v-model:value="formModel.vehicle.model" />
                  </NFormItem>
                </NGi>
              </NGrid>
              <NGrid :cols="2" :x-gap="12">
                <NGi>
                  <NFormItem :label="t('menu.vehicle.year')" path="vehicle.year">
                    <NInputNumber v-model:value="formModel.vehicle.year" :min="1900" :max="new Date().getFullYear()" />
                  </NFormItem>
                </NGi>
                <NGi>
                  <NFormItem :label="t('menu.vehicle.mileage')" path="vehicle.mileage">
                    <NInputNumber v-model:value="formModel.vehicle.mileage" :min="0" />
                  </NFormItem>
                </NGi>
              </NGrid>
              <NFormItem :label="t('menu.vehicle.vin')" path="vehicle.vin">
                <NInput v-model:value="formModel.vehicle.vin" />
              </NFormItem>
            </div>
          </div>

          <!-- 客户信息块 -->
          <div class="form-section" :style="{ '--section-marker-color': themeVars.primaryColor }">
            <h3 class="section-title">
              <span>{{ t('menu.repairOrder.customer') }}</span>
            </h3>
            <div class="section-content">
              <NFormItem :label="t('menu.customer.name')" path="customer._id" v-if="formModel.customer._id">
                <NSelect
                  v-model:value="formModel.customer._id"
                  :options="customerOptions"
                  :placeholder="t('menu.customer.nameSearch')"
                  clearable
                  @update:value="handleCustomerChange"
                />
              </NFormItem>
               <NFormItem :label="t('menu.customer.name')" path="customer.name" v-else>
                <NInput 
                  v-model:value="formModel.customer.name" 
                  :placeholder="t('menu.customer.nameSearch')"
                />
              </NFormItem>
                <NFormItem :label="t('menu.customer.phone')" path="customer.phone">
                <NInput 
                  v-model:value="formModel.customer.phone" 
                  :placeholder="t('menu.customer.phoneSearch')"
                />
              </NFormItem>
              <NFormItem :label="t('menu.customer.email')" path="customer.email">
                <NInput 
                  v-model:value="formModel.customer.email" 
                  :placeholder="t('menu.customer.emailSearch')"
                />
              </NFormItem>
              <NFormItem :label="t('menu.customer.address')" path="customer.address">
                <NInput 
                  v-model:value="formModel.customer.address" 
                  :placeholder="t('menu.customer.addressSearch')"
                />
              </NFormItem>
            </div>
          </div>

          <!-- 维修信息块 -->
          <div class="form-section" :style="{ '--section-marker-color': themeVars.primaryColor }">
            <h3 class="section-title">
              <span>{{ t('menu.repairOrder._value') }}</span>
            </h3>
            <div class="section-content">
              <NFormItem :label="t('menu.repairOrder.faultDesc')" path="faultDesc">
                <NInput
                  v-model:value="formModel.faultDesc"
                  type="textarea"
                  :rows="3"
                  :placeholder="t('menu.repairOrder.faultDescPlaceholder')"
                />
              </NFormItem>
              <NFormItem :label="t('common.remark')">
                <NInput
                  v-model:value="formModel.remark"
                  type="textarea"
                  :rows="3"
                  :placeholder="t('common.remarkPlaceholder')"
                />
              </NFormItem>
            </div>
          </div>
        </NForm>
        
       
      </template>

      <!-- 底部按钮 -->
      <template #footer>
       <!-- 操作按钮 -->
       <div class="action-buttons" v-if="props.type !== 'view'">
          <NSpace justify="end">
            <NButton @click="handleClose">{{ t('common.cancel') }}</NButton>
            <NButton 
              type="primary" 
              :loading="loading" 
              @click="handleSubmit"
            >
              {{ t('common.confirm') }}
            </NButton>
          </NSpace>
        </div>
        <NSpace justify="end" v-else>
          <NButton @click="handleClose">
            {{ t('common.close') }}
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.form-section {
  margin-bottom: 24px;
  background-color: var(--n-card-color);
  border-radius: 8px;
  overflow: hidden;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-title {
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 16px 12px 24px;
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  background-color: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid var(--n-border-color);
}

.section-title::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background-color: var(--section-marker-color);
  border-radius: 2px;
}

.section-content {
  padding: 16px;
}

:deep(.n-descriptions) {
  margin-top: 8px;
}

:deep(.n-form-item:last-child) {
  margin-bottom: 0;
}

:deep(.n-drawer-content) {
  background-color: #f5f7f9;
}

:deep(.n-card) {
  background-color: #fff;
}

/* 暗黑模式适配 */
:deep(.dark) .section-title {
  background-color: rgba(255, 255, 255, 0.02);
}

/* 动画效果 */
.section-title::before {
  transition: background-color 0.3s ease;
}

/* 查看模式样式 */
.view-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  background: var(--n-card-color);
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: rgba(var(--n-primary-color-rgb), 0.05);
  border-bottom: 1px solid var(--n-border-color);
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--n-text-color);
}

.card-content {
  padding: 16px;
}

.plate-number {
  font-size: 24px;
  font-weight: 600;
  color: var(--n-primary-color);
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.label {
  font-size: 14px;
  color: var(--n-text-color-3);
}

.value {
  font-size: 15px;
  color: var(--n-text-color);
}

.customer-name {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 16px;
  color: var(--n-text-color);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--n-text-color);
}

.description {
  margin-top: 4px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 暗黑模式适配 */
:deep(.dark) {
  .card-header {
    background: rgba(255, 255, 255, 0.04);
  }
  
  .description {
    background: rgba(255, 255, 255, 0.04);
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .plate-number {
    font-size: 20px;
  }
  
  .customer-name {
    font-size: 18px;
  }
}

.view-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100%;
}

.status-card {
  background: linear-gradient(135deg, var(--primary-start) 0%, var(--primary-end) 100%);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  color: #fff;
}

.status-card.pending { --primary-start: #64748b; --primary-end: #475569; }
.status-card.inspecting { --primary-start: #f59e0b; --primary-end: #d97706; }
.status-card.repairing { --primary-start: #3b82f6; --primary-end: #2563eb; }
.status-card.completed { --primary-start: #10b981; --primary-end: #059669; }
.status-card.delivered { --primary-start: #6366f1; --primary-end: #4f46e5; }

.status-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.order-no {
  font-size: 24px;
  font-weight: 600;
}

.order-time {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.9;
  font-size: 14px;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.info-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(var(--n-primary-color-rgb), 0.05);
  border-bottom: 1px solid var(--n-border-color);
}

.primary-icon {
  color: var(--n-primary-color);
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--n-text-color);
}

.card-content {
  padding: 20px;
}

.plate-number {
  font-size: 28px;
  font-weight: 600;
  color: var(--n-primary-color);
  margin-bottom: 20px;
}

.vehicle-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand {
  font-size: 18px;
  font-weight: 500;
}

.model {
  color: var(--n-text-color-2);
}

.year {
  color: var(--n-text-color-3);
  font-size: 14px;
}

.label {
  color: var(--n-text-color-3);
  min-width: 80px;
}

.value {
  color: var(--n-text-color);
}

.value.highlight {
  color: var(--n-primary-color);
  font-family: monospace;
  font-size: 15px;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.customer-name {
  font-size: 24px;
  font-weight: 500;
  color: var(--n-text-color);
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(var(--n-primary-color-rgb), 0.05);
  border-radius: 8px;
}

.desc-content {
  font-size: 15px;
  line-height: 1.6;
  color: var(--n-text-color);
  white-space: pre-wrap;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

/* 暗黑模式适配 */
:deep(.dark) {
  .view-container {
    background: #18181b;
  }
  
  .info-card {
    background: #27272a;
  }
  
  .contact-item {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .desc-content {
    background: rgba(255, 255, 255, 0.05);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .plate-number {
    font-size: 24px;
  }
  
  .customer-name {
    font-size: 20px;
  }
  
  .status-card {
    padding: 20px;
  }
  
  .order-no {
    font-size: 20px;
  }
}

.detail-container {
  background: var(--n-card-color);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section {
  background: #fff;
  border-radius: 8px;
  /* box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06); */
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.section-header {
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  color: var(--n-text-color);
  /* background: rgba(0, 0, 0, 0.02); */
  border-bottom: 1px solid var(--n-border-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-content {
  padding: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.label {
  font-size: 14px;
  color: var(--n-text-color-3);
}

.value {
  font-size: 14px;
  color: var(--n-text-color);
}

.value.highlight {
  color: var(--n-primary-color);
  font-size: 16px;
  font-weight: 500;
}

.desc-box {
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  line-height: 1.6;
  font-size: 14px;
  white-space: pre-wrap;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 180px auto 120px;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  font-size: 14px;
}

/* 暗黑模式适配 */
:deep(.dark) {
  .detail-container {
    background: var(--n-card-color);
  }
  
  .detail-section {
    background: var(--n-card-color);
  }
  
  .section-header {
    background: rgba(255, 255, 255, 0.02);
  }
  
  .desc-box,
  .timeline-item {
    background: rgba(255, 255, 255, 0.04);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-container {
    padding: 16px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .timeline-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

.status-tag {
  width: fit-content;
  padding: 2px 8px;
}
</style> 