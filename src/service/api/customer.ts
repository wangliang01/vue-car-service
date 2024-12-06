import { request } from '../request';

/** 创建客户 */
export function fetchCreateCustomer(params: Api.Customer.CreateCustomerParams) {
  return request<Api.Customer.CustomerInfo>({
    url: '/customer',
    method: 'post',
    data: params
  });
}

/** 获取客户列表(分页) */
export function fetchCustomerList(params: Api.Common.CommonSearchParams) {
  return request<Api.Common.PaginatingQueryRecord<Api.Customer.CustomerInfo>>({
    url: '/customer/page',
    method: 'get',
    params
  });
}

/** 获取客户列表(不分页) */
export function fetchCustomers() {
  return request<Api.Customer.CustomerInfo[]>({
    url: '/customer',
    method: 'get'
  });
}

/** 获取客户详情 */
export function fetchCustomerDetail(id: string) {
  return request<Api.Customer.CustomerInfo>({
    url: `/customer/${id}`,
    method: 'get'
  });
}

/** 更新客户 */
export function fetchUpdateCustomer(id: string, params: Api.Customer.UpdateCustomerParams) {
  return request<Api.Customer.CustomerInfo>({
    url: `/customer/${id}`,
    method: 'put',
    data: params
  });
}

/** 删除客户 */
export function fetchDeleteCustomer(id: string) {
  return request({
    url: `/customer/${id}`,
    method: 'delete'
  });
}

/** 获取客户统计信息 */
export function fetchCustomerStats() {
  return request<Api.Customer.CustomerStats>({
    url: '/customer/stats'
  });
}

/** 批量导入客户 */
export function fetchBatchImportCustomers(params: Api.Customer.BatchImportParams) {
  return request<Api.Customer.CustomerInfo[]>({
    url: '/customer/batch-import',
    method: 'post',
    data: params
  });
}

/** 导出客户数据 */
export function fetchExportCustomer(params: Api.Customer.CustomerInfo) {
  return request({
    url: '/customer/export',
    method: 'get',
    params,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
