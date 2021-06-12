import { RouteRecordRaw } from 'vue-router'
import Home from '../../pages/home/index.vue'

const NotFind = () => import('../../pages/404/index.vue')
const routes: RouteRecordRaw[] = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFind },
  {
    path: '/',
    name: 'index',
    component: Home,
  },
]

export default routes
