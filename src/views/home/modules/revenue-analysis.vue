<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useEcharts } from '@/hooks/common/echarts';

const { t } = useI18n();

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

const { domRef, updateOptions } = useEcharts(() => ({
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

  updateOptions(opts => {
    const monthlyData = generateMonthlyRevenueData();
    opts.xAxis.data = getLast12Months();
    opts.series[0].data = monthlyData.map(d => d.parts);
    opts.series[1].data = monthlyData.map(d => d.labor);
    return opts;
  });
}

// 初始化数据
async function init() {
  try {
    await mockData();
  } catch (error) {
    console.error('获取收入分析数据失败:', error);
  }
}

onMounted(() => {
  init();
});
</script>

<template>
  <div ref="domRef" class="h-80" />
</template>

<style scoped>
.h-80 {
  height: 320px;
}
</style>
