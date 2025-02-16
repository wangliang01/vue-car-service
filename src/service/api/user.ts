import { request } from '../request';
import type { PageResult, BaseResponse } from '@/typings/api';

export interface UserInfo {
  _id: string;
  id: string;
  username: string;
  name: string;
  phone: string;
  email: string;
  isAdmin: boolean;
  roles: { _id: string; name: string }[];
  createdAt: string;
}

export interface UserSearchParams {
  page: number;
  limit: number;
  username?: string;
  name?: string;
  phone?: string;
  email?: string;
}

export interface UserForm {
  username?: string;
  password?: string;
  name: string;
  phone: string;
  email: string;
  type: 'admin' | 'user';
}

// 获取用户列表
export function getUserList(params: UserSearchParams) {
  return request<BaseResponse<PageResult<UserInfo>>>({
    url: '/user/list',
    method: 'get',
    params
  });
}

// 搜索用户
export function searchUsers(params: { keyword: string }) {
  return request<BaseResponse<PageResult<UserInfo>>>({
    url: '/user/search',
    method: 'get',
    params
  });
}

// 创建用户
export function createUser(data: UserForm) {
  return request<BaseResponse<UserInfo>>({
    url: '/user/register',
    method: 'post',
    data
  });
}

// 更新用户
export function updateUser(id: string, data: UserForm) {
  return request<BaseResponse<UserInfo>>({
    url: `/user/${id}`,
    method: 'put',
    data
  });
}

// 删除用户
export function deleteUser(id: string) {
  return request<BaseResponse<null>>({
    url: `/user/${id}`,
    method: 'delete'
  });
}

// 分配角色
export function assignRoles(userId: string, roleIds: string[]) {
  return request<BaseResponse<null>>({
    url: `/user/${userId}/roles`,
    method: 'post',
    data: { roleIds }
  });
}

// 获取用户角色
export function getUserRoles(userId: string) {
  return request<BaseResponse<{ list: Array<{ _id: string; name: string }> }>>({
    url: `/user/${userId}/roles`,
    method: 'get'
  });
}

// 更新用户角色
export function updateUserRoles(userId: string, roleIds: string[]) {
  return request<BaseResponse<null>>({
    url: `/user/${userId}/roles`,
    method: 'put',
    data: { roleIds }
  });
}
