import { request } from '../request';
import type { BaseResponse } from '@/typings/api';

/** 获取门店列表(分页) */
export function fetchStoreList(params: Api.Store.SearchParams) {
  return request<Api.Common.PaginationResult<Api.Store.StoreInfo>>({
    url: '/store/page',
    method: 'get',
    params
  });
}

/** 创建门店 */
export function fetchCreateStore(data: Api.Store.CreateStoreParams) {
  return request<Api.Store.StoreInfo>({
    url: '/store',
    method: 'post',
    data
  });
}

/** 更新门店 */
export function fetchUpdateStore(id: string, data: Api.Store.UpdateStoreParams) {
  return request<Api.Store.StoreInfo>({
    url: `/store/${id}`,
    method: 'put',
    data
  });
}

/** 删除门店 */
export function fetchDeleteStore(id: string) {
  return request({
    url: `/store/${id}`,
    method: 'delete'
  });
}

/** 更新门店状态 */
export function fetchUpdateStoreStatus(id: string, status: string) {
  return request({
    url: `/store/${id}/status`,
    method: 'patch',
    data: { status }
  });
}

/** 批量更新门店状态 */
export function fetchBatchUpdateStoreStatus(ids: string[], status: string) {
  return request({
    url: '/store/batch-status',
    method: 'post',
    data: { ids, status }
  });
}

/** 导出门店数据 */
export function fetchExportStores() {
  return request({
    url: '/store/export',
    method: 'get',
    responseType: 'blob'
  });
}

/** 获取门店关联的用户列表 */
export function getStoreUsers(storeId: string) {
  return request<BaseResponse<string[]>>({
    url: `/store/${storeId}/users`,
    method: 'get'
  });
}

/** 更新门店关联的用户 */
export function updateStoreUsers(storeId: string, userIds: string[]) {
  return request<BaseResponse<null>>({
    url: `/store/${storeId}/users`,
    method: 'put',
    data: { userIds }
  });
} 