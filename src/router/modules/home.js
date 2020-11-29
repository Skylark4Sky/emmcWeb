import { bxAnaalyse } from '@/core/icons'
import { RouteView } from './base'

export default
{
  path: '/dashboard',
  name: 'dashboard',
  redirect: '/dashboard/analysis',
  component: RouteView,
  meta: { title: 'menu.dashboard', icon: bxAnaalyse, permission: [ 'dashboard' ] },
  children: [
    {
      path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
      name: 'Analysis',
      component: () => import('@/views/dashboard/Analysis'),
      meta: { title: 'menu.dashboard.analysis', permission: [ 'dashboard' ] }
    }
  ]
}
