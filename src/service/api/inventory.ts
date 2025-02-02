import { request } from '../request';

/** 获取库存列表 */
export function getInventoryList(params: Api.Inventory.SearchParams) {
  return request<Api.Inventory.SearchResult>({
    url: '/inventory',
    method: 'get',
    params
  });
}

/** 获取库存详情 */
export function getInventoryDetail(id: string) {
  return request<Api.Inventory.InventoryItem>({
    url: `/inventory/${id}`,
    method: 'get'
  });
}

/** 创建库存记录 */
export function createInventory(data: Api.Inventory.CreateInventoryParams) {
  return request<Api.Inventory.InventoryItem>({
    url: '/inventory',
    method: 'post',
    data
  });
}

/** 调整库存 */
export function adjustInventory(id: string, data: Api.Inventory.UpdateInventoryParams) {
  return request<Api.Inventory.InventoryItem>({
    url: `/inventory/${id}/adjust`,
    method: 'put',
    data
  });
}

/** 获取库存预警列表 */
export function getLowStockList() {
  return request<Api.Inventory.InventoryItem[]>({
    url: '/inventory/low-stock',
    method: 'get'
  });
}
