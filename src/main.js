import Vue from 'vue';
import './pollyfills';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import VueNotify from 'vue-notifyjs';
import VeeValidate, { Validator } from 'vee-validate';
import VueAnalytics from 'vue-analytics';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import store from './store';
import App from './App.vue';
// Plugins
import GlobalComponents from './globalComponents';
import GlobalDirectives from './globalDirectives';
import SideBar from './components/UIComponents/SidebarPlugin';
import initProgress from './progressbar';
// router setup
import routes from './routes/routes';
import './assets/sass/paper-dashboard.scss';
import './assets/sass/demo.scss';

import sidebarLinks from './sidebarLinks';
// VeeValidate
import validationRules from './validationRules';

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCubes, faWallet, faStickyNote, faFolderPlus, faAddressCard, faUniversity, faQuestionCircle, faThLarge,
  faTrophy, faAngleLeft, faAngleRight, faBars, faCopy, faRandom, faPlusSquare, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faCubes, faWallet, faStickyNote, faFolderPlus, faAddressCard, faUniversity, faQuestionCircle, faThLarge,
  faTrophy, faAngleLeft, faAngleRight, faBars, faCopy, faRandom, faPlusSquare, faSignOutAlt, faSignInAlt );
Vue.component('font-awesome-icon', FontAwesomeIcon);

// library imports
// plugin setup
Vue.use(VueRouter);
Vue.use(GlobalDirectives);
Vue.use(GlobalComponents);
Vue.use(VueNotify);
Vue.use(SideBar, {sidebarLinks: sidebarLinks});
Vue.use(VeeValidate);
locale.use(lang);

// configure router
const router = new VueRouter({
  mode: 'history',
  routes, // short for routes: routes
  linkActiveClass: 'active',
});

initProgress(router);


Vue.use(VeeValidate, {
  events: 'paste|input|blur|change',
});
validationRules.forEach((item) => {
  Validator.extend(item.name, {
    getMessage: item.getMessage,
    validate: item.validate,
  });
});

// google analytics
Vue.use(VueAnalytics, {
  id: 'UA-1',
  router,
});

Vue.use(VueResource);
Vue.http.options.root = process.env.VUE_APP_BASE_URL;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router,
});
