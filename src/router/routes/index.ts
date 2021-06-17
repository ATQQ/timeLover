import { RouteRecordRaw } from 'vue-router'
import Home from '../../pages/home/index.vue'

const NotFind = () => import('../../pages/404/index.vue')
const Login = () => import('../../pages/login/index.vue')
const DashBoard = () => import('../../pages/dashboard/index.vue')
const Weight = () => import('../../pages/funcs/weight/index.vue')

const routes: RouteRecordRaw[] = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFind },
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashBoard,
  },
  {
    path: '/funs/weight',
    name: 'weight',
    component: Weight,
  },
]

export default routes
