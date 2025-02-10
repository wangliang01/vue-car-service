<script setup lang="ts">
import { computed } from 'vue';
import { NTag, NIcon } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import {
  CarSportOutline as CarIcon,
  PersonCircleOutline as PersonIcon,
  BuildOutline as ConstructIcon
} from '@vicons/ionicons5';

defineOptions({ name: 'RepairOrderDetail' });

interface Props {
  editData?: Api.RepairOrder.RepairOrderInfo;
  formModel: {
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
    faultDesc: string;
    remark?: string;
    inDate?: number | null;
    estimatedCompletionDate?: number | null;
  }
}

const props = defineProps<Props>();
const { t } = useI18n();

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
  <div class="detail-container">
    <!-- 顶部状态卡片 -->
    <div class="status-card" :class="editData?.status">
      <div class="status-header">
        <div class="status-left">
          <div class="order-no">{{ editData?.orderNo }}</div>
          <NTag :type="statusTagTypes[editData?.status]" class="status-tag">
            {{ t(`repairOrder.status.${editData?.status}`) }}
          </NTag>
        </div>
        <div class="status-right">
          <div class="time-info">
            <div class="time-item">
              <span class="time-label">创建时间：</span>
              <span class="time-value">{{ formatTime(editData?.createdAt) }}</span>
            </div>
            <div class="time-item">
              <span class="time-label">更新时间：</span>
              <span class="time-value">{{ formatTime(editData?.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-main">
      <!-- 左侧车辆信息 -->
      <div class="info-card">
        <div class="card-header">
          <div class="header-icon">
            <NIcon size="18">
              <CarIcon />
            </NIcon>
          </div>
          <span class="header-title">车辆信息</span>
        </div>
        <div class="card-content">
          <div class="main-info">
            <div class="plate-number">{{ formModel.vehicle.licensePlate }}</div>
            <div class="sub-info">{{ formModel.vehicle.brand }} {{ formModel.vehicle.model }}</div>
          </div>
          <div class="info-list">
            <div class="info-item">
              <span class="label">购车年份</span>
              <span class="value">{{ formModel.vehicle.year ? dayjs(formModel.vehicle.year).format('YYYY') : '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">行驶里程</span>
              <span class="value">{{ formModel.vehicle.mileage }} km</span>
            </div>
            <div class="info-item">
              <span class="label">车架号</span>
              <span class="value mono">{{ formModel.vehicle.vin || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">发动机号</span>
              <span class="value mono">{{ formModel.vehicle.engineNo || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">排量</span>
              <span class="value">{{ formModel.vehicle.displacement ? `${formModel.vehicle.displacement}L` : '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">车辆颜色</span>
              <span class="value">{{ formModel.vehicle.color || '-' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧客户信息 -->
      <div class="info-card">
        <div class="card-header">
          <div class="header-icon">
            <NIcon size="18">
              <PersonIcon />
            </NIcon>
          </div>
          <span class="header-title">客户信息</span>
        </div>
        <div class="card-content">
          <div class="main-info">
            <div class="customer-name">{{ formModel.customer.name }}</div>
            <div class="sub-info">{{ formModel.customer.contact }}</div>
          </div>
          <div class="info-list">
            <div class="info-item">
              <span class="label">联系电话</span>
              <span class="value highlight">{{ formModel.customer.phone }}</span>
            </div>
            <div class="info-item">
              <span class="label">电子邮箱</span>
              <span class="value">{{ formModel.customer.email || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">联系地址</span>
              <span class="value">{{ formModel.customer.address || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">银行账号</span>
              <span class="value mono">{{ formModel.customer.bankAccount || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">开户行</span>
              <span class="value">{{ formModel.customer.bankName || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 维修信息卡片 -->
    <div class="info-card">
      <div class="card-header">
        <div class="header-icon">
          <NIcon>
            <ConstructIcon />
          </NIcon>
        </div>
        <span class="header-title">维修信息</span>
      </div>
      <div class="card-content">
        <div class="time-line">
          <div class="time-item">
            <span class="time-label">进厂日期</span>
            <span class="time-value">{{ formatTime(formModel.inDate) }}</span>
          </div>
          <div class="time-item">
            <span class="time-label">预计完工</span>
            <span class="time-value">{{ formatTime(formModel.estimatedCompletionDate) }}</span>
          </div>
        </div>
        <div class="desc-section">
          <div class="desc-title">故障描述</div>
          <div class="desc-content">{{ formModel.faultDesc }}</div>
        </div>
        <div class="desc-section" v-if="formModel.remark">
          <div class="desc-title">备注信息</div>
          <div class="desc-content">{{ formModel.remark }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  padding: 16px 24px;
  background: #f5f7fa;
}

/* 顶部状态卡片样式 */
.status-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);

  &.pending {
    background: linear-gradient(to left, #fff, #fff 50%, rgba(51, 54, 57, 0.06));
  }
  &.checked {
    background: linear-gradient(to left, #fff, #fff 50%, rgba(250, 173, 20, 0.08));
  }
  &.repaired {
    background: linear-gradient(to left, #fff, #fff 50%, rgba(22, 93, 255, 0.08));
  }
  &.completed {
    background: linear-gradient(to left, #fff, #fff 50%, rgba(82, 196, 26, 0.08));
  }
  &.delivered {
    background: linear-gradient(to left, #fff, #fff 50%, rgba(82, 196, 26, 0.08));
  }
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-no {
  font-size: 20px;
  font-weight: 600;
  color: var(--n-text-color);
}

.status-tag {
  border-radius: 4px;
  font-size: 13px;
  padding: 4px 12px;
  font-weight: 500;
}

.time-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: right;
}

.time-item {
  font-size: 13px;
  color: var(--n-text-color-3);
}

.time-value {
  margin-left: 8px;
  color: var(--n-text-color);
}

/* 主体内容布局 */
.detail-main {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

/* 信息卡片通用样式 */
.info-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  height: 100%; /* 确保卡片高度一致 */
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--n-border-color);
  display: flex;
  align-items: center;
  background: #fafafa;
}

.header-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--n-primary-color-1);
  color: var(--n-primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--n-text-color);
}

.card-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.main-info {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--n-border-color);
}

.plate-number,
.customer-name {
  font-size: 24px;
  font-weight: 600;
  color: var(--n-primary-color);
  margin-bottom: 8px;
}

.sub-info {
  font-size: 14px;
  color: var(--n-text-color-3);
}

/* 信息列表样式 */
.info-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  flex: 1;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 13px;
  color: #8c8c8c;
}

.value {
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.6;
  min-height: 22px;
}

.value.highlight {
  color: var(--n-primary-color);
  font-weight: 500;
}

.value.mono {
  font-family: var(--n-font-family-mono);
  font-size: 13px;
  letter-spacing: 0.5px;
}

.value:empty::after,
.value:contains("-")::after {
  content: "-";
  color: #c0c4cc;
}

/* 维修信息特殊样式 */
.time-line {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px dashed var(--n-border-color);
}

.desc-section {
  margin-bottom: 20px;
}

.desc-section:last-child {
  margin-bottom: 0;
}

.desc-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--n-text-color);
  margin-bottom: 12px;
}

.desc-content {
  padding: 16px;
  background: #f9fafb;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--n-text-color);
}

/* 暗黑模式适配 */
:deep(.dark) {
  .detail-container {
    background: #18181c;
  }

  .info-card,
  .status-card {
    background: #1f1f23;
    border: 1px solid rgba(255, 255, 255, 0.09);
  }

  .card-header {
    background: rgba(255, 255, 255, 0.04);
  }

  .desc-content {
    background: rgba(255, 255, 255, 0.04);
  }

  .header-icon {
    background: rgba(var(--n-primary-color-rgb), 0.15);
  }

  .label {
    color: rgba(255, 255, 255, 0.45);
  }

  .value {
    color: rgba(255, 255, 255, 0.85);
  }

  .value:empty::after,
  .value:contains("-")::after {
    color: rgba(255, 255, 255, 0.25);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-container {
    padding: 12px;
  }

  .detail-main {
    grid-template-columns: 1fr;
  }

  .info-list {
    grid-template-columns: 1fr;
  }

  .time-line {
    flex-direction: column;
    gap: 16px;
  }

  .status-header {
    flex-direction: column;
    gap: 16px;
  }

  .time-info {
    text-align: left;
  }
}
</style>
