<template>
  <div id="main">
    <div class="row">
      <div class="col-md-8 col-12">
        <div class="card">
          <!--<div class="card-header"><h4 class="title">Create account without existing account (for free)</h4></div>-->
          <div class="card-header"><h4 class="title">Generate random account</h4></div>
          <div class="card-body">
            <form id="withoutAccountForm">
              <div class="row">
                <div class="col-12">
                  <fg-input type="text" label="Account name" v-model="withoutAccountaccountName" maxlength="12" required
                            name="withoutAccountaccountName" :error="getError('withoutAccountaccountName')" v-validate="withoutAccountmodelValidation.withoutAccountaccountName"
                            data-vv-as="account"
                  ></fg-input>
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <fg-input type="text" label="Owner public key" v-model="withoutAccountownerKey" maxlength="53" required
                            name="withoutAccountownerKey" data-vv-as="owner public key" :error="getError('withoutAccountownerKey')" v-validate="withoutAccountmodelValidation.withoutAccountownerKey"
                  ></fg-input>
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <fg-input type="password" label="Owner private key" :value="withoutAccountownerKeyPriv" maxlength="51" readonly
                  ></fg-input>
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <fg-input type="text" label="Active public key" v-model="withoutAccountactiveKey" maxlength="53" required
                            name="withoutAccountactiveKey" data-vv-as="active public key" :error="getError('withoutAccountactiveKey')" v-validate="withoutAccountmodelValidation.withoutAccountactiveKey"
                  ></fg-input>
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <fg-input type="password" label="Active private key" :value="withoutAccountactiveKeyPriv" maxlength="51" readonly
                  ></fg-input>
                </div>
              </div>

              <div class="row text-center">
                <div class="col-6">
                  <el-tooltip content="Randomize Name and Keypairs" placement="top">
                    <p-button @click="random" type="primary">
                      <font-awesome-icon icon="random" />
                    </p-button>
                  </el-tooltip>
                </div>

                <div class="col-6">
                  <el-tooltip content="Copy Name and Keypairs to clipboard" placement="top">
                    <p-button @click="copy" type="primary">
                      <font-awesome-icon icon="copy" />
                    </p-button>
                  </el-tooltip>
                </div>
                <!--<div class="col-4">-->
                  <!--<el-tooltip content="Create Account" placement="top">-->
                    <!--<p-button @click="withoutAccountonCreateAccount" :disabled="withoutAccountcreateAccountValidation" type="primary">-->
                      <!--<font-awesome-icon icon="plus-square" />-->
                    <!--</p-button>-->
                  <!--</el-tooltip>-->
                <!--</div>-->
              </div>

              <div class="row">
                <TextActionAgree/>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-12">
        <div class="card">
          <div class="card-header"><h4 class="title">Help</h4></div>
          <div class="card-body pb-4">
            <div>To create an account you need to generate the name and the key pairs. You can do it either through Scatter or My Telos Wallet.
              To generate the name and the key pairs in My Telos Wallet go to the window ‘Generate random account’ and click the button ‘Randomize Name and Keypairs’.
              Use the button ‘Copy Name and Keypairs to clipboard’ to copy all the generated data and save it in a secure place. Note that we strongly advise writing this information down manually as well.
              Then go to the window 'Create account' and click the button ‘Create Account’. That’s it, you now have a Telos account. You can log in to your account either using My Telos Wallet.
              In case you still have any questions feel free to contact us - <a href="mailto:myeoswalletsup@gmail.com"> myeoswalletsup@gmail.com</a>
              <br>Note: Attic Lab does not use or store your personal data.
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-8 col-12">
        <div class="card">
          <div class="card-header"><h4 class="title">Create account</h4></div>

          <div class="card-body">
            <form id="form">
              <div class="row">
                <div class="col-md-6 col-12">
                  <fg-input label="Creator" :value="getAccountName" maxlength="12" readonly></fg-input>
                </div>
                <div class="col-md-6 col-12">
                  <fg-input label="Account name" v-model="accountName" maxlength="12" required
                            name="accountName" v-validate="modelValidation.accountName" :error="getError('accountName')"
                            data-vv-as="account name"
                  ></fg-input>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 col-12">
                  <fg-input label="Owner public key" type="text" v-model="ownerKey" maxlength="53" required
                            name="ownerKey" v-validate="modelValidation.ownerKey" :error="getError('ownerKey')" data-vv-as="owner key"
                  ></fg-input>
                </div>
                <div class="col-md-6 col-12">
                  <fg-input label="Active public key" type="text" v-model="activeKey" maxlength="53"
                            name="activeKey" v-validate="modelValidation.activeKey" :error="getError('activeKey')" data-vv-as="active key"
                  ></fg-input>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 col-12">
                  <fg-input label="Cpu stake (in TLOS)" v-model.number="cpuStake" required
                            name="cpuStake" v-validate="modelValidation.cpuStake" :error="getError('cpuStake')" data-vv-as="cpu stake"
                  ></fg-input>
                </div>
                <div class="col-md-6 col-12">
                  <fg-input label="Net stake (in TLOS)" v-model.number="netStake" required
                            name="netStake" v-validate="modelValidation.netStake" :error="getError('netStake')" data-vv-as="net stake"
                  ></fg-input>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 col-12">
                  <fg-input label="Ram (in bytes)" type="number" v-model.number="ram" required
                            name="ram" v-validate="modelValidation.ram" :error="getError('ram')" data-vv-as="ram"
                  ></fg-input>
                </div>
                <div class="col-md-6 col-12">
                  <p class="category">Transfer</p>
                  <el-tooltip content="Transfer off: owner retains staking control and voting rights. Transfer on: New acc gains staking control and voting rights" placement="top">
                    <p-switch v-model="transfer">
                      <i class="fa fa-check" slot="on"></i>
                      <i class="fa fa-times" slot="off"></i>
                    </p-switch>
                  </el-tooltip>
                </div>
              </div>

              <div class="row">
                <div class="col text-center">
                  <p-button @click="onCreateAccount" :disabled="createAccountValidation" type="primary">Create Account</p-button>
                </div>
              </div>

              <div class="row">
                <TextActionAgree/>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-12">
        <div class="card">
          <div class="card-header"><h4 class="title">Help</h4></div>
          <div class="card-body pb-4">
            <div>Enter account name, owner key, active key, cpu, net and ram to stake and click ‘Create Account’.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bl from 'src/bl';
import ActionType from 'src/store/constants';
import { mapState, mapGetters, mapActions } from 'vuex';
import ecc from 'eosjs-ecc';
import PSwitch from 'src/components/UIComponents/Switch.vue';
import { Tooltip } from 'element-ui';

export default {
  name: 'CreateAccount',
  data() {
    return {
      accountName: '',
      ownerKey: '',
      activeKey: '',
      cpuStake: 0.1,
      netStake: 0.1,
      ram: 8192,
      transfer: false,
      withoutAccountaccountName: '',
      withoutAccountownerKey: '',
      withoutAccountactiveKey: '',
      withoutAccountownerKeyPriv: '',
      withoutAccountactiveKeyPriv: '',
      withoutAccountmodelValidation: {
        withoutAccountaccountName: {
          required: true,
          accountNotExistWitoutLogin: true,
        },
        withoutAccountownerKey: {
          required: true,
          publicKey: true,
        },
        withoutAccountactiveKey: {
          required: true,
          publicKey: true,
        },
      },
      modelValidation: {
        accountName: {
          required: true,
          accountNotExist: true,
        },
        ownerKey: {
          required: true,
          publicKey: true,
        },
        activeKey: {
          required: true,
          publicKey: true,
        },
        cpuStake: {
          required: true,
          decimal: true,
          min_value: 0,
          validateEosAmount: true,
        },
        netStake: {
          required: true,
          decimal: true,
          min_value: 0,
          validateEosAmount: true,
        },
        ram: {
          required: true,
          decimal: true,
          min_value: 0,
        },
      },
    };
  },
  components: {
    PSwitch,
    [Tooltip.name]: Tooltip,
  },
  computed: {
    ...mapState([
      'eos',
      'eosApi',
      'eosAccount',
      'currentToken',
    ]),
    ...mapGetters([
      'getAccountName',
      'getAuthority',
    ]),
    createAccountValidation() {
      return !Object.keys(this.modelValidation).every(key => this.fields[key] && this.fields[key].valid);
    },
    withoutAccountcreateAccountValidation() {
      return !Object.keys(this.withoutAccountmodelValidation).every(key => this.fields[key] && this.fields[key].valid);
    },
  },
  methods: {
    ...mapActions([
      ActionType.SET_TRANSACTION,
      ActionType.SET_BALANCE,
    ]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async generateRandomName() {
      function choices(population, k) {
        const out = [];
        // eslint-disable-next-line
        for (let i = 0; i < k; i++) {
          out.push(population[Math.floor(population.length * Math.random())]);
        }
        return out.join('');
      }
      function validAccountName(accountName) {
        const re = new RegExp('^([a-z1-5]){12}$');
        return re.test(accountName);
      }

      const alphabet = 'abcdefghijklmnopqrstuvwxyz12345';

      let res = '';
      res = choices(alphabet, 12);
      while (!validAccountName(res)) {
        res = choices(alphabet, 12);
      }

      return (this.eosApi.getAccount(res)
        .then(() => {
          this.generateRandomName();
        })
        .catch(() => {
          this.withoutAccountaccountName = res;
          return res;
        }));
    },
    withoutAccountonCreateAccount() {
      this.$http.post('newaccount', {
        name: this.withoutAccountaccountName,
        active: this.withoutAccountactiveKey,
        owner: this.withoutAccountownerKey,
      })
        .then((res) => {
          let r = res;
          if (!r.body) {
            r = { isError: true, message: 'Empty body' };
          } else {
            r = r.body;
          }
          console.debug(`${this.$options.name} RESULT`, r);
          this[ActionType.SET_TRANSACTION](r);
          bl.renderJSON(r, 'place-for-transaction');
        })
        .catch((e) => {
          this[ActionType.SET_TRANSACTION](e);
          bl.handleError(e, 'place-for-transaction');
        });
    },
    onCreateAccount() {
      if (!this.eos) {
        bl.logInPopUP();
        return;
      }

      this.eos.transaction({
        actions: [
          {
            account: 'eosio',
            name: 'newaccount',
            authorization: [{
              actor: this.getAccountName,
              permission: this.getAuthority,
            }],
            data: {
              creator: this.getAccountName,
              name: this.accountName,
              owner: this.ownerKey,
              active: this.activeKey,
            },
          },
          {
            account: 'eosio',
            name: 'buyrambytes',
            authorization: [{
              actor: this.getAccountName,
              permission: this.getAuthority,
            }],
            data: {
              payer: this.getAccountName,
              receiver: this.accountName,
              bytes: this.ram,
            },
          },
          {
            account: 'eosio',
            name: 'delegatebw',
            authorization: [{
              actor: this.getAccountName,
              permission: this.getAuthority,
            }],
            data: {
              from: this.getAccountName,
              receiver: this.accountName,
              stake_net_quantity: `${this.cpuStake.toFixed(4)} ${this.currentToken}`,
              stake_cpu_quantity: `${this.netStake.toFixed(4)} ${this.currentToken}`,
              transfer: this.transfer ? 1 : 0,
            },
          },
        ],
      }).then((res) => {
        console.debug(`${this.$options.name} RESULT`, res);
        this[ActionType.SET_TRANSACTION](res);
        bl.renderJSON(res, 'place-for-transaction');
        bl.requestBalance(this.eos, this.eosAccount).then((respBalance) => {
          this[ActionType.SET_BALANCE](respBalance);
          bl.logDebug('bl.requestBalance(eos).then...', respBalance);
        });
      })
        .catch((e) => {
          this[ActionType.SET_TRANSACTION](e);
          bl.handleError(e, 'place-for-transaction');
        });
    },
    async generateRandomOwnerKeys() {
      this.withoutAccountownerKeyPriv = await ecc.randomKey();
      this.withoutAccountownerKey = ecc.privateToPublic(this.withoutAccountownerKeyPriv);
    },
    async generateRandomActiveKeys() {
      this.withoutAccountactiveKeyPriv = await ecc.randomKey();
      this.withoutAccountactiveKey = ecc.privateToPublic(this.withoutAccountactiveKeyPriv);
    },
    random() {
      if (!this.eosApi) {
        bl.nodeConnectFail();
        return
      }
      this.generateRandomName();
      this.generateRandomOwnerKeys();
      this.generateRandomActiveKeys();
    },
    copy() {
      this.$copyText(`Name: ${this.withoutAccountaccountName}\nOwner public: ${this.withoutAccountownerKey}\nOwner private: ${this.withoutAccountownerKeyPriv}\nActive public: ${this.withoutAccountactiveKey}\nActive private: ${this.withoutAccountactiveKeyPriv}`);
    },
  },
};
</script>

<style scoped>
</style>
