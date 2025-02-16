<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useEcharts } from '@/hooks/common/echarts';
import { fetchIncomeAnalysis } from '@/service/api/dashboard';
import dayjs from 'dayjs';

const { t } = useI18n();
const loading = ref(true);

// 格式化月份
const formatMonth = (dateStr: string) => {
  const date = dayjs(dateStr);
  return `${date.year()}年${date.month() + 1}月`;
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

// 加载数据
async function loadData() {
  try {
    loading.value = true;
    const { data } = await fetchIncomeAnalysis();

    updateOptions(opts => {
      opts.xAxis.data = data.map((item: any) => formatMonth(item.date));
      opts.series[0].data = data.map((item: any) => item.partsIncome);
      opts.series[1].data = data.map((item: any) => item.laborIncome);
      return opts;
    });
  } catch (error) {
    console.error('获取收入分析数据失败:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadData();
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
