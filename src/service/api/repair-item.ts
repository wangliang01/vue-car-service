import { request } from '../request';

/** 获取维修项目列表 */
export function fetchRepairItemList(params: Api.RepairItem.SearchParams) {
  return request<Api.Common.PaginationResult<Api.RepairItem.RepairItemInfo>>({
    url: '/repair-item',
    method: 'get',
    params
  });
}

/** 创建维修项目 */
export function createRepairItem(data: Api.RepairItem.CreateParams) {
  return request({
    url: '/repair-item',
    method: 'post',
    data
  });
}

/** 更新维修项目 */
export function updateRepairItem(id: string, data: Api.RepairItem.UpdateParams) {
  return request({
    url: `/repair-item/${id}`,
    method: 'put',
    data
  });
}

/** 更新维修项目状态 */
export function updateRepairItemStatus(id: string, data: { isActive: boolean }) {
  return request({
    url: `/repair-item/${id}/status`,
    method: 'patch',
    data
  });
}

/** 删除维修项目 */
export function deleteRepairItem(id: string) {
  return request({
    url: `/repair-item/${id}`,
    method: 'delete'
  });
}
