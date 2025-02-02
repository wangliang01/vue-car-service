import { request } from '../request';

/** 获取材料列表 */
export function fetchMaterialList(params: Api.Material.SearchParams) {
  return request<Api.Common.PageResult<Api.Material.MaterialInfo>>({
    url: '/material',
    method: 'get',
    params
  });
}

/** 创建材料 */
export function createMaterial(data: Api.Material.CreateParams) {
  return request({
    url: '/material',
    method: 'post',
    data
  });
}

/** 更新材料 */
export function updateMaterial(id: string, data: Api.Material.UpdateParams) {
  return request({
    url: `/material/${id}`,
    method: 'put',
    data
  });
}

/** 更新材料状态 */
export function updateMaterialStatus(id: string, data: { isActive: boolean }) {
  return request({
    url: `/material/${id}/status`,
    method: 'patch',
    data
  });
}

/** 删除材料 */
export function deleteMaterial(id: string) {
  return request({
    url: `/material/${id}`,
    method: 'delete'
  });
}

/** 获取材料详情 */
export function fetchMaterialDetail(id: string) {
  return request<Api.Material.MaterialInfo>({
    url: `/material/${id}`,
    method: 'get'
  });
}
