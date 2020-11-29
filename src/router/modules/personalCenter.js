import { RouteView } from './base'

export default
{
  path: '/account',
  component: RouteView,
  redirect: '/account/center',
  name: 'account',
  meta: { title: '个人中心', icon: 'edit', permission: [ 'personalCenter' ] },
  children: [
    {
      path: '/account/settings',
      name: 'settings',
      component: () => import('@/views/account/settings/Index'),
      meta: { title: '个人资料', hideHeader: true, permission: [ 'personalCenter' ] },
      redirect: '/account/settings/base',
      hideChildrenInMenu: true,
      children: [
        {
          path: '/account/settings/base',
          name: 'BaseSettings',
          component: () => import('@/views/account/settings/BaseSetting'),
          meta: { title: '基本资料', hidden: true, permission: [ 'personalInfo' ] }
        },
        {
          path: '/account/settings/security',
          name: 'SecuritySettings',
          component: () => import('@/views/account/settings/Security'),
          meta: { title: '安全设置', hidden: true, permission: [ 'personalSecurity' ] }
        },
        {
          path: '/account/settings/custom',
          name: 'CustomSettings',
          component: () => import('@/views/account/settings/Custom'),
          meta: { title: '个性化设置', hidden: true, permission: [ 'personalCustom' ] }
        },
        {
          path: '/account/settings/notification',
          name: 'NotificationSettings',
          component: () => import('@/views/account/settings/Notification'),
          meta: { title: '新消息通知', hidden: true, permission: [ 'personalNotification' ] }
        }
      ]
    }
  ]
}
