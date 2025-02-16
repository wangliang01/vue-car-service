<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useEcharts } from '@/hooks/common/echarts';
import { fetchIncomeTrend } from '@/service/api/dashboard';
import dayjs from 'dayjs';

const { t } = useI18n();
const loading = ref(true);

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = dayjs(dateStr);
  return `${date.month() + 1}月${date.date()}日`;
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

// 加载数据
async function loadData() {
  try {
    loading.value = true;
    const { data } = await fetchIncomeTrend();

    updateOptions(opts => {
      opts.xAxis.data = data.map((item: any) => formatDate(item.date));
      opts.series[0].data = data.map((item: any) => item.totalAmount);
      return opts;
    });
  } catch (error) {
    console.error('获取收入趋势数据失败:', error);
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
