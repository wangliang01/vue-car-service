import { request } from '../request';
import type { PageResult, BaseResponse } from '@/typings/api';

export interface RoleInfo {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 'enable' | 'disable';
  createTime?: string;
  updateTime?: string;
}

export interface RoleSearchParams {
  page: number;
  limit: number;
  name?: string;
  code?: string;
  status?: string;
}

export interface RoleForm {
  name: string;
  code: string;
  description?: string;
  status: 'enable' | 'disable';
}

// 获取角色列表
export function getRoleList(params: RoleSearchParams) {
  return request<BaseResponse<PageResult<RoleInfo>>>({
    url: '/role/list',
    method: 'get',
    params
  });
}

// 创建角色
export function createRole(data: RoleForm) {
  return request<BaseResponse<RoleInfo>>({
    url: '/role',
    method: 'post',
    data
  });
}

// 更新角色
export function updateRole(id: string, data: RoleForm) {
  return request<BaseResponse<RoleInfo>>({
    url: `/role/${id}`,
    method: 'put',
    data
  });
}

// 删除角色
export function deleteRole(id: string) {
  return request<BaseResponse<null>>({
    url: `/role/${id}`,
    method: 'delete'
  });
}

// 获取角色的权限
export function getRolePermissions(roleId: string) {
  return request<BaseResponse<string[]>>({
    url: `/role/${roleId}/permissions`,
    method: 'get'
  });
}

// 分配权限
export function assignPermissions(roleId: string, permissionIds: string[]) {
  return request<BaseResponse<null>>({
    url: `/role/${roleId}/permissions`,
    method: 'post',
    data: { permissionIds }
  });
} 