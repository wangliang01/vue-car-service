<template>
  <n-drawer
    :show="visible"
    :width="1280"
    :placement="placement"
    :trap-focus="false"
    @update:show="emit('update:visible', $event)"
  >
    <n-drawer-content :title="title" :native-scrollbar="false">
      <template #footer>
        <div style="text-align: right;">
          <n-button @click="emit('update:visible', false)" type="primary">关闭</n-button>
        </div>
      </template>
      <div class="repair-detail">
        <div class="repair-header">
          <h2 class="main-title">在某省级单位公务用车维修项目清单</h2>
          <div class="info-row">
            <div class="info-item">
              <span class="label">送修单位：</span>
              <span class="value">{{ data?.customer?.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">车牌号：</span>
              <span class="value">{{ data?.vehicle?.licensePlate }}</span>
            </div>
            <div class="info-item">
              <span class="label">排量：</span>
              <span class="value">1.5</span>
            </div>
            <div class="info-item">
              <span class="label">送修日期：</span>
              <span class="value">{{ formatDate(data?.repairOrder?.inDate, 'YYYY-MM-DD') }}</span>
            </div>
            <div class="info-item">
              <span class="label">单位：</span>
              <span class="value">元</span>
            </div>
          </div>
        </div>

        <div class="repair-table">
          <n-table :bordered="true" :single-line="false" :data="tableData">
            <colgroup>
              <col v-for="i in 14" :key="i" />
            </colgroup>
            <thead>
              <tr>
                <th rowspan="2">序号</th>
                <th rowspan="2">维修项目</th>
                <th colspan="3">维修工时费</th>
                <th colspan="2">应收维修工时费</th>
                <th rowspan="2">材料名称</th>
                <th rowspan="2">购买进价</th>
                <th colspan="2">管理费</th>
                <th colspan="2">维修材料费</th>
                <th rowspan="2">小计</th>
              </tr>
              <tr>
                <th>工时定额</th>
                <th>工时单价</th>
                <th>复杂系数</th>
                <th>工时费优惠率%</th>
                <th>实收工时费</th>
                <th>收取比例%</th>
                <th>管理费优惠率%</th>
                <th>应收材料费</th>
                <th>实收材料费</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in tableData" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.repairItemName }}</td>
                <td>{{ item.repairItemQuantity }}</td>
                <td>{{ item.repairItemPrice }}</td>
                <td>{{ item.complexityFactor }}</td>
                <td>{{ item.repairItemDiscount }}</td>
                <td>{{ item.repairItemAmount }}</td>
                <td>{{ item.repairItemPartsName }}</td>
                <td>{{ item.repairItemPartsPrice }}</td>
                <td>{{ item.repairItemPartsManagementFee }}</td>
                <td>{{ item.repairItemPartsManagementDiscount }}</td>
                <td>{{ item.repairItemPartsManagementFee }}</td>
                <td>{{ item.repairItemPartsManagementDiscount }}</td>
                <td>{{ item.repairItemTotal }}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" class="text-right">维修费合计（大写）：</td>
                <td colspan="4" class="text-left">{{ upperCaseAmount }}</td>
                <td colspan="3" class="text-right">维修费合计（小写）：</td>
                <td colspan="4" class="text-left">¥{{ totalAmount }}</td>
              </tr>
              <tr class="total-row">
                <td colspan="14">
                  1.维修工时费=工时定额×工时单价×复杂系数×(1-工时费优惠率)
                </td>
              </tr>
              <tr class="total-row">
                <td colspan="14">
                  2.维修材料费=购买进价×(1+材料管理费比例)×管理费优惠率
                </td>
              </tr>
              <tr class="total-row">
                <td colspan="14">
                  3.维修费=维修工时费+维修材料费
                </td>
              </tr>
              <tr class="total-row">
                <td colspan="3" class="text-right">承修单位名称：</td>
                <td colspan="4" class="text-left"></td>
                <td colspan="2" class="text-right">填表日期：</td>
                <td colspan="2" class="text-left"></td>
                <td colspan="1" class="text-right">流水号：</td>
                <td colspan="3" class="text-left"></td>
              </tr>
              <tr class="total-row">
                <td colspan="3" class="text-right">送修单位经办人：</td>
                <td colspan="4" class="text-left"></td>
                <td colspan="2" class="text-right">维修厂承办人：</td>
                <td colspan="5" class="text-left"></td>
              </tr>
            </tbody>


          </n-table>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDrawer, NDrawerContent, NTable, NButton, DrawerPlacement } from 'naive-ui';
import type { Api } from '@/typings/settlement';
import { formatDate } from '@/utils/common';
import Nzh from 'nzh';

const nzh = Nzh.cn

console.log("nzh", nzh)

// import LuckySheet from '@/components/LuckySheet/index.vue';

interface Props {
  visible: boolean;
  data?: Api.Settlement.SettlementInfo;
  type?: 'view' | 'download';
}

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>();

const { t } = useI18n();
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  type: 'view'
});

const title = ref(t('settlement.detail'));
const placement = ref<DrawerPlacement>('right');
const tableData = ref([])
const totalAmount = ref()
const upperCaseAmount = ref('')

const transformData = (data: Api.Settlement.SettlementInfo) => {
  const result = []
  // 维修项目
  const repairItems = data?.repairOrder?.repairItems || []
  repairItems.forEach(item => {
    const parts = item.parts
    parts.forEach(part => {
      const tableItem = {
        repairItemName: item.name, // 维修项目名称
        repairItemPrice: item.laborPrice, // 工时单价
        repairItemQuantity: item.laborHours, // 工时定额
        complexityFactor: item.complexityFactor, // 复杂系数
        repairItemDiscount: item.laborDiscount, // 工时费优惠率
        repairItemAmount: item.actualLaborCost, // 实收工时费
        repairItemPartsName: part.name, // 材料名称
        repairItemPartsPrice: part.purchasePrice, // 购买进价
        repairItemPartsManagementFee: part.managementFee, // 管理费
        repairItemPartsManagementDiscount: part.managementDiscount, // 实收材料费
        repairItemTotal: item.actualLaborCost + part.actualMaterialCost, // 小计
      }

      result.push(tableItem)
    })
  })

  console.log("result", result)
  return result
}

// const upperCaseAmount = computed(() => {
//   const amount = totalAmount.value
//   console.log("amount", amount)
//   if (amount) {
//     return nzh.toMoney(amount)
//   }
//   return ''
// })

watch(() => props.data, (newVal) => {
  console.log("newVal", newVal);
  tableData.value = transformData(newVal)
  totalAmount.value = newVal?.formattedTotalAmount
  upperCaseAmount.value = newVal?.formattedTotalAmount ? nzh.toMoney(newVal?.formattedTotalAmount, { outSymbol:false}) : ''
}, { deep: true, immediate: true });


</script>

<style scoped>
.repair-detail {
  padding: 10px;
  background: #fff;
  /* min-width: 1100px;
  max-width: 1280px; */
  margin: 0 auto;
  border: 2px solid #000;
  position: relative;
}

.repair-detail::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 1px solid #000;
  pointer-events: none;
}

.repair-header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  padding: 0 20px;
}

.main-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: 4px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 20px 20px;
  text-align: left;
  flex-wrap: nowrap;
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex: 1;
}

.label {
  font-weight: bold;
  margin-right: 15px;
  color: #000;
  min-width: auto;
  flex-shrink: 0;
  font-size: 15px;
}

.value {
  color: #000;
  border-bottom: 1px solid #000;
  padding: 0 8px 4px;
  flex: 1;
  text-align: left;
  font-size: 15px;
  min-width: 120px;
}

.repair-table {
  margin: 0 20px 20px;
  position: relative;
}

:deep(.n-table) {
  border: 2px solid #000 !important;
  width: 100%;
}

:deep(.n-table-wrapper) {
  border: none !important;
}

:deep(.n-table-thead) {
  border-right: 1px solid #000 !important;
}

:deep(.n-table-tbody) {
  border-right: 1px solid #000 !important;
}

:deep(.n-table th) {
  background-color: #fff !important;
  font-weight: bold;
  padding: 12px 8px !important;
  text-align: center;
  font-size: 14px;
  border: 1px solid #000 !important;
}

:deep(.n-table td) {
  padding: 10px 8px !important;
  text-align: center;
  font-size: 14px;
  border: 1px solid #000 !important;
}

:deep(.n-table-td--last) {
  border-right: 1px solid #000 !important;
}

:deep(.n-table-th--last) {
  border-right: 1px solid #000 !important;
}

/* 设置列宽 */
:deep(.n-table-wrapper table) {
  table-layout: fixed;
}

:deep(.n-table col:nth-child(1)) { width: 60px; }  /* 序号 */
:deep(.n-table col:nth-child(2)) { width: 140px; } /* 维修项目 */
:deep(.n-table col:nth-child(3)),
:deep(.n-table col:nth-child(4)),
:deep(.n-table col:nth-child(5)) { width: 90px; }  /* 工时费相关 */
:deep(.n-table col:nth-child(6)),
:deep(.n-table col:nth-child(7)) { width: 110px; } /* 应收工时费相关 */
:deep(.n-table col:nth-child(8)) { width: 140px; } /* 材料名称 */
:deep(.n-table col:nth-child(9)) { width: 90px; }  /* 购买进价 */
:deep(.n-table col:nth-child(10)),
:deep(.n-table col:nth-child(11)) { width: 110px; } /* 管理费相关 */
:deep(.n-table col:nth-child(12)),
:deep(.n-table col:nth-child(13)) { width: 110px; } /* 维修材料费相关 */
:deep(.n-table col:nth-child(14)) { width: 90px; }  /* 小计 */

.repair-footer {
  margin: 40px 40px 0;
  padding: 0;
}

.calculation {
  margin-bottom: 40px;
  padding-top: 30px;
  border-top: 1px solid #000;
}

.calculation p {
  margin: 12px 0;
  color: #000;
  font-size: 15px;
  text-indent: 2em;
  line-height: 1.5;
}

.signature {
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
  padding: 0 100px;
}

.sign-item {
  display: flex;
  align-items: center;
}

.sign-item span {
  color: #000;
  font-size: 15px;
  font-weight: bold;
}

.underline {
  display: inline-block;
  width: 200px;
  border-bottom: 1px solid #000;
  margin-left: 20px;
  position: relative;
}

.underline::after {
  content: '（签字）';
  position: absolute;
  right: 0;
  bottom: -25px;
  font-size: 13px;
  color: #666;
}

/* 打印样式优化 */
@media print {
  .repair-detail {
    padding: 40px;
    border: 2px solid #000;
    margin: 0;
    box-shadow: none;
  }

  .main-title {
    margin-top: 10px;
  }

  :deep(.n-table) {
    border: 2px solid #000 !important;
  }

  :deep(.n-table th),
  :deep(.n-table td) {
    border-color: #000 !important;
  }

  .repair-footer {
    page-break-inside: avoid;
  }
}

:deep(.total-row td) {
  background-color: #fff !important;
  font-weight: bold;
  padding: 12px 8px !important;
  border: 1px solid #000 !important;
}

:deep(.text-right) {
  text-align: right !important;
  padding-right: 20px !important;
}

:deep(.text-left) {
  text-align: left !important;
  padding-left: 20px !important;
}
</style>
