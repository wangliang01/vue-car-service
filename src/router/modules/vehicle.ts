import type { GeneratedRoute } from '@elegant-router/types';

const vehicle: GeneratedRoute = {
  name: 'vehicle',
  path: '/vehicle',
  component: 'layout.base',
  meta: {
    order: 3,
    requiresAuth: true,
    title: 'menu.vehicle',
    i18nKey: 'route.vehicle',
    i18nTitle: true,
    icon: 'material-symbols:directions-car',
  },
  children: [
    {
      name: 'vehicle_list',
      path: '/vehicle/list',
      component: 'view.vehicle_list',
      meta: {
        title: 'menu.vehicle.list',
        i18nKey: 'route.vehicle_list',
        i18nTitle: true,
        icon: 'material-symbols:directions-car-outline',
        requiresAuth: true
      }
    }
  ]
};

export default vehicle;