import type { AxiosResponse } from 'axios';
import { BACKEND_ERROR_CODE, createFlatRequest, createRequest } from '@sa/axios';
import { useAuthStore } from '@/store/modules/auth';
import { $t } from '@/locales';
import { localStg } from '@/utils/storage';
import { getServiceBaseURL } from '@/utils/service';
import { getAuthorization, handleExpiredRequest, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);


export const request = createFlatRequest<App.Service.Response, RequestInstanceState>(
  {
    baseURL,
    headers: {
      apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2'
    }
  },
  {
    async onRequest(config) {
      const Authorization = getAuthorization();
      Object.assign(config.headers, { Authorization });

      return config;
    },
    isBackendSuccess(response) {
      // 对于 blob 类型的响应直接返回 true
      if(response.config.responseType === 'blob') {
        return true;
      }
      // 检查 success 字段
      return response.data.success === true;
    },
    async onBackendFail(response) {
      // 如果后端返回了错误信息,直接显示
      if (response.data.message) {
        window.$message?.error(response.data.message);
      }
      return null;
    },
    transformBackendResponse(response) {
      // 如果是 blob 类型,直接返回数据
      if(response.config.responseType === 'blob') {
        return response.data;
      }
      return response.data.data;
    },
    onError(error) {
      // 如果是后端返回的错误信息
      if (error.response?.data?.message) {
        window.$message?.error(error.response.data.message);
        return;
      }

      // 其他网络错误等
      showErrorMsg(request.state, error.message);
    }
  }
);

export const demoRequest = createRequest<App.Service.DemoResponse>(
  {
    baseURL: otherBaseURL.demo
  },
  {
    async onRequest(config) {
      const { headers } = config;

      // set token
      const token = localStg.get('token');
      const Authorization = token ? `Bearer ${token}` : null;
      Object.assign(headers, { Authorization });

      return config;
    },
    isBackendSuccess(response) {
      // when the backend response code is "200", it means the request is success
      // you can change this logic by yourself
      return response.data.status === '200';
    },
    async onBackendFail(_response) {
      // when the backend response code is not "200", it means the request is fail
      // for example: the token is expired, refresh token and retry request
    },
    transformBackendResponse(response) {
      return response.data.result;
    },
    onError(error) {
      // when the request is fail, you can show error message

      let message = error.message;

      // show backend error message
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message;
      }

      window.$message?.error(message);
    }
  }
);
