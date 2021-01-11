import { RouteView } from './base'

export default
{
  path: '/deviceManage',
  name: 'deviceManage',
  component: RouteView,
  redirect: '/deviceManage/deviceList',
  meta: { title: '设备管理', icon: 'table', permission: [ 'deviceManage' ] },
  children: [
    {
      path: '/deviceManage/deviceList/:pageNum([1-9]\\d*)?',
      name: 'deviceList',
      component: () => import('@/gisunlink/deviceManage/deviceList'),
      hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      // hiddenHeaderContent: true,
      hideInBreadcrumb: true, // 前路由在面包屑中不展现，默认 false
      meta: { title: '设备列表', permission: [ 'deviceList' ] }
    }, {
      path: '/deviceManage/deviceList/deviceInfo',
      name: 'deviceInfo',
      hiddenHeaderContent: true,
      hidden: true,
      component: () => import('@/gisunlink/deviceManage/deviceInfo'),
      meta: { title: '设备详情', hiddenHeaderContent: true, permission: [ 'deviceInfo' ] }
    },
    {
      path: '/deviceManage/moduleList/:pageNum([1-9]\\d*)?',
      name: 'moduleList',
      hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      component: () => import('@/gisunlink/deviceManage/moduleList'),
      meta: { title: '模组列表', permission: [ 'moduleList' ] }
    },
    {
      path: '/deviceManage/connectList/:pageNum([1-9]\\d*)?',
      name: 'connectList',
      hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      component: () => import('@/gisunlink/deviceManage/connectList'),
      meta: { title: '连接日志', permission: [ 'connectList' ] }
    },
    {
      path: '/deviceManage/transferList/:pageNum([1-9]\\d*)?',
      name: 'transferList',
      hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      component: () => import('@/gisunlink/deviceManage/transferList'),
      meta: { title: '状态列表', permission: [ 'transferList' ] }
    }
  ]
}
