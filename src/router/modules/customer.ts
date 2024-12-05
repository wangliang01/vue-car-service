import type { GeneratedRoute } from '@elegant-router/types';

const customer: GeneratedRoute = {
  name: 'customer',
  path: '/customer',
  component: 'layout.base',
  meta: {
    order: 3,
    requiresAuth: true,
    title: 'menu.customer',
    i18nKey: 'route.customer',
    i18nTitle: true,
    icon: 'material-symbols:person-outline',
  },
  children: [
    {
      name: 'customer_list',
      path: '/customer/list',
      component: 'view.customer_list',
      meta: {
        title: 'menu.customer.list',
        i18nKey: 'route.customer_list',
        i18nTitle: true,
        icon: 'material-symbols:group-outline',
        requiresAuth: true
      }
    }
  ]
};

export default customer;
