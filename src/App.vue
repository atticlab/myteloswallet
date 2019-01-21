<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <notifications transition-name="notification-list" transition-mode="out-in">

    </notifications>
    <router-view name="header"></router-view>
    <transition name="fade"
                mode="out-in">
      <router-view @signInScatter="doOnLoginDesktop" @signInLedger="connectLedger"></router-view>
    </transition>
    <router-view name="footer"></router-view>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex'
  import ActionType from 'src/store/constants'
  import Eos from 'eosjs'
  import ExternalWallet, {bip44Path, EXT_WALLET_TYPES} from 'src/models/ExternalWallet'

  export default {
    data() {
      return {
        isLedgerConnected: false,
        currentLogin: '',
      }
    },
    created() {
      if (this.$bl.isMobileDevice()) {
        this.$router.replace({
          name: 'MobileDevice',
        })
      }
      this.doOnLoginDesktop()
      this.initEosApi()
      setInterval(() => {
        this.balanceUpdate()
      }, 20000)
      const ledgerWallet = new ExternalWallet(EXT_WALLET_TYPES.LEDGER)
      this[ActionType.SET_LEDGER_WALLET](ledgerWallet)
    },
    watch: {
      currentNode() {
        this.initEosApi()
        this.relogin()
      },
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
      relogin() {
        if (this.currentLogin === 'scatter') {
          this.doOnLoginDesktop()
        } else if (this.currentLogin === 'ledger') {
          this.connectLedger()
        }
      },
      initEosApi() {
        const eos = Eos(this.eosConfig)
        this[ActionType.SET_EOS_JSAPI](eos)
      },
      noScatterAlert() {
        this.$swal({
          title: 'No scatter detected!',
          html: 'Please <a href="https://get-scatter.com/" target="_blank">install Scatter plugin or desktop application</a> and refresh this page.',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-info btn-fill',
        })
      },
      balanceUpdate() {
        if (this.eos && this.eosAccount) {
          this.$bl.requestBalance(this.eos, this.eosAccount).then((respBalance) => {
            this[ActionType.SET_BALANCE](respBalance)
            this.$bl.logDebug('bl.requestBalance(eos).then...', respBalance)
          })
        }
      },
      initIdentityAccount(identity) {
        if (identity.accounts) {
          const identityAccount = identity.accounts.find(e => e.blockchain === 'eos')
          this.$bl.logDebug('IDENTITY.accounts...', identity.accounts)
          this.$bl.logDebug('IDENTITY.accounts.find...', identityAccount)
          if (identityAccount) {
            this[ActionType.SET_IDENTITY_ACCOUNT](identityAccount)
            return identityAccount
          }
          return null
        }
        return false
      },
      doOnLoginDesktop() {
        const vm = this
        this.currentLogin = 'scatter'

        this[ActionType.RELOGIN_SCATTER_EOS]()
        this.$scatterjs.connect('My Telos Wallet', {initTimeout: 3500})
            .then((connected) => {
              if (!connected) {
                this.noScatterAlert()
                return false
              }

              const scatter = this.$scatterjs
              window.scatter = null
              window.ScatterJS = null

              this[ActionType.SET_SCATTER](scatter)
              const requiredFields = {accounts: [this.eosConfig]}
              return setTimeout(() => {
                scatter.getIdentity(requiredFields)
                       .then((identity) => {
                         if (!identity) return console.error('no identity')
                         vm[ActionType.SET_IDENTITY](identity)
                         console.dir(identity)
                         // console.dir(vm.$scatterjs)
                         const account = this.initIdentityAccount(identity)
                         vm[ActionType.SET_IDENTITY_ACCOUNT](account)
                         // console.log(account)
                         // console.log(vm.eosConfig)
                         const eos = scatter.eos(vm.eosConfig, Eos, {expireInSeconds: 60})
                         vm[ActionType.SET_EOS_JS](eos)

                         // console.log(eos)
                         eos.getAccount(account.name)
                            .then((respEosAccount) => {
                              this.$bl.logDebug(`getAccount('${account.name}').then((eosAccount) => ...`, respEosAccount)
                              this[ActionType.SET_EOS_ACCOUNT](respEosAccount)
                              //
                              //      // this.getTokenList();
                              //      // this.balanceUpdate();
                            })
                            .catch(e => {
                              console.error('getAcc', e)
                            })
                       })
                       .catch((error) => {
                         console.error(error)
                       })
              }, 500)
            }).catch((e) => {
          console.error(e)
        })
      },
      failConnectLedger(json) {
        let text = 'For more information check <a href="https://support.ledgerwallet.com/hc/en-us/articles/115005165269-Fix-connection-issues" target="_blank">documentation</a>'
        if (json) {
          let parsedJson = json
          if (typeof json === 'string') {
            parsedJson = JSON.parse(json)
          }
          text = `${text}<div style="text-align: left;"><pre id="json-pop-up">${JSON.stringify(parsedJson, null, 1)}</pre></div>`
        }
        this.$swal({
          title: 'Error, connect Ledger',
          html: text,
          buttonsStyling: false,
          showCloseButton: true,
          showConfirmButton: false,
        })
      },
      connectLedger() {
        // this.logout();
        this[ActionType.RELOGIN_SCATTER_EOS]()
        this.currentLogin = 'ledger'
        if (this.isLedgerConnected) {
          this.ledgerWallet.interface.getPublicKey(bip44Path, false)
              .then((key) => {
                this.eosApi.getKeyAccounts(key.wif)
                    .then((accountFromKey) => {
                      const name = accountFromKey.account_names[0]
                      this.eosApi.getAccount(name)
                          .then((account) => {
                            const authority = account.permissions.find((authObj) => {
                              const keys = authObj.required_auth.keys
                              return keys.find((keyObj) => {
                                if (keyObj.key === key.wif) {
                                  return true
                                }
                                return false
                              })
                            }).perm_name
                            this[ActionType.SET_EOS_ACCOUNT](account)
                            this[ActionType.SET_IDENTITY_ACCOUNT]({
                              authority,
                              name: account.account_name
                            })
                            this.balanceUpdate()
                          })
                    })
                    .catch((e) => {
                      this.failConnectLedger(e)
                      this.isLedgerConnected = false
                      console.error(e)
                    })
              })
              .catch(e => console.error(e))
          const eos = Eos(Object.assign(this.eosConfigLedger))
          this[ActionType.SET_EOS_JS](eos)
        } else {
          this.$swal({
            title: 'Connecting to EOS via Ledger',
            html: '<ol class="text-left">' +
            '<li>Connect Ledger Nano S. (<a href="https://support.ledgerwallet.com/hc/en-us/articles/360000613793-Initialize-your-device" target="_blank">Initialize your device</a>)</li>' +
            '<li>Enter your password.</li>' +
            '<li>Open EOS on your device. (<a href="https://support.ledgerwallet.com/hc/en-us/articles/360008913653-EOS-EOS-" target="_blank">Install EOS App</a>)</li>' +
            '</ol>',
            imageUrl: '/static/img/connectledger.png',
            imageClass: 'popup-img',
            buttonsStyling: false,
            showCloseButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            confirmButtonClass: 'btn btn-primary',
          })
          this.ledgerWallet.interface.canConnect()
              .then((res) => {
                if (res === 'Open and unlock your Ledger.') {
                  this.failConnectLedger({message: 'Open and unlock your Ledger.'})
                  this.isLedgerConnected = false
                  return
                }
                this.$swal({
                  title: 'Success, Ledger is connected',
                  buttonsStyling: false,
                  showCloseButton: true,
                  showConfirmButton: true,
                  focusConfirm: true,
                  type: 'success',
                  confirmButtonText: 'Ok',
                  confirmButtonClass: 'btn btn-primary',
                })
                this.isLedgerConnected = true
                this.connectLedger()
              })
              .catch((e) => {
                console.error(e)
                this.failConnectLedger(e)
                this.isLedgerConnected = false
              })
        }
      },
    },
    computed: {
      ...mapGetters([
        'eosConfig',
        'eosConfigLedger',
      ]),
      ...mapState([
        'eos',
        'eosApi',
        'ledgerWallet',
        'currentNode',
      ]),
    },
  }
</script>
<style lang="scss">

</style>
