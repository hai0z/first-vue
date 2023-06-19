import homePageVue from '@/views/home-page.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { useAuthStore } from '@/store/useAuthStore'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: homePageVue,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/',
        component: homePageVue
      },
      {
        path: '/p/:id',
        component: homePageVue,
        meta: {
          requiresAuth: true
        }
      }
    ]
  },

  {
    path: '/login',
    component: () => import('../views/login-page.vue')
  },
  {
    path: '/profile',
    component: () => import('../views/profile-page.vue'),
    children: [
      {
        path: '/',
        component: () => import('../views/profile-page.vue')
      },
      {
        path: '/p/:id',
        component: () => import('../views/profile-page.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  console.log(authStore.isAuthenticated)
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login') // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
  } else {
    next() // Cho phép điều hướng đến route tiếp theo
  }
})
export default router
