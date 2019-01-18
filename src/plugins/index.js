import Vue from 'vue'
import VueNotify from 'vue-notifyjs'
import VeeValidate, {Validator} from 'vee-validate'
import VueAnalytics from 'vue-analytics'
import VueResource from 'vue-resource'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import GlobalComponents from '../globalComponents'
import GlobalDirectives from '../globalDirectives'
import SideBar from '../components/UIComponents/SidebarPlugin'
import sidebarLinks from '../sidebarLinks'
import validationRules from '../validationRules'
import router from '../router'
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
import bl from '../bl'

ScatterJS.plugins(new ScatterEOS())

// plugin setup
Vue.use(GlobalDirectives)
Vue.use(GlobalComponents)
Vue.use(VueNotify, {type: 'primary', timeout: 5000})
Vue.use(SideBar, {sidebarLinks: sidebarLinks})
Vue.use(VeeValidate)
locale.use(lang)

Vue.use(VeeValidate, {
  events: 'paste|input|blur|change',
})
validationRules.forEach((item) => {
  Validator.extend(item.name, {
    getMessage: item.getMessage,
    validate: item.validate,
  })
})

// google analytics
Vue.use(VueAnalytics, {
  id: 'UA-12',
  router,
})

Vue.use(VueResource)
// Vue.http.options.root = process.env.VUE_APP_BASE_URL

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCubes, faWallet, faStickyNote, faFolderPlus, faAddressCard, faUniversity, faQuestionCircle, faThLarge,
  faTrophy, faAngleLeft, faAngleRight, faBars, faCopy, faRandom, faPlusSquare, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faCubes, faWallet, faStickyNote, faFolderPlus, faAddressCard, faUniversity, faQuestionCircle, faThLarge,
  faTrophy, faAngleLeft, faAngleRight, faBars, faCopy, faRandom, faPlusSquare, faSignOutAlt, faSignInAlt );
Vue.component('font-awesome-icon', FontAwesomeIcon);


Vue.prototype.$scatterjs = ScatterJS
Vue.prototype.$bl = bl
