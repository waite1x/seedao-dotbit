import MintHomeVue from "../views/dotbit/MintHome.vue"
import DotBit from '../views/dotbit/index.vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dotbit'
  },
  {
    path: '/dotbit',
    component: DotBit,
    children: [
      {
        path: '',
        component: MintHomeVue
      },
      {
        path: 'mint',
        component: () => import('../views/dotbit/Mint.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})


export default router

