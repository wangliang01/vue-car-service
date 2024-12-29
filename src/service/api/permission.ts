import { request } from '../request';

/** 获取权限树 */
export function fetchPermissionTree() {
  return request<Api.Permission.PermissionInfo[]>({
    url: '/permission/tree',
    method: 'get'
  });
}

/** 创建权限 */
export function fetchCreatePermission(params: Api.Permission.CreatePermissionParams) {
  return request<Api.Permission.PermissionInfo>({
    url: '/permission',
    method: 'post',
    data: params
  });
}

/** 更新权限 */
export function fetchUpdatePermission(id: string, params: Api.Permission.UpdatePermissionParams) {
  return request<Api.Permission.PermissionInfo>({
    url: `/permission/${id}`,
    method: 'put',
    data: params
  });
}

/** 删除权限 */
export function fetchDeletePermission(id: string) {
  return request({
    url: `/permission/${id}`,
    method: 'delete'
  });
} 