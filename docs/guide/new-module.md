# 新模块开发指南

本文档将指导你如何在系统中创建一个新的功能模块。我们以用户管理模块为例进行说明。

## 1. 目录结构

一个完整的功能模块通常包含以下文件:

```bash
src/
├── locales/                 # 国际化配置
│   ├── langs                 # 语言包
│   │   └── zh-cn.ts          # 中文
│   │   └── en-us.ts          # 英文
├── service/
│   └── api/
│       └── user.ts         # API 接口定义
├── views/
│   └── system/
│       └── user/          # 用户管理模块
│           ├── index.vue  # 主视图组件
│           └── modules/   # 子组件
│               ├── search.vue   # 搜索组件
│               ├── form.vue     # 表单组件
│               └── link-role.vue # 关联角色组件
└── typings/
    └── api.d.ts          # API 类型定义
```

## 2. 国际化配置

在 `src/locales/langs/zh-cn.ts` 中定义中文配置:
```typescript
{
  system: {
    user: {
      title: '用户管理',
      username: '用户名',
      password: '密码',
      name: '姓名',
      phone: '手机号',
      email: '邮箱',
      type: '用户类型',
      roles: '关联角色',  
      typeAdmin: '管理员',
      typeTechnician: '维修技师',
      typeUser: '普通用户',
      usernamePlaceholder: '请输入用户名',
      passwordPlaceholder: '请输入密码',
      namePlaceholder: '请输入姓名',
      phonePlaceholder: '请输入手机号',
      emailPlaceholder: '请输入邮箱',
      typePlaceholder: '请选择用户类型',
      usernameRequired: '请输入用户名',
      passwordRequired: '请输入密码',
      nameRequired: '请输入姓名',
      phoneRequired: '请输入手机号',
      emailRequired: '请输入邮箱',
      typeRequired: '请选择用户类型',
      linkRole: {
        title: '关联角色',
        action: '关联角色'
      }
    }
  },
  route: {
      system_user: '用户管理',
  }
}
```


## 3. API的类型定义

在 `src/typings/api.d.ts` 中定义接口类型:

```typescript
namespace Api {
  namespace User {
    interface UserInfo {
      _id: string;
      username: string;
      name: string;
      phone: string;
      email: string;
      isAdmin: boolean;
      roles?: Array<{
        _id: string;
        name: string;
      }>;
      createdAt: string;
      updatedAt: string;
    }

    interface SearchParams extends Common.PaginationParams {
      username?: string;
      name?: string;
      phone?: string;
      email?: string;
    }

    interface CreateParams {
      username: string;
      password: string;
      name: string;
      phone: string;
      email: string;
      type: 'admin' | 'user';
    }

    interface UpdateParams extends Omit<Partial<CreateParams>, 'password'> {}
  }
}
```

## 4. API 接口定义

在 `src/service/api/user.ts` 中定义API方法:

```typescript
import { request } from '../request';
import type { ApiResponse, PageResult } from '@/typings/api';

// 获取用户列表
export function getUserList(params: Api.User.SearchParams) {
  return request<ApiResponse<PageResult<Api.User.UserInfo>>>('/users', { params });
}

// 创建用户
export function createUser(data: Api.User.CreateParams) {
  return request<ApiResponse<Api.User.UserInfo>>({
    url: '/users',
    method: 'post',
    data
  });
}

// 更新用户
export function updateUser(id: string, data: Api.User.UpdateParams) {
  return request<ApiResponse<Api.User.UserInfo>>({
    url: `/users/${id}`,
    method: 'put',
    data
  });
}

// 删除用户
export function deleteUser(id: string) {
  return request<ApiResponse<void>>({
    url: `/users/${id}`,
    method: 'delete'
  });
}
```

## 5. 视图组件开发

### 5.1 主视图组件 (index.vue)

主视图组件是模块的入口，包含以下主要部分:

```vue
<template>
  <div>
    <Search
      v-model:model="searchModel"
      @search="handleSearch"
      @reset="handleReset"
    />

    <NCard>
      <template #header>
        <NSpace justify="space-between">
          <span>{{ t('system.user.title') }}</span>
          <NButton type="primary" @click="handleAdd">
            <template #icon>
              <div class="i-material-symbols:add" />
            </template>
            {{ t('common.add') }}
          </NButton>
        </NSpace>
      </template>

      <NDataTable
        :loading="loading"
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </NCard>

    <Form
      ref="formRef"
      v-model:show="showForm"
      :loading="formLoading"
      :is-edit="!!currentId"
      :edit-data="editData"
      @submit="handleFormSubmit"
    />

    <LinkRole
      v-model:show="showLinkRole"
      :loading="linkRoleLoading"
      :user-id="currentUserId"
      :username="currentUsername"
      :linked-role-ids="linkedRoleIds"
      @submit="handleLinkRoleSubmit"
    />
  </div>
</template>
```
### 5.2 搜索组件 (search.vue)

搜索组件负责条件筛选:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NCollapse, NCollapseItem, NForm, NGrid, NFormItemGi, NInput, NSpace, NButton } from 'naive-ui';

defineOptions({ name: 'UserSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();
const { t } = useI18n();
const loading = ref(false);

const model = defineModel<{
  username?: string;
  name?: string;
  phone?: string;
  email?: string;
}>('model', { 
  default: () => ({
    username: '',
    name: '',
    phone: '',
    email: ''
  })
});

// 搜索
async function handleSearch() {
  loading.value = true;
  try {
    emit('search');
  } finally {
    loading.value = false;
  }
}

// 重置
function handleReset() {
  model.value = {
    username: '',
    name: '',
    phone: '',
    email: ''
  };
  emit('reset');
}
</script>

<template>
  <NCard class="search-wrapper">
    <NCollapse :default-expanded-names="['1']">
      <NCollapseItem name="1">
        <template #header>
          <NSpace align="center">
            <span>{{ t('common.search') }}</span>
          </NSpace>
        </template>
        
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid :cols="24" :x-gap="24">
            <NFormItemGi :span="6" :label="t('system.user.username')">
              <NInput v-model:value="model.username" clearable
              :placeholder="t('system.user.usernamePlaceholder')" />
            </NFormItemGi>
            
            <NFormItemGi :span="6" :label="t('system.user.name')">
              <NInput v-model:value="model.name" clearable
              :placeholder="t('system.user.namePlaceholder')" />
            </NFormItemGi>
            
            <NFormItemGi :span="6" :label="t('system.user.phone')">
              <NInput v-model:value="model.phone" clearable
              :placeholder="t('system.user.phonePlaceholder')" />
            </NFormItemGi>
            
            <NFormItemGi :span="6" :label="t('system.user.email')">
              <NInput v-model:value="model.email" clearable
              :placeholder="t('system.user.emailPlaceholder')" />
            </NFormItemGi>

            <NFormItemGi :span="24">
              <NSpace class="w-full" justify="end">
                <NButton :loading="loading" @click="handleReset">
                  <template #icon>
                    <div class="i-material-symbols:refresh" />
                  </template>
                  {{ t('common.reset') }}
                </NButton>
                <NButton 
                  type="primary" 
                  :loading="loading" 
                  @click="handleSearch"
                >
                  <template #icon>
                    <div class="i-material-symbols:search" />
                  </template>
                  {{ t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped>
.search-wrapper {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
}

/* 使用CSS变量优化主题适配 */
:root {
  --search-wrapper-bg: #fff;
  --search-wrapper-shadow: rgba(0, 0, 0, 0.06);
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  :root {
    --search-wrapper-bg: #18181c;
    --search-wrapper-shadow: rgba(0, 0, 0, 0.12);
  }
}
</style> 
```
### 5.3 表单组件 (form.vue)

表单组件用于新增和编辑操作:

```vue
<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NSpace, NButton, NSelect } from 'naive-ui';
import type { FormInst } from 'naive-ui';
import type { UserForm } from '@/service/api/user';

defineOptions({ name: 'UserForm' });

interface Props {
  loading?: boolean;
  isEdit?: boolean;
  editData?: UserForm | null;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  isEdit: false,
  editData: null
});

interface Emits {
  (e: 'update:show', value: boolean): void;
  (e: 'submit', data: UserForm): void;
}

const emit = defineEmits<Emits>();
const { t } = useI18n();
const formRef = ref<FormInst | null>(null);

const show = defineModel<boolean>('show', {
  type: Boolean,
  default: false
});

const model = ref<UserForm>({
  username: '',
  password: '',
  name: '',
  phone: '',
  email: '',
  type: 'user'
});

// 用户类型选项, 管理员， 维修技师， 普通用户
const typeOptions = [
  { label: t('system.user.typeAdmin'), value: 'admin' },
  { label: t('system.user.typeUser'), value: 'user' }
];

const rules = {
  username: {
    required: true,
    message: t('system.user.usernameRequired'),
    trigger: ['blur', 'input']
  },
  password: {
    required: !props.isEdit,
    message: t('system.user.passwordRequired'),
    trigger: ['blur', 'input']
  },
  name: {
    required: true,
    message: t('system.user.nameRequired'),
    trigger: ['blur', 'input']
  },
  phone: {
    required: true,
    message: t('system.user.phoneRequired'),
    trigger: ['blur', 'input'],
    pattern: /^1[3-9]\d{9}$/
  },
  email: {
    required: false,
    message: t('system.user.emailRequired'),
    trigger: ['blur', 'input'],
    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  },
  type: {
    required: true,
    message: t('system.user.typeRequired'),
    trigger: ['blur', 'change']
  }
};

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    const submitData = { ...model.value, isAdmin: model.value.type === 'admin' };
    // 编辑时不提交密码字段, 删除type字段
    if (props.isEdit) {
      delete submitData.password;
      delete submitData.type;
    }
    emit('submit', submitData);
  } catch (err) {
    // 表单验证失败
  }
}

// 关闭抽屉
function handleClose() {
  emit('update:show', false);
}

// 重置表单
function resetForm() {
  model.value = {
    username: '',
    password: '',
    name: '',
    phone: '',
    email: '',
    type: 'user'
  };
  formRef.value?.restoreValidation();
}

// 监听编辑数据变化
watch(
  () => props.editData,
  (newData) => {
    if (newData) {
      model.value = { ...newData };

      console.log(model.value);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// 监听抽屉关闭
watch(
  () => show.value,
  (newVal) => {
    if (!newVal) {
      resetForm();
    }
  }
);


// 获取标题
const title = computed(() => {
  if (props.isEdit) {
    return t('common.edit') + ' - ' + model.value.username;
  }
  return t('common.add');
});

defineExpose({
  resetForm
});
</script>

<template>
  <NDrawer v-model:show="show" :width="500">
    <NDrawerContent 
      :title="title"
      :native-scrollbar="false"
    >
      <NForm
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        :label-width="100"
        require-mark-placement="right-hanging"
      >
        <NFormItem :label="t('system.user.username')" path="username">
          <NInput 
            v-model:value="model.username" 
            :placeholder="t('system.user.usernamePlaceholder')"
            :disabled="isEdit"
          />
        </NFormItem>

        <NFormItem 
          v-if="!isEdit"
          :label="t('system.user.password')" 
          path="password"
        >
          <NInput
            v-model:value="model.password"
            type="password"
            show-password-on="click"
            :placeholder="t('system.user.passwordPlaceholder')"
          />
        </NFormItem>

        <NFormItem :label="t('system.user.name')" path="name">
          <NInput 
            v-model:value="model.name" 
            :placeholder="t('system.user.namePlaceholder')"
          />
        </NFormItem>

        <NFormItem :label="t('system.user.phone')" path="phone">
          <NInput 
            v-model:value="model.phone" 
            :placeholder="t('system.user.phonePlaceholder')"
          />
        </NFormItem>

        <NFormItem :label="t('system.user.email')" path="email">
          <NInput 
            v-model:value="model.email" 
            :placeholder="t('system.user.emailPlaceholder')"
          />
        </NFormItem>

        <NFormItem :label="t('system.user.type')" path="type">
          <NSelect
            v-model:value="model.type"
            :options="typeOptions"
            :placeholder="t('system.user.typePlaceholder')"
          />
        </NFormItem>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="handleClose">
            {{ t('common.cancel') }}
          </NButton>
          <NButton 
            type="primary" 
            :loading="loading"
            @click="handleSubmit"
          >
            {{ t('common.confirm') }}
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template> 

```   
## 6. 开发规范

### 6.1 命名规范

- 文件名：使用kebab-case命名法
- 组件名：使用PascalCase命名法
- 变量名：使用camelCase命名法
- API接口：使用camelCase命名法

### 6.2 代码组织

1. **组件结构**
   - script setup放在最前面
   - template部分放在中间
   - style放在最后

2. **代码分组**
   ```typescript
   // 1. 类型导入
   import type { xxx } from 'xxx';
   
   // 2. 组件导入
   import { NButton } from 'naive-ui';
   
   // 3. API导入
   import { getUserList } from '@/service/api/user';
   
   // 4. 工具函数导入
   import { formatDate } from '@/utils';
   
   // 5. 组件选项
   defineOptions({ name: 'UserManagement' });
   
   // 6. 响应式数据定义
   const tableData = ref<UserInfo[]>([]);
   
   // 7. 计算属性
   const computedValue = computed(() => xxx);
   
   // 8. 方法定义
   function handleSearch() {
     // ...
   }
   ```

### 6.3 样式规范

1. **布局结构**
   - 使用n-card分隔不同区域
   - 合理使用间距(margin/padding)
   - 使用flex布局实现对齐

2. **样式类命名**
   ```scss
   .user-container {
     padding: 16px;
     
     .search-card {
       margin-bottom: 16px;
     }
     
     .list-card {
       .header {
         margin-bottom: 16px;
       }
     }
   }
   ```

## 7. 最佳实践

1. **类型安全**
   - 为所有数据定义类型
   - 使用TypeScript的类型推导
   - 避免使用any类型

2. **组件拆分**
   - 将复杂组件拆分为小组件
   - 使用props和emit通信
   - 保持单一职责原则

3. **性能优化**
   - 合理使用v-show和v-if
   - 大列表使用虚拟滚动
   - 避免不必要的计算

4. **错误处理**
   - 统一的错误处理机制
   - 友好的错误提示
   - 合理的loading状态

5. **国际化**
   - 使用i18n管理文本
   - 避免硬编码文本
   - 注意日期时间格式

6. **代码复用**
   - 抽取公共组件
   - 使用组合式API
   - 封装通用hooks
