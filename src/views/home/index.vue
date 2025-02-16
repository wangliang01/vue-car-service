<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { NSpace, NGrid, NGi, NCard, NStatistic, NList, NListItem, NTag, NButton } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useEcharts } from '@/hooks/common/echarts';
import type { ECOption } from '@/hooks/common/echarts';

const { t } = useI18n();
const appStore = useAppStore();
const gap = computed(() => (appStore.isMobile ? 0 : 16));

// 统计数据
const stats = ref({
  repairOrders: {
    total: 156,
    pending: 23,
    repairing: 45,
    completed: 88
  },
  customers: {
    total: 1234,
    monthlyNew: 45
  },
  revenue: {
    today: 12580,
    month: 356789,
    yearToDate: 2345678
  },
  inventory: {
    lowStock: 12,
    outOfStock: 3
  }
});

// 待办事项
const todos = ref([
  {
    type: 'repair_order',
    title: '奔驰C200维修检查',
    status: '待处理',
    priority: 'high',
    createTime: '2024-03-18 10:30'
  },
  {
    type: 'inspection',
    title: '宝马320Li年检',
    status: '进行中',
    priority: 'medium',
    createTime: '2024-03-18 09:15'
  },
  {
    type: 'payment',
    title: '奥迪A6L结算待确认',
    status: '待确认',
    priority: 'low',
    createTime: '2024-03-18 08:45'
  },
  {
    type: 'inventory',
    title: '机油库存不足',
    status: '待补货',
    priority: 'high',
    createTime: '2024-03-18 08:30'
  }
]);

// 生成最近30天的日期数据
const getLast30Days = () => {
  const dates = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(`${date.getMonth() + 1}月${date.getDate()}日`);
  }
  return dates;
};

// 生成模拟的收入数据
const generateRevenueData = () => {
  return Array.from({ length: 30 }, () => Math.floor(Math.random() * 50000 + 10000));
};

// 收入趋势图表
const getOrderTrendOptions = (): ECOption => ({
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br />{a}: ¥{c}'
  },
  xAxis: {
    type: 'category',
    data: getLast30Days(),
    axisLabel: {
      interval: 'auto',
      rotate: 45,
      fontSize: 12,
      margin: 8
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: (value: number) => `¥${value}`
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true
  },
  series: [
    {
      name: t('page.home.chart.revenueTrend'),
      type: 'line',
      smooth: true,
      data: generateRevenueData(),
      itemStyle: {
        color: '#67c23a'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(103,194,58,0.3)'
            },
            {
              offset: 1,
              color: 'rgba(103,194,58,0.1)'
            }
          ]
        }
      }
    }
  ]
});

// 获取最近12个月
const getLast12Months = () => {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${month.getFullYear()}年${month.getMonth() + 1}月`);
  }
  return months;
};

// 生成模拟的月度收入数据
const generateMonthlyRevenueData = () => {
  return Array.from({ length: 12 }, () => ({
    parts: Math.floor(Math.random() * 200000 + 100000),
    labor: Math.floor(Math.random() * 150000 + 80000)
  }));
};

// 收入分析图表
const getRevenueOptions = (): ECOption => {
  const monthlyData = generateMonthlyRevenueData();
  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const month = params[0].axisValue;
        let html = `${month}<br/>`;
        params.forEach((param: any) => {
          html += `${param.seriesName}: ¥${param.value.toLocaleString()}<br/>`;
        });
        const total = params.reduce((sum: number, param: any) => sum + param.value, 0);
        html += `总计: ¥${total.toLocaleString()}`;
        return html;
      }
    },
    legend: {
      data: [t('page.home.chart.partsRevenue'), t('page.home.chart.laborRevenue')]
    },
    xAxis: {
      type: 'category',
      data: getLast12Months(),
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 12,
        margin: 8
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `¥${value.toLocaleString()}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    series: [
      {
        name: t('page.home.chart.partsRevenue'),
        type: 'bar',
        stack: 'revenue',
        data: monthlyData.map(d => d.parts),
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: t('page.home.chart.laborRevenue'),
        type: 'bar',
        stack: 'revenue',
        data: monthlyData.map(d => d.labor),
        itemStyle: {
          color: '#67C23A'
        }
      }
    ]
  };
};

const { domRef: orderTrendRef } = useEcharts(getOrderTrendOptions);
const { domRef: revenueChartRef } = useEcharts(getRevenueOptions);

// 获取首页数据
const fetchHomeData = async () => {
  try {
    // TODO: 调用后端API获取数据
    // const { data } = await fetchHomeStats();
    // stats.value = data;
  } catch (error) {
    console.error('获取首页数据失败:', error);
  }
};

onMounted(() => {
  fetchHomeData();
});
</script>

<template>
  <NSpace vertical :size="16">
    <!-- 统计卡片 -->
    <NGrid :cols="24" :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:12 m:6">
        <NCard :bordered="false">
          <NStatistic :label="t('page.home.stats.totalOrders')" :value="stats.repairOrders.total">
            <!-- <template #suffix>
              <NTag type="success">{{ stats.repairOrders.completed }} {{ t('page.home.stats.completed') }}</NTag>
            </template> -->
          </NStatistic>
        </NCard>
      </NGi>
      <NGi span="24 s:12 m:6">
        <NCard :bordered="false">
          <NStatistic :label="t('page.home.stats.monthlyRevenue')" :value="stats.revenue.month" :precision="2">
            <template #prefix>¥</template>
          </NStatistic>
        </NCard>
      </NGi>
      <NGi span="24 s:12 m:6">
        <NCard :bordered="false">
          <NStatistic :label="t('page.home.stats.totalCustomers')" :value="stats.customers.total">
            <!-- <template #suffix>
              <NTag type="info">+{{ stats.customers.monthlyNew }}</NTag>
            </template> -->
          </NStatistic>
        </NCard>
      </NGi>
      <NGi span="24 s:12 m:6">
        <NCard :bordered="false">
          <NStatistic :label="t('page.home.stats.inventoryAlert')" :value="stats.inventory.lowStock">
            <!-- <template #suffix>
              <NTag type="warning">{{ stats.inventory.outOfStock }}</NTag>
            </template> -->
          </NStatistic>
        </NCard>
      </NGi>
    </NGrid>

    <!-- 图表区域 -->
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <NCard :bordered="false" :title="t('page.home.chart.revenueTrend')">
          <div ref="orderTrendRef" class="h-80" />
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:10">
        <NCard :bordered="false" :title="t('page.home.chart.revenueAnalysis')">
          <div ref="revenueChartRef" class="h-80" />
        </NCard>
      </NGi>
    </NGrid>

    <!-- 待办事项和快捷操作 -->
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <NCard :bordered="false" :title="t('page.home.todo.title')">
          <NList>
            <NListItem v-for="todo in todos" :key="todo.title">
              <NSpace align="center" justify="space-between">
                <span>{{ todo.title }}</span>
                <NTag :type="todo.priority === 'high' ? 'error' : todo.priority === 'medium' ? 'warning' : 'info'">
                  {{ todo.status }}
                </NTag>
              </NSpace>
            </NListItem>
          </NList>
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:10">
        <NCard :bordered="false" :title="t('page.home.quickAction.title')">
          <NGrid :cols="2" :x-gap="12" :y-gap="12">
            <NGi>
              <div class="quick-action-item" @click="$router.push('/repair/list')">
                <div class="icon">
                  <div class="i-material-symbols:build-circle text-24px" />
                </div>
                <div class="text">{{ t('page.home.quickAction.newOrder') }}</div>
              </div>
            </NGi>
            <NGi>
              <div class="quick-action-item" @click="$router.push('/customer/list')">
                <div class="icon">
                  <div class="i-material-symbols:person-add text-24px" />
                </div>
                <div class="text">{{ t('page.home.quickAction.newCustomer') }}</div>
              </div>
            </NGi>
            <NGi>
              <div class="quick-action-item" @click="$router.push('/inventory/list')">
                <div class="icon">
                  <div class="i-material-symbols:inventory text-24px" />
                </div>
                <div class="text">{{ t('page.home.quickAction.inventory') }}</div>
              </div>
            </NGi>
            <NGi>
              <div class="quick-action-item" @click="$router.push('/repair/settlement')">
                <div class="icon">
                  <div class="i-material-symbols:payments text-24px" />
                </div>
                <div class="text">{{ t('page.home.quickAction.settlement') }}</div>
              </div>
            </NGi>
          </NGrid>
        </NCard>
      </NGi>
    </NGrid>
  </NSpace>
</template>

<style scoped>
.h-80 {
  height: 320px;
}

.quick-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-action-item:hover {
  border-color: var(--primary-color);
  background-color: rgba(var(--primary-color-rgb), 0.1);
}

.quick-action-item .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
  color: var(--primary-color);
}

.quick-action-item .text {
  font-size: 14px;
  color: #4b5563;
}

.quick-action-item:hover .text {
  color: var(--primary-color);
}
</style>
