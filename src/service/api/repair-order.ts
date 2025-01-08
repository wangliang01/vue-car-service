import { request } from '../request';

/** 获取维修工单列表 */
export function fetchRepairOrderList(params: Api.RepairOrder.SearchParams) {
  return request<Api.Common.PaginationResult<Api.RepairOrder.RepairOrderInfo>>({
    url: '/repair-order',
    method: 'get',
    params
  });
}

/** 创建维修工单 */
export function fetchCreateRepairOrder(data: Api.RepairOrder.CreateParams) {
  return request<Api.RepairOrder.RepairOrderInfo>({
    url: '/repair-order',
    method: 'post',
    data
  });
}

/** 更新工单状态 */
export function fetchUpdateRepairOrderStatus(id: string, data: Api.RepairOrder.StatusUpdateParams) {
  return request({
    url: `/repair-order/${id}/status`,
    method: 'patch',
    data
  });
}

/** 完工结算 */
export function fetchCompleteRepairOrder(id: string) {
  return request({
    url: `/repair-order/${id}/complete`,
    method: 'post'
  });
}

/** 获取工单详情 */
export function fetchRepairOrderDetail(id: string) {
  return request<Api.RepairOrder.RepairOrderInfo>({
    url: `/repair-order/${id}`,
    method: 'get'
  });
}

/** 根据车牌号查询车辆信息 */
export function fetchVehicleByPlate(licensePlate: string) {
  return request<Api.Vehicle.VehicleInfo>({
    url: '/repair-order/vehicle',
    method: 'get',
    params: { licensePlate }
  });
}

/** 更新维修工单 */
export function fetchUpdateRepairOrder(id: string, data: Api.RepairOrder.InspectionData) {
  return request<Api.RepairOrder.RepairOrderInfo>({
    url: `/repair-order/${id}`,
    method: 'put',
    data
  });
}

  /** 检查工单 */
export function checkRepairOrder(id: string, data: Api.RepairOrder.InspectionData) {
  return request({
    url: `/repair-order/${id}/check`,
    method: 'patch',
    data
  })
}

/** 维修工单 */
export function repairRepairOrder(id: string, data: Api.RepairOrder.RepairData) {
  return request<Api.RepairOrder.RepairOrderInfo>({
    url: `/repair-order/${id}/repair-items-and-status`,
    method: 'patch',
    data
  });
}
