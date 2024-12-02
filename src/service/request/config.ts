/** 获取服务环境配置 */
export function getServiceEnvConfig(): App.Service.ServiceConfig {
  const { VITE_SERVICE_BASE_URL = '', VITE_HTTP_PROXY } = import.meta.env;

  const isHttpProxy = VITE_HTTP_PROXY === 'Y';

  return {
    baseURL: VITE_SERVICE_BASE_URL,
    // 如果需要代理，可以配置代理地址
    proxyPattern: isHttpProxy ? '/proxy-pattern' : '',
    other: [
      {
        key: 'demo',
        baseURL: 'http://localhost:3000/api',
        proxyPattern: isHttpProxy ? '/proxy-pattern-demo' : ''
      }
    ]
  };
} 