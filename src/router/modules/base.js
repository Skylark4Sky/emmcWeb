
const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

const page404 = {
  path: '*',
  component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
}

const baseRouter = [
  {
    path: 'login',
    name: 'login',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
  },
  {
    path: 'register',
    name: 'register',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
  },
  {
    path: 'register-result',
    name: 'registerResult',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
  },
  {
    path: 'recover',
    name: 'recover',
    component: undefined
  }
]

export { RouteView, page404, baseRouter }
