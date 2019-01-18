<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <notifications transition-name="notification-list" transition-mode="out-in">

    </notifications>
    <router-view name="header"></router-view>
    <transition name="fade"
                mode="out-in">
      <router-view @signInScatter="doOnLoginDesktop"></router-view>
    </transition>
    <router-view name="footer"></router-view>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex'
  import ActionType from 'src/store/constants'
  import Eos from 'eosjs'

  export default {
    mounted() {
      if (this.$bl.isMobileDevice()) {
        this.$router.replace({
          name: 'MobileDevice',
        })
      }
      this.doOnLoginDesktop()
    },
    methods: {
      ...mapActions([
        ActionType.SET_SCATTER,
        ActionType.SET_IDENTITY,
        ActionType.SET_IDENTITY_ACCOUNT,
        ActionType.SET_EOS_ACCOUNT,
        ActionType.SET_EOS_JS,
        ActionType.SET_EOS_JSAPI,
        ActionType.SET_BALANCE,
        ActionType.SET_TRANSACTION,
        ActionType.SET_TOKENLIST,
        ActionType.SET_TOKENBALANCE,
        ActionType.SET_LEDGER_WALLET,
        ActionType.SET_HARDWARE,
        ActionType.LOGOUT,
        ActionType.RELOGIN_SCATTER_EOS,
      ]),
      balanceUpdate() {
        if (this.eos && this.eosAccount) {
          this.$bl.requestBalance(this.eos, this.eosAccount).then((respBalance) => {
            this[ActionType.SET_BALANCE](respBalance);
            this.$bl.logDebug('bl.requestBalance(eos).then...', respBalance);
          });
        }
      },
      initIdentityAccount(identity) {
        if (identity.accounts) {
          const identityAccount = identity.accounts.find(e => e.blockchain === 'eos');
          this.$bl.logDebug('IDENTITY.accounts...', identity.accounts);
          this.$bl.logDebug('IDENTITY.accounts.find...', identityAccount);
          if (identityAccount) {
            this[ActionType.SET_IDENTITY_ACCOUNT](identityAccount);
            return identityAccount;
          }
          return null
        }
        return false;
      },
      doOnLoginDesktop() {
        const vm = this

        this[ActionType.RELOGIN_SCATTER_EOS]()
        this.$scatterjs.connect('My Telos Wallet', {initTimeout: 3500})
            .then((connected) => {
              if (!connected) {
                // this.noScatterAlert()
                return false
              }

              const scatter = this.$scatterjs
              window.scatter = null
              window.ScatterJS = null

              console.log(this.eosConfig)
              this[ActionType.SET_SCATTER](scatter)
              const requiredFields = { accounts: [this.eosConfig] };
              return setTimeout(() => {
                scatter.getIdentity(requiredFields)
                       .then((identity) => {
                         if (!identity) return console.error('no identity')
                         vm[ActionType.SET_IDENTITY](identity)
                         console.log(identity)
                         // console.dir(vm.$scatterjs)
                         const account = this.initIdentityAccount(identity);
                         vm[ActionType.SET_IDENTITY_ACCOUNT](account)
                         console.log(account)
                         // console.log(vm.eosConfig)
                         const eos = scatter.eos(vm.eosConfig, Eos, {expireInSeconds: 60})
                         vm[ActionType.SET_EOS_JS](eos)

                         eos.getAccount(account.name).then((respEosAccount) => {
                           bl.logDebug(`getAccount('${account.name}').then((eosAccount) => ...`, respEosAccount);
                           this[ActionType.SET_EOS_ACCOUNT](respEosAccount);

                           // this.getTokenList();
                           this.balanceUpdate();
                         });
                       })
                       .catch((error) => {
                         console.error(error)
                       })
              }, 1000)
            }).catch((e) => {
          console.error(e)
        })
      },

    },
    computed: {
      ...mapGetters([
        'eosConfig',
      ]),
    }
  }
</script>
<style lang="scss">

</style>
