<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <notifications transition-name="notification-list" transition-mode="out-in">

    </notifications>
    <router-view name="header"></router-view>
    <transition name="fade"
                mode="out-in">
      <router-view  @signInScatter="doOnLoginDesktop"></router-view>
    </transition>
    <router-view name="footer"></router-view>
  </div>
</template>

<script>
  import Eos from 'eosjs';
  import ScatterJS from 'scatterjs-core'
  import ScatterEOS from 'scatterjs-plugin-eosjs'
  import bl from 'src/bl';
  import swal from 'sweetalert2';
  import { mapActions, mapGetters, mapState } from 'vuex';
  import ActionType from 'src/store/constants';
  import 'sweetalert2/dist/sweetalert2.css'
  import 'vue-notifyjs/themes/default.css'
  ScatterJS.plugins( new ScatterEOS() );

  export default {
    data() {
      return {
        currentLogin: '',
      }
    },
    created() {
      if (this.isMobileDevice()) {
        this.$router.replace({
          name: 'MobileDevice',
        });
      }
    },
    computed: {
      ...mapState([
        'scatter',
        'identity',
        'eos',
        'eosApi',
        'eosAccount',
        'tokenList',
        'ledgerWallet',
        'currentNode',
      ]),
      ...mapGetters([
        'httpEndpoint',
        'eosConfig',
        'eosConfigLedger',
      ]),
    },
    methods: {
      isMobileDevice() {
        return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1)
      },
    }
  }
</script>
<style lang="scss">

</style>
