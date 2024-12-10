<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NSelect, NSpace, NButton, NDivider, NInputNumber, NSwitch, NGrid, NGi, NDescriptions, NDescriptionsItem, useThemeVars } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { fetchCustomers, fetchCustomerById } from '@/service/api/customer';
import { fetchVehicleByPlate } from '@/service/api/vehicle';
import { fetchCreateRepairOrder, fetchUpdateRepairOrder } from '@/service/api/repair-order';

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
  remark: ''
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

async function handleLicensePlateSearch() {
  if (!formModel.vehicle.licensePlate) return;
  try {
    loading.value = true;
    const { data } = await fetchVehicleByPlate(formModel.vehicle.licensePlate.trim());
    if (data) {
      Object.assign(formModel.vehicle, {
        _id: data._id,
        brand: data.brand,
        model: data.model,
        year: data.year,
        vin: data.vin,
        mileage: data.mileage
      });
      if (data.customer) {
        Object.assign(formModel.customer, {
          _id: data.customer._id,
          name: data.customer.name,
          phone: data.customer.phone,
          email: data.customer.email,
          address: data.customer.address
        });
      }
      window.$message?.success(t('common.searchSuccess'));
    } else {
      Object.assign(formModel.vehicle, {
        _id: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        vin: '',
        mileage: 0
      });
    }
  } catch (error) {
    console.error('获取车辆信息失败:', error);
    window.$message?.error(t('common.searchError'));
  } finally {
    loading.value = false;
  }
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
    remark: ''
  });
  customerInfo.value = { 
    phone: '', 
    email: '', 
    address: '' 
  };
}

loadCustomers();

const themeVars = useThemeVars();

// 监听编辑数据变化
watch(
  () => props.editData,
  (newVal) => {
    if (newVal && props.type === 'edit') {
      // 填充表单数据
      Object.assign(formModel, {
        customer: {
          _id: newVal.customer._id,
          name: newVal.customer.name,
          phone: newVal.customer.phone,
          email: newVal.customer.email,
          address: newVal.customer.address
        },
        vehicle: {
          _id: newVal.vehicle._id,
          brand: newVal.vehicle.brand,
          model: newVal.vehicle.model,
          year: newVal.vehicle.year,
          licensePlate: newVal.vehicle.licensePlate,
          vin: newVal.vehicle.vin,
          mileage: newVal.vehicle.mileage
        },
        faultDesc: newVal.faultDesc,
        remark: newVal.remark || ''
      });
    }
  },
  { immediate: true }
);
</script>

<template>
  <NDrawer v-model:show="props.show" :width="600" :mask-closable="true">
    <NDrawerContent :title="props.type === 'add' ? t('common.add') : props.type === 'edit' ? t('common.edit') : t('common.view')">
      <NForm ref="formRef" :model="formModel" :rules="rules" label-placement="left" :label-width="80" :disabled="props.type === 'view'">
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

      <template #footer>
        <NSpace justify="end">
          <NButton @click="handleClose">
            {{ t('common.cancel') }}
          </NButton>
          <NButton
            v-if="props.type !== 'view'"
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


</style> 