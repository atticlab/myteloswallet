import Vue from 'vue'
import './pollyfills'
import App from './App.vue'

// Plugins
import './plugins'

// router setup
import router from './router'

// store setup
import store from './store'

// theme style
import './assets/sass/paper-dashboard.scss'
import './assets/sass/demo.scss'
import 'sweetalert2/dist/sweetalert2.css'
import 'vue-notifyjs/themes/default.css'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
