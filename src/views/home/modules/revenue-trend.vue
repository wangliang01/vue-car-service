<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useEcharts } from '@/hooks/common/echarts';

const { t } = useI18n();

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

const { domRef, updateOptions } = useEcharts(() => ({
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

// 模拟数据加载
async function mockData() {
  await new Promise(resolve => setTimeout(resolve, 1000));

  updateOptions(opts => {
    opts.xAxis.data = getLast30Days();
    opts.series[0].data = generateRevenueData();
    return opts;
  });
}

// 初始化数据
async function init() {
  try {
    await mockData();
  } catch (error) {
    console.error('获取收入趋势数据失败:', error);
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
