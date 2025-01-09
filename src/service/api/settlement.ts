import { request } from '../request';

/** 获取结算单列表 */
export function fetchSettlementList(params: Api.Settlement.SearchParams) {
  return request<Api.Common.PaginationResult<Api.Settlement.SettlementInfo>>({
    url: '/settlement',
    method: 'get',
    params
  });
}

/** 创建结算单 */
export function createSettlement(data: Api.Settlement.CreateParams) {
  return request<Api.Settlement.SettlementInfo>({
    url: '/settlement',
    method: 'post',
    data
  });
}

/** 获取结算单详情 */
export function fetchSettlementDetail(id: string) {
  return request<Api.Settlement.SettlementInfo>({
    url: `/settlement/${id}`,
    method: 'get'
  });
}

/** 更新结算单状态 */
export function updateSettlementStatus(id: string, data: Api.Settlement.StatusUpdateParams) {
  return request<Api.Settlement.SettlementInfo>({
    url: `/settlement/${id}/status`,
    method: 'patch',
    data
  });
} 