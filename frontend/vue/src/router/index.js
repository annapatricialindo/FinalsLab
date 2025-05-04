import { createRouter, createWebHashHistory } from 'vue-router';
import store from '@/store';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ProductView from '@/views/ProductView.vue';
import AdminView from '@/views/AdminView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/product',
    name: 'productview',
    component: ProductView,
    meta: { requiresAuth: true, role: ['customer'] }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAuth: true, role: ['admin', 'employee'] }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuth = store.getters['auth/isAuthenticated'];
  const role = store.getters['auth/userRole'];

  const guestOnlyRoutes = ['/', '/login', '/register'];

  // Prevent redirect loop: Ensure we do not redirect to the same destination
  if (isAuth && guestOnlyRoutes.includes(to.path)) {
    // If user is already authenticated and tries to access login/register page, redirect based on role
    if (['employee', 'admin'].includes(role) && to.path !== '/admin') {
      next('/admin');
    } else if (role === 'customer' && to.path !== '/product') {
      next('/product');
    } else if (to.path !== '/') { // Avoid redirect loop to '/' if already there
      next('/'); // fallback
    }
  } else if (to.meta.requiresAuth && !isAuth) {
    next('/login');
  } else if (to.meta.role && !to.meta.role.includes(role)) {
    next('/login');
  } else {
    next();
  }
});

export default router;
