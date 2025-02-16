import { request } from '@/service/request';

// 获取首页统计数据
export function fetchDashboardStats() {
  return request({
    url: '/dashboard/stats',
    method: 'get'
  });
}

// 获取收入趋势数据
export function fetchIncomeTrend() {
  return request({
    url: '/dashboard/incomes/trend',
    method: 'get'
  });
}

// 获取收入分析数据
export function fetchIncomeAnalysis() {
  return request({
    url: '/dashboard/incomes/analysis',
    method: 'get'
  });
}

// 获取待办事项
export function fetchTodoList() {
  return request({
    url: '/dashboard/todo',
    method: 'get'
  });
}
