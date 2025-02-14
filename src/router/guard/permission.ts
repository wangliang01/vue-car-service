import type { Router } from 'vue-router';
import { filterAsyncRoutes, hasPermission } from '@/utils/permission';
import { useAuthStore } from '@/store/modules/auth';
import { generatedRoutes } from '../elegant/routes';

export function createPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // 1. 常量路由直接放行（登录页、错误页等）
    if (to.meta?.constant) {
      next();
      return;
    }

    // 2. 没有token时重定向到登录页
    if (!authStore.token) {
      next(`/login?redirect=${to.path}`);
      return;
    }

    // 3. 如果没有用户信息，获取用户信息
    if (!authStore.userInfo.userId) {
      try {
        await authStore.initUserInfo();
      } catch (error) {
        authStore.resetStore();
        next(`/login?redirect=${to.path}`);
        return;
      }
    }

    // 4. 如果是管理员，直接放行
    if (authStore.userInfo.isAdmin) {
      next();
      return;
    }

    // 5. 检查路由权限
    // 如果路由没有配置permissions，允许访问
    if (!to.meta?.permissions) {
      next();
      return;
    }

    // 如果配置了permissions，检查是否有权限
    if (hasPermission(to.meta.permissions as string[])) {
      next();
    } else {
      next('/403');
    }
  });
}
