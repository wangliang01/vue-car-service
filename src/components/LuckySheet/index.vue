<template>
  <div :id="containerId" :style="{ width, height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import 'luckysheet/dist/plugins/css/pluginsCss.css';
import 'luckysheet/dist/plugins/plugins.css';
import 'luckysheet/dist/css/luckysheet.css';
import 'luckysheet/dist/assets/iconfont/iconfont.css';
import luckysheet from 'luckysheet';

interface Props {
  // 容器宽度
  width?: string;
  // 容器高度
  height?: string;
  // 表格数据
  data?: any[];
  // 配置项
  options?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
  data: () => [],
  options: () => ({})
});

// 生成唯一的容器ID
const containerId = `luckysheet-${Date.now()}`;
let initialized = false;

// 初始化表格
const initLuckysheet = () => {
  if (!props.data || props.data.length === 0) return;

  const defaultOptions = {
    container: containerId,
    showinfobar: false,
    showsheetbar: false,
    showtoolbar: false,
    enableAddRow: false,
    enableAddCol: false,
    showstatisticBar: false,
    allowCopy: true,
    enableAddBackTop: false,
    lang: 'zh'
  };

  const options = {
    ...defaultOptions,
    ...props.options,
    data: props.data
  };

  // 如果已经初始化，则更新数据
  if (initialized && luckysheet.getAllSheets) {
    luckysheet.destroy();
  }

  // 确保DOM已经渲染
  setTimeout(() => {
    luckysheet.create(options);
    initialized = true;
  }, 0);
};

// 监听数据变化
watch(
  () => props.data,
  (newData) => {
    if (newData && newData.length > 0) {
      initLuckysheet();
    }
  },
  { deep: true, immediate: true }
);

// 组件挂载时初始化
onMounted(() => {
  if (props.data && props.data.length > 0) {
    initLuckysheet();
  }
});

// 组件卸载时清理
onBeforeUnmount(() => {
  if (luckysheet.destroy) {
    luckysheet.destroy();
  }
});
</script>

<style scoped>
:deep(.luckysheet-share-logo),
:deep(.luckysheet-print-viewList) {
  display: none !important;
}

:deep(.luckysheet-grid-container) {
  background-color: #fff !important;
}

:deep(.luckysheet-grid-window) {
  background-color: #fff !important;
}

:deep(.luckysheet-scrollbar-y),
:deep(.luckysheet-scrollbar-x) {
  display: none !important;
}
</style>
