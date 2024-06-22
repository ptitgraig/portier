import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {RouteName} from "@/router/RouteNames";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteName.HOME,
      component: HomeView
    },
    {
      path: '/person-list',
      name: RouteName.PERSON_LIST,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/PersonListView.vue')
    },
    {
      path: '/date-picking',
      name: RouteName.DATE_PICKING,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DatePickingView.vue')
    },
    {
      path: '/stats',
      name: RouteName.STATS,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/StatsView.vue')
    },
    {
      path: '/edit-person',
      name: RouteName.EDIT_PERSON,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/EditPersonView.vue')
    }
  ]
})

export default router
