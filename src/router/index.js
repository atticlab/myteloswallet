import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import initProgress from '../progressbar'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes, // short for routes: routes
  linkActiveClass: 'active',
})

initProgress(router)

export default router
