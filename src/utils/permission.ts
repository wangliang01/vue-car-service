import { useAuthStore } from '@/store/modules/auth';

/**
 * 检查用户是否有指定权限
 * @param permission 权限标识
 */
export function hasPermission(permission: string | string[]): boolean {
  const authStore = useAuthStore();

  // 如果用户未登录，直接返回false
  if (!authStore.isLogin) {
    return false;
  }

  // 如果是管理员，直接返回true
  if (authStore.userInfo.isAdmin) {
    return true;
  }

  const userPermissions = authStore.userInfo.permissions || [];

  // 如果是字符串，直接判断
  if (typeof permission === 'string') {
    return userPermissions.includes(permission);
  }

  // 如果是数组，判断是否包含任意一个权限
  return permission.some(p => userPermissions.includes(p));
}

/**
 * 检查用户是否有指定权限中的任意一个
 * @param permissions 权限标识数组
 */
export function hasAnyPermission(permissions: string[]): boolean {
  const authStore = useAuthStore();

  // 如果用户未登录，直接返回false
  if (!authStore.isLogin) {
    return false;
  }

  // 如果是管理员，直接返回true
  if (authStore.userInfo.isAdmin) {
    return true;
  }

  const userPermissions = authStore.userInfo.permissions || [];
  return permissions.some(permission => userPermissions.includes(permission));
}

/**
 * 过滤路由配置
 * @param routes 路由配置
 */
export function filterAsyncRoutes(routes: any[]) {
  const res: any[] = [];
  const authStore = useAuthStore();

  // 如果用户未登录，返回空数组
  if (!authStore.isLogin) {
    return res;
  }

  // 如果是管理员，返回所有路由
  if (authStore.userInfo.isAdmin) {
    return routes;
  }

  routes.forEach(route => {
    const tmp = { ...route };

    // 如果路由没有配置permissions，或者用户有权限，则保留该路由
    const hasPermissionFlag = !tmp.meta?.permissions || hasPermission(tmp.meta.permissions);

    if (hasPermissionFlag) {
      if (tmp.children) {
        const childrenRoutes = filterAsyncRoutes(tmp.children);
        if (childrenRoutes.length > 0) {
          tmp.children = childrenRoutes;
          res.push(tmp);
        } else if (tmp.component) {
          // 如果没有可访问的子路由，但是当前路由有组件，也要保留
          tmp.children = [];
          res.push(tmp);
        }
      } else {
        res.push(tmp);
      }
    }
  });

  return res;
}

/**
 * 检查路由是否有权限访问
 * @param route 路由对象
 */
export function checkRoutePermission(route: any): boolean {
  if (!route.meta?.permissions) {
    return true;
  }
  return hasPermission(route.meta.permissions);
}
