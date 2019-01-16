import Vue from 'vue'
import './pollyfills'
import VueRouter from 'vue-router'
import VueNotify from 'vue-notifyjs'
import VeeValidate, { Validator } from 'vee-validate'
import VueResource from 'vue-resource'
import VueAnalytics from 'vue-analytics'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import store from './store'
import App from './App.vue'

// Plugins
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import SideBar from './components/UIComponents/SidebarPlugin'
import initProgress from './progressbar';

// router setup
import routes from './routes/routes'

// library imports
import './assets/sass/paper-dashboard.scss'
import './assets/sass/demo.scss'

// VeeValidate
import validationRules from './validationRules';

Vue.use(VeeValidate, {
  events: 'paste|input|blur|change',
});
validationRules.forEach((item) => {
  Validator.extend(item.name, {
    getMessage: item.getMessage,
    validate: item.validate,
  });
});

import sidebarLinks from './sidebarLinks'
// plugin setup
Vue.use(VueRouter)
Vue.use(GlobalDirectives)
Vue.use(GlobalComponents)
Vue.use(VueNotify)
Vue.use(SideBar, {sidebarLinks: sidebarLinks})
Vue.use(VeeValidate)
locale.use(lang)

// configure router
const router = new VueRouter({
  mode: 'history',
  routes, // short for routes: routes
  linkActiveClass: 'active'
})

initProgress(router);

// google analytics
Vue.use(VueAnalytics, {
  id: 'UA',
  router,
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
