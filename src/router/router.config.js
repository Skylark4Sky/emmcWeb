import { UserLayout, BasicLayout } from '@/layouts'
import { page404, baseRouter } from './modules/base'
import homeRoute from './modules/home'
import deviceRoute from './modules/device'
import userRoute from './modules/user'
import personalCenter from './modules/personalCenter'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/analysis',
    children: [
      homeRoute,
      deviceRoute,
      userRoute,
      personalCenter
    ]
  },
  page404
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: baseRouter
  },
  page404
]
