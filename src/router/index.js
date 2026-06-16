import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'

import DashboardView from '@/views/dashboard/DashboardView.vue'
import ProfileView from '@/views/dashboard/ProfileView.vue'
import AppointmentsView from '@/views/dashboard/AppointmentsView.vue'
import ClinicalHistoryView from '@/views/dashboard/ClinicalHistoryView.vue'
import RecommendationsView from '@/views/dashboard/RecommendationsView.vue'
import RegistroAdministrador from '@/views/auth/RegisterAdmin.vue'
import HomeAdministrador from '@/views/dashboardAdmin/dashboardView.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },

    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },

    {
      path: '/appointments',
      name: 'appointments',
      component: AppointmentsView,
    },

    {
      path: '/clinical-history',
      name: 'clinical-history',
      component: ClinicalHistoryView,
    },

    {
      path: '/recommendations',
      name: 'recommendations',
      component: RecommendationsView,
    },
    {
      path: '/createAdmin',
      name: 'createAdmin',
      component: RegistroAdministrador,
    },
    {
      path: '/DashAdministrador',
      name: 'DashAdministrador',
      component: HomeAdministrador,
    },
  ],
})

// 🛡️ GUARD
router.beforeEach((to) => {
  const isAuth = localStorage.getItem('auth')
  const role = localStorage.getItem('role')

  if (to.meta?.requiresAuth && !isAuth) {
    return { name: 'login' }
  }

  if (to.meta?.role && to.meta.role !== role) {
    return { name: 'dashboard' } // 👈 mejor que "Dashboard"
  }

  return true
})

export default router
