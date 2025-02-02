import type { AxiosError } from 'axios';
import type { Response } from './index';

/** 处理请求成功结果 */
export function handleServiceResult<T = any>(response: Response<T>) {
  const { data } = response;
  return data;
}

/** 处理后端返回的错误 */
export function handleBackendError(response: Response) {
  const { message } = response;
  window.$message?.error(message);
  return Promise.reject(response);
}

/** 处理axios请求失败 */
export function handleAxiosError(error: AxiosError) {
  const { message } = error;
  window.$message?.error(message);
  return Promise.reject(error);
}
