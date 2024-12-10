const repairOrder: GeneratedRoute = {
  name: 'repair-order',
  path: '/repair-order',
  component: 'layout.base',
  meta: {
    order: 3,
    requiresAuth: true,
    title: 'menu.repairOrder._value',
    i18nKey: 'route.repair-order',
    i18nTitle: true,
    icon: 'material-symbols:build-outline',
  },
  children: [
    {
      name: 'repair-order_list',
      path: '/repair-order/list',
      component: 'view.repair_order_list',
      meta: {
        title: 'menu.repairOrder.list',
        i18nKey: 'route.repair-order_list',
        i18nTitle: true,
        icon: 'material-symbols:list-alt-outline',
        requiresAuth: true
      }
    }
  ]
}; 