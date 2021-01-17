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
      path: '/deviceManage/deviceList',
      name: 'deviceList',
      component: RouteView,
      hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      meta: { title: '设备列表', permission: [ 'deviceManage' ] },
      children: [
        {
          path: '/deviceManage/deviceList/:pageNum([1-9]\\d*)?',
          name: 'deviceList',
          hidden: true,
          component: () => import('@/gisunlink/deviceManage/deviceList'),
          meta: { title: '设备展示', permission: [ 'deviceList' ] }
        },
        {
          path: '/deviceManage/deviceList/deviceInfo',
          name: 'deviceInfo',
          hidden: true,
          component: () => import('@/gisunlink/deviceManage/deviceInfo'),
          meta: { title: '设备详情', permission: [ 'deviceInfo' ] }
        }
      ]
    },
    {
      path: '/deviceManage/deviceCharge/:pageNum([1-9]\\d*)?',
      name: 'deviceCharge',
      component: () => import('@/gisunlink/deviceManage/deviceCharge'),
      meta: { title: '充电状态', permission: [ 'deviceCharge' ] }
    },
    {
      path: '/deviceManage/moduleList/:pageNum([1-9]\\d*)?',
      name: 'moduleList',
      component: () => import('@/gisunlink/deviceManage/moduleList'),
      meta: { title: '模组列表', permission: [ 'moduleList' ] }
    },
    {
      path: '/deviceManage/connectList/:pageNum([1-9]\\d*)?',
      name: 'connectList',
      component: () => import('@/gisunlink/deviceManage/connectList'),
      meta: { title: '连接日志', permission: [ 'connectList' ] }
    },
    {
      path: '/deviceManage/transferList/:pageNum([1-9]\\d*)?',
      name: 'transferList',
      component: () => import('@/gisunlink/deviceManage/transferList'),
      meta: { title: '状态上报', permission: [ 'transferList' ] }
    }
  ]
}
