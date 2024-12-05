# 新增模块指南

本文档说明如何在 Soybean Admin 中新增一个完整的功能模块。以客户管理(customer)模块为例。

## 目录结构

```bash
src
├── router
│   ├── modules
│   │   ├── customer.ts     # 客户模块路由配置
│   │   └── index.ts        # 导出所有模块路由
├── service
│   └── api
│       └── customer.ts     # API接口定义
├── typings
│   └── api.d.ts           # API类型定义
├── views
│   └── customer           # 客户模块目录
│       └── list           # 列表页面
│           └── index.vue  # 页面组件
└── locales
    └── langs
        ├── en-us.ts       # 英文翻译
        └── zh-cn.ts       # 中文翻译
```

## 文件内容示例

### 1. 路由配置

```typescript:src/router/modules/customer.ts
import type { GeneratedRoute } from '@elegant-router/types';

const customer: GeneratedRoute = {
  name: 'customer',
  path: '/customer',
  component: 'layout.base',
  meta: {
    order: 2,
    requiresAuth: true,
    title: 'menu.customer',
    i18nKey: 'route.customer',
    i18nTitle: true,
    icon: 'material-symbols:person-outline',
  },
  children: [
    {
      name: 'customer_list',
      path: '/customer/list',
      component: 'view.customer_list',
      meta: {
        title: 'menu.customer.list',
        i18nKey: 'route.customer_list',
        i18nTitle: true,
        icon: 'material-symbols:group-outline',
        requiresAuth: true
      }
    }
  ]
};

export default customer;
```

### 2. 国际化配置

```typescript:src/locales/langs/zh-cn.ts
const local: App.I18n.Schema = {
  route: {
    customer: '客户管理',
    customer_list: '客户列表'
  },
  menu: {
    customer: {
      _value: '客户管理',
      list: '客户列表',
      name: '客户名称',
      phone: '手机号',
      email: '邮箱',
      address: '地址',
      createdAt: '创建时间',
      nameSearch: '请输入客户名称',
      phoneSearch: '请输入手机号'
    }
  }
};
```

### 3. API 接口

```typescript:src/service/api/customer.ts
import { request } from '../request';

/** 获取客户列表(分页) */
export function fetchCustomerList(params: Api.Common.PaginationParams) {
  return request.get<Api.Common.PaginationResult<Api.Customer.CustomerInfo>>('/customer', { params });
}

/** 删除客户 */
export function fetchDeleteCustomer(id: string) {
  return request.delete(`/customer/${id}`);
}

/** 创建客户 */
export function fetchCreateCustomer(params: Api.Customer.CreateCustomerParams) {
  return request.post<Api.Customer.CustomerInfo>('/customer', params);
}

/** 更新客户 */
export function fetchUpdateCustomer(id: string, params: Api.Customer.UpdateCustomerParams) {
  return request.put<Api.Customer.CustomerInfo>(`/customer/${id}`, params);
}
```

### 4. API 类型定义

```typescript:src/typings/api.d.ts
declare namespace Api {
  namespace Customer {
    interface CustomerInfo {
      _id: string;
      name: string;
      phone: string;
      email: string;
      address: string;
      createdAt: string;
    }

    interface CreateCustomerParams {
      name: string;
      phone: string;
      email: string;
      address: string;
    }

    interface UpdateCustomerParams extends Partial<CreateCustomerParams> {}
  }

  namespace Common {
    interface PaginationParams {
      page?: number;
      size?: number;
    }

    interface PaginationResult<T> {
      list: T[];
      total: number;
    }
  }
}
```

### 5. 视图组件

```vue:src/views/customer/list/index.vue
<script setup lang="ts">
import { reactive, h } from 'vue';
import { NButton, NSpace, NInput, NCard, NDataTable } from 'naive-ui';
import { useTable } from '@/hooks/common/table';
import { useI18n } from 'vue-i18n';
import { fetchCustomerList, fetchDeleteCustomer } from '@/service/api/customer';

defineOptions({ name: 'CustomerList' });

const { t } = useI18n();

const searchForm = reactive({
  name: '',
  phone: ''
});

const columns = [
  { type: 'selection' },
  { title: t('common.index'), key: 'index' },
  { title: t('menu.customer.name'), key: 'name' },
  { title: t('menu.customer.phone'), key: 'phone' },
  { title: t('menu.customer.email'), key: 'email' },
  { title: t('menu.customer.address'), key: 'address' },
  { title: t('menu.customer.createdAt'), key: 'createdAt' },
  {
    title: t('common.action'),
    key: 'actions',
    render: (row: Api.Customer.CustomerInfo) => {
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
  apiFn: fetchCustomerList,
  columns: () => columns,
  immediate: true
});

async function handleDelete(row: Api.Customer.CustomerInfo) {
  try {
    await window.$dialog?.warning({
      title: t('common.warning'),
      content: t('common.confirmDelete'),
      positiveText: t('common.confirm'),
      negativeText: t('common.cancel')
    });
    await fetchDeleteCustomer(row._id);
    window.$message?.success(t('common.deleteSuccess'));
    getData();
  } catch {}
}

function handleSearch() {
  getData();
}

function handleReset() {
  Object.assign(searchForm, {
    name: '',
    phone: ''
  });
  getData();
}
</script>

<template>
  <div class="h-full">
    <NCard :title="t('menu.customer.list')" class="h-full">
      <div class="mb-16px">
        <NSpace>
          <NInput v-model:value="searchForm.name" :placeholder="t('menu.customer.nameSearch')" />
          <NInput v-model:value="searchForm.phone" :placeholder="t('menu.customer.phoneSearch')" />
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
