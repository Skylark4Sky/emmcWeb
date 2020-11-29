import { bxAnaalyse } from '@/core/icons'
import { RouteView } from './base'

export default
{
  path: '/dashboard',
  name: 'dashboard',
  redirect: '/dashboard/analysis',
  component: RouteView,
  meta: { title: '数据统计', icon: bxAnaalyse, permission: [ 'dashboard' ] },
  children: [
    {
      path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
      name: 'Analysis',
      component: () => import('@/views/dashboard/Analysis'),
      meta: { title: '数据汇总', permission: [ 'dashboard' ] }
    }
  ]
}
