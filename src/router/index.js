import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'

import Welcome from '../views/Welcome'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
    {
    path: '/passwordReset',
    name: 'passwordReset',
    component: () => import('../views/PasswordReset.vue')
  },
    {
    path: '/sendPasswordReset',
    name: 'sendPasswordReset',
    component: () => import('../views/SendPasswordReset.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next) => {
  if (['Home'].includes(to.name)) {
    if (firebase.auth().currentUser) {
      next()
    } else {
      next({
        path: 'welcome'
      })
    }
  } else {
    next()
  }
})

function requireAuth(to,from,next) {
  if (store.state.user) {
    next()
  } else {
    next({
      path: '/welcome'
    })
  }
}

export default router
