<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { NSpace, NGrid, NGi, NCard, NStatistic, NList, NListItem, NTag, NButton, NEmpty } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useEcharts } from '@/hooks/common/echarts';
import type { ECOption } from '@/hooks/common/echarts';
import RevenueTrend from './modules/revenue-trend.vue';
import RevenueAnalysis from './modules/revenue-analysis.vue';
import { fetchDashboardStats, fetchTodoList } from '@/service/api/dashboard';

const { t } = useI18n();
const appStore = useAppStore();
const gap = computed(() => (appStore.isMobile ? 0 : 16));

// 统计数据
const stats = ref({
  repairOrders: {
    total: 0,
    pending: 0,
    repairing: 0,
    completed: 0
  },
  customers: {
    total: 0,
    monthlyNew: 0
  },
  revenue: {
    today: 0,
    month: 0,
    yearToDate: 0
  },
  inventory: {
    lowStock: 0,
    outOfStock: 0
  }
});

// 待办事项
const todos = ref([]);

// 加载统计数据
async function loadStats() {
  try {
    const { data } = await fetchDashboardStats();
    stats.value = {
      repairOrders: {
        total: data.totalOrders,
        pending: 0,
        repairing: 0,
        completed: 0
      },
      customers: {
        total: data.totalCustomers,
        monthlyNew: 0
      },
      revenue: {
        today: 0,
        month: data.monthlyIncome,
        yearToDate: 0
      },
      inventory: {
        lowStock: data.inventoryWarnings,
        outOfStock: 0
      }
    };
  } catch (error) {
    console.error('获取统计数据失败:', error);
  }
}

// 加载待办事项
async function loadTodos() {
  try {
    const { data } = await fetchTodoList();

    // 合并待处理工单和库存预警
    const todoList = [
      ...data.pendingOrders.map((order: any) => ({
        type: 'repair_order',
        title: `工单号：${order.orderNo}`,
        subTitle: `${order.vehicle.brand} ${order.vehicle.model} / ${order.vehicle.plateNumber}`,
        desc: order.faultDesc,
        status: t(`repairOrder.status.${order.status}`),
        priority: order.priority === 2 ? 'high' : order.priority === 1 ? 'medium' : 'low',
        createTime: order.createdAt,
        orderNo: order.orderNo
      })),
      ...data.warningInventory.map((item: any) => ({
        type: 'inventory',
        title: `${item.name}库存不足`,
        status: '待补货',
        priority: 'high',
        createTime: new Date().toISOString()
      }))
    ];

    todos.value = todoList;
  } catch (error) {
    console.error('获取待办事项失败:', error);
  }
}

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
const { domRef: orderTrendRef, updateOptions: updateOrderTrendOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br />{a}: ¥{c}'
  },
  xAxis: {
    type: 'category',
    data: [],
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
      data: [],
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
}));

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
const { domRef: revenueChartRef, updateOptions: updateRevenueOptions } = useEcharts(() => ({
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
    data: [],
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
      data: [],
      itemStyle: {
        color: '#409EFF'
      }
    },
    {
      name: t('page.home.chart.laborRevenue'),
      type: 'bar',
      stack: 'revenue',
      data: [],
      itemStyle: {
        color: '#67C23A'
      }
    }
  ]
}));

// 模拟数据加载
async function mockData() {
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 更新收入趋势图表
  updateOrderTrendOptions(opts => {
    opts.xAxis.data = getLast30Days();
    opts.series[0].data = generateRevenueData();
    return opts;
  });

  // 更新收入分析图表
  updateRevenueOptions(opts => {
    const monthlyData = generateMonthlyRevenueData();
    opts.xAxis.data = getLast12Months();
    opts.series[0].data = monthlyData.map(d => d.parts);
    opts.series[1].data = monthlyData.map(d => d.labor);
    return opts;
  });
}

// 初始化数据
async function init() {
  await Promise.all([
    loadStats(),
    loadTodos()
  ]);
}

onMounted(() => {
  init();
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
          <RevenueTrend />
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:10">
        <NCard :bordered="false" :title="t('page.home.chart.revenueAnalysis')">
          <RevenueAnalysis />
        </NCard>
      </NGi>
    </NGrid>

    <!-- 待办事项和快捷操作 -->
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <NCard :bordered="false" :title="t('page.home.todo.title')" class="todo-card">
          <div class="todo-content">
            <NList v-if="todos.length > 0">
              <NListItem v-for="todo in todos" :key="todo.orderNo || todo.title">
                <NSpace align="center" justify="space-between">
                  <span>
                    {{ todo.type === 'repair_order' ?
                      `【${todo.title}】${todo.desc} - ${todo.subTitle}` :
                      todo.title
                    }}
                  </span>
                  <NTag :type="todo.priority === 'high' ? 'error' : todo.priority === 'medium' ? 'warning' : 'info'">
                    {{ todo.status }}
                  </NTag>
                </NSpace>
              </NListItem>
            </NList>
            <div v-else class="empty-state">
              <NEmpty description="暂无待办事项" />
            </div>
          </div>
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

.todo-card {
  height: 100%;
}

.todo-card :deep(.n-card__content) {
  padding: 0;
}

.todo-content {
  height: 200px;
  overflow-y: auto;
  padding: 8px 16px;
}

.todo-content::-webkit-scrollbar {
  width: 6px;
}

.todo-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.todo-content::-webkit-scrollbar-track {
  background-color: transparent;
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.todo-subtitle {
  font-size: 12px;
  color: #666;
}
</style>
