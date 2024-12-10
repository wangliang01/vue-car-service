import { request } from '../request';

/** 获取车辆列表 */
export function fetchVehicleList(params: Api.Vehicle.VehicleSearchParams) {
  return request({
    url: '/vehicle/page',
    method: 'get',
    params
  });
}

/** 创建车辆 */
export function fetchCreateVehicle(vehicle: Api.Vehicle.VehicleInfo) {
  return request({
    url: '/vehicle',
    method: 'post',
    data: vehicle
  });
}

/** 更新车辆 */
export function fetchUpdateVehicle(id: string, vehicle: Partial<Api.Vehicle.VehicleInfo>) {
  return request({
    url: `/vehicle/${id}`,
    method: 'put',
    data: vehicle
  });
}

/** 删除车辆 */
export function fetchDeleteVehicle(id: string) {
  return request({
    url: `/vehicle/${id}`,
    method: 'delete'
  });
}

/** 批量删除车辆 */
export function fetchDeleteVehicleBatch( ids: string[] ) {
  return request({
    url: '/vehicle/batch-delete',
    method: 'post',
    data: ids
  });
}

/** 导出车辆数据 */
export function fetchExportVehicle(params: Api.Vehicle.VehicleSearchParams) {
  return request({
    url: '/vehicle/export',
    method: 'get',
    data: params,
    responseType: 'blob',
  });
}

/** 获取车辆品牌列表 */
export function fetchVehicleBrands() {
  return request({
    url: '/vehicle/brands',
    method: 'get'
  });
}

/** 获取车型列表 */
export function fetchVehicleModels(brand: string) {
  return request({
    url: '/vehicle/models',
    method: 'get',
    params: { brand }
  });
}

/** 批量导入车辆 */
export function fetchBatchImportVehicles(vehicles: Api.Vehicle.VehicleInfo[]) {
  return request({
    url: '/vehicle/batch-import',
    method: 'post',
    data: vehicles
  });
}

/** 更新车辆里程数 */
export function fetchUpdateVehicleMileage(id: string, mileage: number) {
  return request({
    url: `/vehicle/${id}/mileage`,
    method: 'patch',
    data: { mileage }
  });
}

/** 根据车牌号查询车辆信息 */
export function fetchVehicleByPlate(licensePlate: string) {
  return request<Api.Vehicle.VehicleInfo>({
    url: '/vehicle/by-plate',
    method: 'get',
    params: { licensePlate }
  });
}
