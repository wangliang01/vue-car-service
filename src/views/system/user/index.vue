<script setup lang="ts">
import { h, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NDataTable, NSpace, NButton, NPopconfirm, useMessage, NTag } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { getUserList, createUser, updateUser, deleteUser, getUserRoles, updateUserRoles } from '@/service/api/user';
import type { UserInfo, UserForm } from '@/service/api/user';
import Search from './modules/search.vue';
import Form from './modules/form.vue';
import LinkRole from './modules/link-role.vue';
import { formatDate } from '@/utils/common';
import { useTable } from '@/hooks/common/table';
defineOptions({ name: 'UserManagement' });

const { t } = useI18n();
const message = useMessage();

// 关联角色控制
const showLinkRole = ref(false);
const linkRoleLoading = ref(false);
const currentUserId = ref<string>();
const currentUsername = ref('');
const linkedRoleIds = ref<string[]>([]);



// 表单控制
const showForm = ref(false);
const formRef = ref();
const currentId = ref<string>();
const formLoading = ref(false);
const editData = ref<UserForm | null>(null);

// 表格列定义
const getColumns = () => [
  {
    title: t('system.user.username'),
    key: 'username'
  },
  {
    title: t('system.user.name'),
    key: 'name'
  },
  {
    title: t('system.user.phone'),
    key: 'phone'
  },
  {
    title: t('system.user.email'),
    key: 'email'
  },
  {
    title: t('system.user.type'),
    key: 'type',
    render(row) {
      // 管理员，普通用户
      const tag = row.isAdmin === true ? t('system.user.typeAdmin') : t('system.user.typeUser');
      return h(NTag, {
        type: row.isAdmin === true ? 'success' : 'info',
        size: 'small'
      }, { default: () => tag });
    }
  },
  {
    title: t('system.user.roles'),
    key: 'roles',
    render(row) {
      if (row.isAdmin === true) {
        return '-';
      }
      if (!row.roles?.length) {
        return '暂无角色';
      }
      return h(
        NSpace,
        { size: 4 },
        {
          default: () =>
            row.roles.map((role) =>
              h(
                NTag,
                { type: 'warning', size: 'small' },
                { default: () => role.name }
              )
            )
        }
      );
    }
  },
  {
    title: t('common.createTime'),
    key: 'createdAt',
    render(row) {
      return formatDate(row.createdAt);
    }
  },
  {
    title: t('common.operation'),
    key: 'actions',
    render(row) {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                onClick: () => handleEdit(row)
              },
              { default: () => t('common.edit') }
            ),
            ...(!row.isAdmin ? [
              h(
                NButton,
                {
                  size: 'small',
                  type: 'info',
                  ghost: true,
                  onClick: () => handleLinkRole(row)
                },
                { default: () => t('system.user.linkRole.action') }
              )
            ] : []),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDelete(row)
              },
              {
                default: () => t('common.confirmDelete'),
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: 'small',
                      type: 'error',
                      ghost: true
                    },
                    { default: () => t('common.delete') }
                  )
              }
            )
          ]
        }
      );
    }
  }
];

const {
  loading,
  data: dataList,
  pagination,
  getData,
  searchParams: searchModel,
  columns: tableColumns,
  updateSearchParams,
  resetSearchParams
} = useTable({
  apiFn: getUserList as any,
  columns: () => getColumns() as any,
  apiParams: {
    current: 1,
    size: 10,
    username: '',
    name: '',
    phone: '',
    email: ''
  },
  immediate: true,
  showTotal: true
});


// 处理搜索
function handleSearch() {
  updateSearchParams(searchModel);
  getData();
}

// 处理重置
function handleReset() {
  resetSearchParams();
  getData();
}


// 新增用户
function handleAdd() {
  currentId.value = undefined;
  editData.value = null;
  showForm.value = true;
}

// 编辑用户
function handleEdit(row: UserInfo) {
  currentId.value = row._id;
  editData.value = {
    username: row.username,
    name: row.name,
    phone: row.phone,
    email: row.email,
    type: row.isAdmin ? 'admin' : 'user'
  };
  showForm.value = true;
}

// 删除用户
async function handleDelete(row: UserInfo) {
  await deleteUser(row.id);
  message.success(t('common.deleteSuccess'));
  if (dataList.value.length === 1 && pagination.page > 1) {
    pagination.page -= 1;
  }
  getData();

}

// 处理表单提交
async function handleFormSubmit(data: UserForm) {
  formLoading.value = true;
  try {
    if (currentId.value) {
      const { password, ...updateData } = data;
      await updateUser(currentId.value, updateData);
      message.success(t('common.updateSuccess'));
    } else {
      await createUser(data);
      message.success(t('common.createSuccess'));
    }
    showForm.value = false;
    getData();
  } catch (err) {
    message.error(currentId.value ? t('common.updateError') : t('common.createError'));
  } finally {
    formLoading.value = false;
  }
}

// 处理关联角色
async function handleLinkRole(row: UserInfo) {
  currentUserId.value = row._id;
  currentUsername.value = row.username;
  showLinkRole.value = true;

  try {
    const { data: roleData } = await getUserRoles(row._id);
    console.log('获取到的角色数据:', roleData);
    linkedRoleIds.value = roleData.map(item => item._id);
  } catch (err) {
    console.error('获取角色失败:', err);
    message.error(t('common.loadError'));
  }
}

// 处理关联角色提交
async function handleLinkRoleSubmit(roleIds: string[]) {
  if (!currentUserId.value) return;

  linkRoleLoading.value = true;
  try {
    await updateUserRoles(currentUserId.value, roleIds);
    message.success(t('common.updateSuccess'));
    showLinkRole.value = false;
    getData();
  } catch (err) {
    message.error(t('common.updateError'));
  } finally {
    linkRoleLoading.value = false;
  }
}

</script>

<template>
  <div>
    <Search v-model:model="searchModel" @search="handleSearch" @reset="handleReset" />

    <NCard>
      <template #header>
        <NSpace justify="space-between">
          <span>{{ t('system.user.title') }}</span>
          <NButton type="primary" @click="handleAdd" ghost>
            <template #icon>
              <div class="i-material-symbols:add" />
            </template>
            {{ t('common.add') }}
          </NButton>
        </NSpace>
      </template>

      <NDataTable :loading="loading" :columns="tableColumns" :data="dataList" :pagination="pagination" remote />
    </NCard>

    <Form ref="formRef" v-model:show="showForm" :loading="formLoading" :is-edit="!!currentId" :edit-data="editData"
      @submit="handleFormSubmit" />

    <LinkRole v-model:show="showLinkRole" :loading="linkRoleLoading" :user-id="currentUserId"
      :username="currentUsername" :linked-role-ids="linkedRoleIds" @submit="handleLinkRoleSubmit" />
  </div>
</template>
