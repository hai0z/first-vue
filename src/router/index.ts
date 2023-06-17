import homePageVue from '@/views/home-page.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { auth } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: homePageVue,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    component: () => import('../views/login-page.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
let isLogin = false
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Người dùng đã đăng nhập
    // Thực hiện các logic cần thiết khi người dùng đã đăng nhập
    isLogin = true
    console.log('Người dùng đã đăng nhập:', user)
  } else {
    // Người dùng đã đăng xuất
    // Thực hiện các logic cần thiết khi người dùng đã đăng xuất
    console.log('Người dùng đã đăng xuất')
  }
})
router.beforeEach((to, from, next) => {
  console.log(isLogin)
  if (to.meta.requiresAuth && !isLogin) {
    next('/login') // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
  } else {
    next() // Cho phép điều hướng đến route tiếp theo
  }
})
export default router
