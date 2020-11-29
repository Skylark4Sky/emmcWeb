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
      hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      component: () => import('@/views/list/DeviceList'),
      meta: { title: '设备列表', permission: [ 'deviceList' ] }
    },
    {
      path: '/deviceManage/moduleList/:pageNum([1-9]\\d*)?',
      name: 'moduleList',
      hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      component: () => import('@/views/list/ModuleList'),
      meta: { title: '模组列表', permission: [ 'moduleList' ] }
    },
    {
      path: '/deviceManage/connectList/:pageNum([1-9]\\d*)?',
      name: 'connectList',
      hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      component: () => import('@/views/list/ConnectList'),
      meta: { title: '连接日志', permission: [ 'connectList' ] }
    },
    {
      path: '/deviceManage/transferList/:pageNum([1-9]\\d*)?',
      name: 'transferList',
      hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      component: () => import('@/views/list/TransferList'),
      meta: { title: '状态列表', permission: [ 'transferList' ] }
    }
  ]
}
