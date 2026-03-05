import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'feeds',
    component: () => import('@/views/Feeds.vue'),
    meta: { requiresAuth: true, title: 'Feeds' },
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('@/views/Calendar.vue'),
    meta: { requiresAuth: true, title: 'Calendar' },
  },
  {
    path: '/post/:postId',
    name: 'preview',
    component: () => import('@/views/Preview.vue'),
    meta: { requiresAuth: true, title: 'Post' },
  },
  {
    path: '/bootcamps',
    name: 'bootcamps',
    component: () => import('@/views/Bootcamps.vue'),
    meta: { requiresAuth: true, title: 'Bootcamps' },
  },
  {
    path: '/bootcamps/:id',
    name: 'bootcamp',
    component: () => import('@/views/Bootcamp.vue'),
    props: true,
    meta: { requiresAuth: true, title: 'Bootcamp' },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/Search.vue'),
    meta: { requiresAuth: true, title: 'Find People' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/Settings.vue'),
    meta: { requiresAuth: true, title: 'Settings' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { guestOnly: true, title: 'Login' },
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/Signup.vue'),
    meta: { guestOnly: true, title: 'Signup' },
  },
  {
    path: '/forgotPassword',
    name: 'forgotPassword',
    component: () => import('@/views/ForgotPassword.vue'),
    meta: { guestOnly: true, title: 'Forgot Password' },
  },
  {
    path: '/resetPassword',
    name: 'resetPassword',
    component: () => import('@/views/ResetPassword.vue'),
    meta: { guestOnly: true, title: 'Reset Password' },
  },
  {
    path: '/verify',
    name: 'verify',
    component: () => import('@/views/Verify.vue'),
    meta: { guestOnly: true, title: 'Please verify your email address' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue'),
    meta: { title: 'About Us' },
  },
  {
    path: '/hello',
    name: 'landing',
    component: () => import('@/views/Landing.vue'),
    meta: { guestOnly: true, title: 'Join us' },
  },
  {
    path: '/account/me',
    name: 'myaccount',
    component: () => import('@/views/Profile.vue'),
    props: true,
    meta: { requiresAuth: true, title: 'User profile' },
  },
  {
    path: '/:username',
    name: 'profile',
    component: () => import('@/views/Profile.vue'),
    props: true,
    meta: { requiresAuth: true, title: 'User profile' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { requiresAuth: true, title: 'Page not found' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  document.title = `CUP OF THAT | ${to.meta.title || ''}`

  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.authenticated) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && auth.authenticated) {
    return { name: 'feeds' }
  }
})

export default router
