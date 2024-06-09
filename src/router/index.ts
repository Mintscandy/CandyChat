import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import App from '@/App.vue'; // Import the 'App' component

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: App,
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/ChatView.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
