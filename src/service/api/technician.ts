import { request } from '../request'
import type { ApiResponse, PageResult } from '@/typings/common'

/** 获取技师列表 */
export function getTechnicianList(params: Api.Technician.SearchParams) {
  return request<ApiResponse<PageResult<Api.Technician.TechnicianInfo>>>({
    url: '/technician',
    method: 'get',
    params
  })
}

/** 创建技师 */
export function createTechnician(data: Api.Technician.CreateParams) {
  return request<ApiResponse<Api.Technician.TechnicianInfo>>({
    url: '/technician',
    method: 'post',
    data
  })
}

/** 更新技师 */
export function updateTechnician(id: string, data: Api.Technician.UpdateParams) {
  return request<ApiResponse<Api.Technician.TechnicianInfo>>({
    url: `/technician/${id}`,
    method: 'put',
    data
  })
}

/** 更新技师状态 */
export function updateTechnicianStatus(id: string, data: Api.Technician.UpdateStatusParams) {
  return request<ApiResponse<Api.Technician.TechnicianInfo>>({
    url: `/technician/${id}/status`,
    method: 'patch',
    data
  })
}

/** 删除技师 */
export function deleteTechnician(id: string) {
  return request<ApiResponse<void>>({
    url: `/technician/${id}`,
    method: 'delete'
  })
}

/** 根据用户ID获取技师信息 */
export function getTechnicianByUserId(userId: string) {
  return request<ApiResponse<Api.Technician.TechnicianInfo>>({
    url: `/technician/user/${userId}`,
    method: 'get'
  })
}

/** 获取技师详情 */
export function getTechnicianById(id: string) {
  return request<ApiResponse<Api.Technician.TechnicianInfo>>({
    url: `/technician/${id}`,
    method: 'get'
  })
}