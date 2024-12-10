# 新增模块指南

本文档说明如何在系统中新增一个完整的功能模块。以维修工单(repair-order)模块为例。

## 1. 目录结构

```bash
src   
├── service
│   └── api
│       └── repair-order.ts   # API接口定义
├── typings
│   └── api.d.ts             # API类型定义
├── views
│   └── repair-order         # 模块目录
│       ├── list             # 列表页面
│       │   ├── index.vue    # 页面组件
│       │   └── modules      # 子组件
│       │       ├── search.vue   # 搜索组件
│       │       └── form.vue     # 表单组件
│       └── detail           # 详情页面
└── locales
    └── langs
        ├── en-us.ts         # 英文翻译
        └── zh-cn.ts         # 中文翻译
```

## 2. 开发步骤

### 2.1 定义API类型

首先在 `src/typings/api.d.ts` 中定义模块相关的类型:

```typescript
declare namespace Api {
  namespace RepairOrder {
    // 工单信息类型
    interface RepairOrderInfo {
      _id: string;
      orderNo: string;
      status: 'pending' | 'inspecting' | 'repairing' | 'completed' | 'delivered';
      customer: Customer.CustomerInfo;
      vehicle: Vehicle.VehicleInfo;
      faultDesc: string;
      mechanic?: string;
      estimatedCompletionTime?: string;
      actualCompletionTime?: string;
      deliveryTime?: string;
      createdAt: string;
      updatedAt: string;
    }

    // 搜索参数类型
    interface SearchParams extends Common.PaginationParams {
      status?: string;
      orderNo?: string;
      customerName?: string;
      licensePlate?: string;
    }

    // 其他类型定义...
  }
}
```

### 2.2 添加API接口

在 `src/service/api/repair-order.ts` 中定义接口:

```typescript
import { request } from '../request';

/** 获取维修工单列表 */
export function fetchRepairOrderList(params: Api.RepairOrder.SearchParams) {
  return request<Api.Common.PaginationResult<Api.RepairOrder.RepairOrderInfo>>({
    url: '/repair-order',
    method: 'get',
    params
  });
}

// 其他接口定义...
```

### 2.3 添加国际化配置

在 `src/locales/langs/zh-cn.ts` 中添加翻译:

```typescript
const local: App.I18n.Schema = {
  route: {
    repairOrder: '维修工单',
    repairOrder_list: '工单列表'
  },
  menu: {
    repairOrder: {
      _value: '维修工单',
      list: '工单列表',
      status: '工单状态',
      orderNo: '工单编号',
      customerName: '客户名称',
      licensePlate: '车牌号'
    }
  }
};
```

### 2.4 添加视图组件

在 `src/views/repair-order/list/index.vue` 中添加视图组件:

```vue
<script setup lang="ts">
import { reactive, h } from 'vue';
import { NButton, NSpace, NInput, NCard, NDataTable } from 'naive-ui';
import { useTable } from '@/hooks/common/table';
import { useI18n } from 'vue-i18n';
import { fetchRepairOrderList, fetchDeleteRepairOrder } from '@/service/api/repair-order';

defineOptions({ name: 'RepairOrderList' });

const { t } = useI18n();

const searchForm = reactive({
  orderNo: '',
  customerName: ''
});

const columns = [
  { type: 'selection' },
  { title: t('common.index'), key: 'index' },
  { title: t('menu.repairOrder.orderNo'), key: 'orderNo' },
  { title: t('menu.repairOrder.customerName'), key: 'customerName' },
  { title: t('menu.repairOrder.licensePlate'), key: 'licensePlate' },
  { title: t('menu.repairOrder.status'), key: 'status' },
  {
    title: t('common.action'),
    key: 'actions',
    render: (row: Api.RepairOrder.RepairOrderInfo) => {
      return h(NSpace, {}, () => [
        h(
          NButton,
          {
            type: 'primary',
            size: 'small',
            onClick: () => handleEdit(row)
          },
          { default: () => t('common.edit') }
        ),
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            onClick: () => handleDelete(row)
          },
          { default: () => t('common.delete') }
        )
      ]);
    }
  }
];

const { loading, data: dataList, pagination, getData } = useTable({
  apiFn: fetchRepairOrderList,
  columns: () => columns,
  immediate: true
});

async function handleDelete(row: Api.RepairOrder.RepairOrderInfo) {
  try {
    await window.$dialog?.warning({
      title: t('common.warning'),
      content: t('common.confirmDelete'),
      positiveText: t('common.confirm'),
      negativeText: t('common.cancel')
    });
    await fetchDeleteRepairOrder(row._id);
    window.$message?.success(t('common.deleteSuccess'));
    getData();
  } catch {}
}

function handleSearch() {
  getData();
}

function handleReset() {
  Object.assign(searchForm, {
    orderNo: '',
    customerName: ''
  });
  getData();
}
</script>

<template>
  <div class="h-full">
    <NCard :title="t('menu.repairOrder.list')" class="h-full">
      <div class="mb-16px">
        <NSpace>
          <NInput v-model:value="searchForm.orderNo" :placeholder="t('menu.repairOrder.orderNoSearch')" />
          <NInput v-model:value="searchForm.customerName" :placeholder="t('menu.repairOrder.customerNameSearch')" />
          <NButton type="primary" @click="handleSearch">{{ t('common.search') }}</NButton>
          <NButton @click="handleReset">{{ t('common.reset') }}</NButton>
          <NButton type="primary" @click="handleAdd">{{ t('common.add') }}</NButton>
        </NSpace>
      </div>
      <NDataTable
        :loading="loading"
        :columns="tableColumns"
        :data="dataList"
        :pagination="pagination"
        @update:page="getData"
      />
    </NCard>
  </div>
</template>
```

## 注意事项

1. 运行 `pnpm gen-route` 生成路由配置
2. 确保所有的国际化文本都有对应的中英文翻译
3. API 接口需要在 `typings` 目录下定义对应的类型
4. 组件命名要符合规范，文件路径要与路由配置匹配
5. 模块的图标使用 [Iconify](https://icon-sets.iconify.design/) 图标集
6. 路由配置中的 component 需要使用正确的前缀:
   - 'layout.base' - 基础布局
   - 'view.xxx' - 页面组件
7. 确保在 `src/router/modules/index.ts` 中导出新增的路由模块
