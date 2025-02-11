<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue';
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NSelect, NSpace, NButton, NDivider, NInputNumber, NSwitch, NGrid, NGi, NDescriptions, NDescriptionsItem, useThemeVars, NTag, NDatePicker } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { fetchCustomers, fetchCustomerById } from '@/service/api/customer';
import { fetchVehicleByPlate } from '@/service/api/vehicle';
import { fetchCreateRepairOrder, fetchUpdateRepairOrder, fetchRepairOrderDetail } from '@/service/api/repair-order';
import dayjs from 'dayjs';
import RepairOrderDetail from './Detail.vue';

defineOptions({ name: 'RepairOrderForm' });

interface Props {
  type: 'add' | 'edit' | 'view';
  editData?: Api.RepairOrder.RepairOrderInfo;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: undefined
});

const emit = defineEmits<{
  (e: 'submit-success'): void;
}>();

const { t } = useI18n();
const { formRef, validate } = useNaiveForm();
const show = defineModel('show', { required: true, default: false });

interface FormModel extends Omit<Api.RepairOrder.CreateParams, 'customer' | 'vehicle'> {
  customer: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    contact: string;
    bankAccount?: string;
    bankName?: string;
  };
  vehicle: {
    _id: string;
    customerId: string;
    brand: string;
    model: string;
    year: number | null;
    licensePlate: string;
    vin: string;
    mileage: number;
    engineNo?: string;
    color?: string;
    displacement?: string;
  };
  isNewCustomer: boolean;
  faultDesc: string;
  remark?: string;
  inDate?: number | null;
  estimatedCompletionDate?: number | null;
  repairItems?: {
    _id: string;
    name: string;
    description?: string;
    laborCost: number;
    estimatedHours: number;
    technicians: {
      _id: string;
      name: string;
      role: string;
    }[];
    materials: {
      _id: string;
      name: string;
      partNo?: string;
      quantity: number;
      unit: string;
      unitPrice: number;
    }[];
    status: 'pending' | 'in_progress' | 'completed';
  }[];
}

const formModel = reactive<FormModel>({
  customer: {
    _id: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    contact: '',
    bankAccount: '',
    bankName: ''
  },
  vehicle: {
    _id: '',
    customerId: '',
    brand: '',
    model: '',
    year: null,
    licensePlate: '川A', // 默认值： 川A
    vin: '',
    mileage: 0,
    engineNo: '',
    color: '',
    displacement: ''
  },
  faultDesc: '',
  remark: '',
  isNewCustomer: true,
  inDate: dayjs().valueOf(),
  estimatedCompletionDate: null
});

const customerOptions = ref<{ label: string; value: string }[]>([]);
const loading = ref(false);

const rules = {
  'customer._id': { required: true, message: t('menu.customer.nameRequired'), trigger: 'blur' },
  'customer.name': { required: true, message: t('menu.customer.nameRequired'), trigger: 'blur' },
  'customer.phone': { required: true, message: t('menu.customer.phoneRequired'), trigger: 'blur' },
  'customer.contact': { required: true, message: t('menu.customer.contactRequired'), trigger: 'blur' },
  'vehicle._id': { required: true, message: t('menu.vehicle.required'), trigger: 'blur' },
  'vehicle.licensePlate': { required: true, message: t('menu.vehicle.licensePlateRequired'), trigger: 'blur' },
  faultDesc: { required: true, message: t('menu.repairOrder.faultDescRequired'), trigger: 'blur' }
};


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
      inspectionItems: [],
      customerItems: [],
      isNewCustomer: !formModel.customer._id
    };

    if (props.type === 'add') {
      const res = await fetchCreateRepairOrder(submitData);
      if (res.response.status !== 200) return

      window.$message?.success(t('common.addSuccess'));
    } else {
      const res = await fetchUpdateRepairOrder(props.editData!._id, submitData);
      if (res.response.status !== 200) return

      window.$message?.success(t('common.updateSuccess'));
    }

    resetForm();
    show.value = false;
    emit('submit-success');
  } catch (error) {
    console.error('Submit failed:', error);
  } finally {
    loading.value = false;
  }
}

function handleClose() {
  show.value = false;
  resetForm();
}

async function handleCustomerChange(customerId: string) {
  if (!customerId) {
    formModel.customer = {
      _id: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      contact: '',
      bankAccount: '',
      bankName: ''
    };
    return;
  }
  try {
    const { data } = await fetchCustomerById(customerId);

    formModel.customer = {
      _id: data._id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      contact: data.contact || '',
      bankAccount: data.bankAccount || '',
      bankName: data.bankName || ''
    };
  } catch (error) {
    console.error('Failed to fetch customer details:', error);
  }
}

const isValidLicensePlate = (licensePlate: string) => {
  return /^[A-Z0-9]{7}$/.test(licensePlate)
}

// 根据车牌号查询车辆信息
async function handleLicensePlateSearch() {
  // 对车牌号作大写处理
  formModel.vehicle.licensePlate = formModel.vehicle.licensePlate.toUpperCase();
  if (!formModel.vehicle.licensePlate || !isValidLicensePlate(formModel.vehicle.licensePlate)) {
    // resetVehicleInfo();
    return;
  }

  try {
    loading.value = true;
    const { data } = await fetchVehicleByPlate(formModel.vehicle.licensePlate);

    if (data) {
      formModel.vehicle = {
        _id: data._id,
        customerId: data.customer?._id || '',
        brand: data.brand,
        model: data.model,
        year: data.year ? dayjs(data.year).valueOf() : null,
        licensePlate: data.licensePlate,
        vin: data.vin,
        mileage: data.mileage,
        engineNo: data.engineNo || '',
        color: data.color || '',
        displacement: data.displacement || ''
      };

      if (data.customer) {
        formModel.customer = {
          _id: data.customer._id,
          name: data.customer.name,
          phone: data.customer.phone,
          email: data.customer.email,
          address: data.customer.address,
          contact: data.customer.contact || '',
          bankAccount: data.customer.bankAccount || '',
          bankName: data.customer.bankName || ''
        };
      }
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
  formModel.vehicle = {
    _id: '',
    customerId: '',
    brand: '',
    model: '',
    year: null,
    licensePlate: '',
    vin: '',
    mileage: 0,
    engineNo: '',
    color: '',
    displacement: ''
  };
}

function resetForm() {
  formModel.customer = {
    _id: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    contact: '',
    bankAccount: '',
    bankName: ''
  };
  formModel.vehicle = {
    _id: '',
    customerId: '',
    brand: '',
    model: '',
    year: null,
    licensePlate: '川A',
    vin: '',
    mileage: 0,
    engineNo: '',
    color: '',
    displacement: ''
  };
  formModel.faultDesc = '';
  formModel.remark = '';
  formModel.isNewCustomer = false;
  formModel.inDate = Date.now();
  formModel.estimatedCompletionDate = null;

}

loadCustomers();

const themeVars = useThemeVars();

// 获取工单详情
async function getOrderDetail() {
  if (!props.editData?._id) return;

  try {
    loading.value = true;
    const { data } = await fetchRepairOrderDetail(props.editData._id);

    formModel.faultDesc = data.faultDesc;
    formModel.remark = data.remark;
    formModel.isNewCustomer = false;
    formModel.inDate = dayjs(data.createdAt).valueOf();
    formModel.estimatedCompletionDate = dayjs(data.estimatedCompletionDate).valueOf();

    if (data.vehicle) {
      formModel.vehicle = {
        _id: data.vehicle._id,
        customerId: data.vehicle.customer?._id || '',
        brand: data.vehicle.brand,
        model: data.vehicle.model,
        year: data.vehicle.year ? dayjs(data.vehicle.year).valueOf() : null,
        licensePlate: data.vehicle.licensePlate,
        vin: data.vehicle.vin,
        mileage: data.vehicle.mileage,
        engineNo: data.vehicle.engineNo || '',
        color: data.vehicle.color || '',
        displacement: data.vehicle.displacement || ''
      };
    }

    if (data.customer) {
      formModel.customer = {
        _id: data.customer._id,
        name: data.customer.name,
        phone: data.customer.phone,
        email: data.customer.email,
        address: data.customer.address,
        contact: data.customer.contact || '',
        bankAccount: data.customer.bankAccount || '',
        bankName: data.customer.bankName || ''
      };
    }

    if (data.repairItems) {
      formModel.repairItems = data.repairItems;
    }
  } catch (error) {
    window.$message?.error(t('common.error'));
  } finally {
    loading.value = false;
  }
}

const title = computed(() => {
  return props.type === 'add' ? t('common.add') : props.type === 'edit' ? t('common.edit') : t('common.view');
});

// 监听抽屉显示状态和类型变化
watch(
  () => [show.value, props.type],
  async ([show, type]) => {
    if (show && (type === 'edit' || type === 'view')) {
      await getOrderDetail();
    } else {
      resetForm();
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
function formatTime(time: string | number | null | undefined): string {
  if (!time) return '-';
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}
</script>

<template>
  <NDrawer v-model:show="show" :width="800" :mask-closable="true">
    <NDrawerContent :title="title">
      <!-- 查看模式 -->
      <template v-if="props.type === 'view'">
        <RepairOrderDetail
          :edit-data="props.editData"
          :form-model="formModel"
        />
      </template>

      <!-- 编辑模式 -->
      <template v-else>
        <NForm
          ref="formRef"
          :model="formModel"
          :rules="rules"
          label-placement="left"
          :label-width="100"
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
                  clearable
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
                  <NFormItem :label="t('menu.vehicle.engineNo')" path="vehicle.engineNo">
                    <NInput v-model:value="formModel.vehicle.engineNo" :placeholder="t('menu.vehicle.engineNoPlaceholder')" />
                  </NFormItem>
                </NGi>
                <NGi>
                  <NFormItem :label="t('menu.vehicle.color')" path="vehicle.color">
                    <NInput v-model:value="formModel.vehicle.color" :placeholder="t('menu.vehicle.colorPlaceholder')" />
                  </NFormItem>
                </NGi>
              </NGrid>
              <NGrid :cols="2" :x-gap="12">
                <NGi>
                  <NFormItem :label="t('menu.vehicle.year')" path="vehicle.year">
                    <NDatePicker
                      v-model:value="formModel.vehicle.year"
                      type="year"
                      style="width: 100%"
                      :placeholder="t('menu.vehicle.yearPlaceholder')"
                      :actions="['clear']"
                      clearable
                      :default-value="null"
                    />
                  </NFormItem>
                </NGi>
                <NGi>
                  <NFormItem :label="t('menu.vehicle.mileage')" path="vehicle.mileage">
                    <NInputNumber v-model:value="formModel.vehicle.mileage" :min="0" style="width: 100%" />
                  </NFormItem>
                </NGi>
              </NGrid>
              <NGrid :cols="2" :x-gap="12">
                <NGi>
                  <NFormItem :label="t('menu.vehicle.vin')" path="vehicle.vin">
                    <NInput v-model:value="formModel.vehicle.vin" />
                  </NFormItem>
                </NGi>
                <NGi>
                  <NFormItem :label="t('menu.vehicle.displacement')" path="vehicle.displacement">
                    <NInput v-model:value="formModel.vehicle.displacement" style="width: 100%" />
                  </NFormItem>
                </NGi>
              </NGrid>
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
              <NGrid :cols="2" :x-gap="12">
                <NGi>
                  <NFormItem :label="t('menu.customer.contact')" path="customer.contact">
                    <NInput
                      v-model:value="formModel.customer.contact"
                      :placeholder="t('menu.customer.contactSearch')"
                    />
                  </NFormItem>
                </NGi>
                <NGi>
                  <NFormItem :label="t('menu.customer.phone')" path="customer.phone">
                    <NInput
                      v-model:value="formModel.customer.phone"
                      :placeholder="t('menu.customer.phoneSearch')"
                    />
                  </NFormItem>
                </NGi>
              </NGrid>
              <NFormItem :label="t('menu.customer.address')" path="customer.address">
                <NInput
                  v-model:value="formModel.customer.address"
                  :placeholder="t('menu.customer.addressSearch')"
                />
              </NFormItem>
              <NFormItem :label="t('menu.customer.email')" path="customer.email">
                <NInput
                  v-model:value="formModel.customer.email"
                  :placeholder="t('menu.customer.emailSearch')"
                />
              </NFormItem>

              <NGrid :cols="2" :x-gap="12">
                <NGi>
                  <NFormItem :label="t('menu.customer.bankAccount')" path="customer.bankAccount">
                    <NInput
                      v-model:value="formModel.customer.bankAccount"
                      :placeholder="t('menu.customer.bankAccountSearch')"
                    />
                  </NFormItem>
                </NGi>
                <NGi>
                  <NFormItem :label="t('menu.customer.bankName')" path="customer.bankName">
                    <NInput
                      v-model:value="formModel.customer.bankName"
                      :placeholder="t('menu.customer.bankNameSearch')"
                    />
                  </NFormItem>
                </NGi>
              </NGrid>
            </div>
          </div>

          <!-- 维修信息块 -->
          <div class="form-section" :style="{ '--section-marker-color': themeVars.primaryColor }">
            <h3 class="section-title">
              <span>{{ t('menu.repairOrder._value') }}</span>
            </h3>
            <div class="section-content">
              <NGrid :cols="2" :x-gap="12">
                <NGi>
                  <NFormItem :label="t('menu.repairOrder.inDate')" path="inDate" >
                    <NDatePicker
                      v-model:value="formModel.inDate"
                      type="date"
                      :placeholder="t('menu.repairOrder.inDatePlaceholder')"
                      clearable
                      style="width: 100%"
                    />
                  </NFormItem>
                </NGi>
                <NGi>
                  <NFormItem :label="t('menu.repairOrder.estimatedTime')" path="estimatedCompletionDate">
                    <NDatePicker
                      v-model:value="formModel.estimatedCompletionDate"
                      type="date"
                      :placeholder="t('menu.repairOrder.estimatedTimePlaceholder')"
                      clearable
                      style="width: 100%"
                      :timezone="'Asia/Shanghai'"
                    />
                  </NFormItem>
                </NGi>
              </NGrid>
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
