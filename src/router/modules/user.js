import { RouteView } from './base'

export default
{
  path: '/userManage',
  name: 'userManage',
  component: RouteView,
  redirect: '/userManage/userList',
  meta: { title: '用户管理', icon: 'user', permission: [ 'userManage' ] },
  children: [
    {
      path: '/userManage/userList/:pageNo([1-9]\\d*)?',
      name: 'userList',
      hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      component: () => import('@/views/list/TableList'),
      meta: { title: '用户列表', permission: [ 'userList' ] }
    },
    {
      path: '/userManage/userOrder/:pageNo([1-9]\\d*)?',
      name: 'userOrder',
      hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      component: () => import('@/views/list/TableList'),
      meta: { title: '用户交易', permission: [ 'userOrder' ] }
    }
  ]
}
