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
        name: 'p',
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/nofication/p/:id',
    component: () => import('../views/nofication-page.vue')
  },
  {
    path: '/login',
    component: () => import('../views/login-page.vue')
  },
  {
    path: '/profile',
    children: [
      {
        path: '/profile',
        component: () => import('../views/profile-page.vue')
      },
      {
        path: '/profile/:userUid',
        component: () => import('../views/other-profile.vue')
      },
      {
        path: '/profile/p/:id',
        name: 'profile',
        component: () => import('../views/profile-page.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/profile/:userUid/p/:id',
        name: 'other-profile',
        component: () => import('../views/other-profile.vue'),
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
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login') // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
  } else {
    next() // Cho phép điều hướng đến route tiếp theo
  }
})
export default router
