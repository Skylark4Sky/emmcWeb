import { RouteView } from './base'

export default
{
  path: '/accountManage',
  component: RouteView,
  redirect: '/accountManage/center',
  name: 'accountManage',
  meta: { title: '个人中心', icon: 'edit', permission: [ 'personalCenter' ] },
  children: [
    {
      path: '/accountManage/settings',
      name: 'settings',
      component: () => import('@/gisunlink/accountManage/settings/Index'),
      meta: { title: '个人资料', hideHeader: true, permission: [ 'personalCenter' ] },
      redirect: '/accountManage/settings/base',
      hideChildrenInMenu: true,
      children: [
        {
          path: '/accountManage/settings/base',
          name: 'BaseSettings',
          component: () => import('@/gisunlink/accountManage/settings/BaseSetting'),
          meta: { title: '基本资料', hidden: true, permission: [ 'personalInfo' ] }
        },
        {
          path: '/accountManage/settings/security',
          name: 'SecuritySettings',
          component: () => import('@/gisunlink/accountManage/settings/Security'),
          meta: { title: '安全设置', hidden: true, permission: [ 'personalSecurity' ] }
        },
        {
          path: '/accountManage/settings/notification',
          name: 'NotificationSettings',
          component: () => import('@/gisunlink/accountManage/settings/Notification'),
          meta: { title: '新消息通知', hidden: true, permission: [ 'personalNotification' ] }
        }
      ]
    }
  ]
}
