<script setup lang="ts">
import { computed } from 'vue';
import { NTag, NIcon, NDrawer, NDrawerContent, useThemeVars } from 'naive-ui';
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
}

const props = withDefaults(defineProps<Props>(), {
  editData: undefined
});

const show = defineModel('show', { type: Boolean, default: false });
const { t } = useI18n();

// 获取主题变量
const themeVars = useThemeVars();

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
  <NDrawer v-model:show="show" :width="800">
    <NDrawerContent :title="t('common.view')">
      <div class="detail-container bg-white p-4">
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

        <div class="detail-main gap-4 mt-4">
          <!-- 左侧车辆信息 -->
          <div class="info-card">
            <div class="card-header">
              <div class="header-icon">
                <NIcon size="18">
                  <CarIcon />
                </NIcon>
              </div>
              <span class="header-title">{{ t('menu.repairOrder.vehicle') }}</span>
            </div>
            <div class="card-content">
              <div class="main-info" >
                <div class="plate-number">{{ editData.vehicle.licensePlate }}</div>
                <div class="sub-info">{{ editData.vehicle.brand }} {{ editData.vehicle.model }}</div>
              </div>
              <div class="info-list">
                <div class="info-item">
                  <span class="label">购车年份</span>
                  <span class="value">{{ editData.vehicle.year ? dayjs(editData.vehicle.year).format('YYYY') : '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">行驶里程</span>
                  <span class="value">{{ editData.vehicle.mileage }} km</span>
                </div>
                <div class="info-item">
                  <span class="label">车架号</span>
                  <span class="value mono">{{ editData.vehicle.vin || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">发动机号</span>
                  <span class="value mono">{{ editData.vehicle.engineNo || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">排量</span>
                  <span class="value">{{ editData.vehicle.displacement || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">车辆颜色</span>
                  <span class="value">{{ editData.vehicle.color || '-' }}</span>
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
                <div class="customer-name">{{ editData.customer.name }}</div>
                <div class="sub-info">{{ editData.customer.contact }}</div>
              </div>
              <div class="info-list">
                <div class="info-item">
                  <span class="label">联系电话</span>
                  <span class="value highlight">{{ editData.customer.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">电子邮箱</span>
                  <span class="value">{{ editData.customer.email || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">联系地址</span>
                  <span class="value">{{ editData.customer.address || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">银行账号</span>
                  <span class="value mono">{{ editData.customer.bankAccount || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">开户行</span>
                  <span class="value">{{ editData.customer.bankName || '-' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 维修信息卡片 -->
        <div class="info-card mt-4">
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
                <span class="time-value">{{ formatTime(editData.inDate) }}</span>
              </div>
              <div class="time-item">
                <span class="time-label">预计完工</span>
                <span class="time-value">{{ formatTime(editData.estimatedCompletionDate) }}</span>
              </div>
            </div>
            <div class="desc-section">
              <div class="desc-title">故障描述</div>
              <div class="desc-content">{{ editData.faultDesc }}</div>
            </div>
            <div class="desc-section" v-if="editData.remark">
              <div class="desc-title">备注信息</div>
              <div class="desc-content">{{ editData.remark }}</div>
            </div>

            <!-- 维修项目列表 -->
            <div class="repair-items" v-if="editData.repairItems?.length">
              <div class="section-title">维修项目</div>
              <div class="items-list">
                <div v-for="item in editData.repairItems" :key="item._id" class="repair-item">
                  <div class="item-header">
                    <div class="detail-row">
                      <span class="detail-label">项目名称</span>
                      <span class="detail-value">{{ item.name }}</span>
                    </div>
                  </div>


                  <div class="item-details">
                    <div class="detail-row">
                      <span class="detail-label">工时定额</span>
                      <span class="detail-value">{{ item.laborHours }}小时</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">工时单价</span>
                      <span class="detail-value">¥{{ item.laborPrice }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">复杂系数</span>
                      <span class="detail-value">{{ item.complexityFactor }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">工时费优惠率</span>
                      <span class="detail-value">{{ item.laborDiscount }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">工时费用</span>
                      <span class="detail-value">¥{{ editData?.laborAmount }}</span>
                    </div>
                  </div>

                  <!-- 维修技师 -->
                  <div class="technicians-section">
                    <div class="sub-title">维修技师</div>
                    <div class="technicians-list">
                      {{ editData?.mechanic?.name }}
                    </div>
                  </div>

                  <!-- 维修材料 -->
                  <div class="materials-section">
                    <div class="sub-title">维修材料</div>
                    <div class="materials-table">
                      <table>
                        <thead>
                          <tr>
                            <th>材料名称</th>
                            <th>型号</th>
                            <th>数量</th>
                            <th>单价</th>
                            <th>小计</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="material in item.parts" :key="material._id">
                            <td>{{ material.name }}</td>
                            <td>{{ material.partNo || '-' }}</td>
                            <td>{{ material.quantity }}{{ material.unit }}</td>
                            <td>¥{{ material.purchasePrice }}</td>
                            <td>¥{{ material.quantity * material.unitPrice }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.detail-container {
  background: #fff;
  min-height: 100%;
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
  gap: 16px;
  margin-bottom: 16px;
}

/* 信息卡片通用样式 */
.info-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid rgb(239, 239, 245);
  height: 100%;
  /* 确保卡片高度一致 */
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 16px;
  /* 使用 CSS 变量 */
  border-bottom: 1px solid rgb(239, 239, 245);
  display: flex;
  align-items: center;
  background: rgba(var(--primary-color), 0.08);
  border-radius: 8px 8px 0 0;
}

/* 暗黑模式下的边框颜色 */
:deep(.dark) .card-header {
  border-bottom-color: rgba(255, 255, 255, 0.09);
}

.header-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  /* 使用主色但透明度降低 */
  background: rgba(var(--primary-color), 0.1);
  color: rgb(var(--primary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  /* 使用主色 */
  color: rgb(var(--primary-color));
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
    background: var(--n-card-color);
  }

  .info-card,
  .status-card {
    background: var(--n-card-color);
    border: 1px solid var(--n-border-color);
  }

  .card-header {
    background: rgba(var(--primary-color), 0.15);
  }

  .desc-content {
    background: rgba(255, 255, 255, 0.04);
  }

  .header-icon {
    background: rgba(var(--primary-color), 0.2);
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

.repair-items {
  margin-top: 24px;
  border-top: 1px dashed var(--n-border-color);
  padding-top: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: var(--n-text-color);
}

.repair-item {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--n-text-color);
}

.item-desc {
  font-size: 14px;
  color: var(--n-text-color-3);
  margin-bottom: 12px;
}

.item-details {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-label {
  font-size: 13px;
  color: var(--n-text-color-3);
}

.detail-value {
  font-size: 14px;
  color: var(--n-text-color);
  font-weight: 500;
}

.sub-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  color: var(--n-text-color);
}

.technicians-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.technician-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.tech-role {
  font-size: 12px;
  opacity: 0.7;
}

.materials-table {
  width: 100%;
  overflow-x: auto;
}

.materials-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.materials-table th,
.materials-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid var(--n-border-color);
}

.materials-table th {
  background: rgba(0, 0, 0, 0.02);
  font-weight: 500;
  color: var(--n-text-color-2);
}

/* 暗黑模式适配 */
:deep(.dark) {
  .repair-item {
    background: rgba(255, 255, 255, 0.04);
  }

  .materials-table th {
    background: rgba(255, 255, 255, 0.06);
  }
}
</style>
