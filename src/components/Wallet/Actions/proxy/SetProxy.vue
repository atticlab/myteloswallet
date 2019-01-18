<template>
<div id="main">
  <div class="row">
    <div class="col-md-8 col-12">
      <div class="card">
        <div class="card-header"><h4 class="title">Set proxy</h4></div>
        <div class="card-body">
          <form>
            <div class="row">
              <div class="col-12">
                <fg-input label="Account name" :value="getAccountName" maxlength="12" readonly></fg-input>
              </div>
            </div>

            <div class="row">
              <div class="col text-center">
                <p-button @click="onSetProxy" type="primary">Set Account</p-button>
              </div>
            </div>
            <div class="row"><TextActionAgree/></div>
          </form>
        </div>
      </div>
    </div>
    <div class="col-md-4 col-12">
      <div class="card">
        <div class="card-header"><h4 class="title">Help</h4></div>
        <div class="card-body pb-4">
          <div>Using a proxy option you can vote on behalf of others who set you as their proxy. Please fill in the proxy info that you want to assign. To resign a proxy you just cancel the weight and ability to vote on behalf of others who set you as their proxy.</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import bl from '@/bl';
import { mapState, mapGetters, mapActions } from 'vuex';
import ActionType from '@/store/constants';

export default {
  name: 'SetProxy',
  computed: {
    ...mapState([
      'eos',
      'transaction',
    ]),
    ...mapGetters([
      'getAccountName',
      'getAuthority',
    ]),
  },
  methods: {
    ...mapActions([
      ActionType.SET_TRANSACTION,
    ]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    onSetProxy() {
      if (!this.eos) {
        bl.logInPopUP();
        return;
      }
      this.eos.transaction(
        {
          actions: [
            {
              account: 'eosio',
              name: 'regproxy',
              authorization: [{
                actor: this.getAccountName,
                permission: this.getAuthority,
              }],
              data: {
                proxy: this.getAccountName,
                isproxy: 1,
              },
            },
          ],
        },
      )
        .then((res) => {
          console.debug(`${this.$options.name} RESULT`, res);
          this[ActionType.SET_TRANSACTION](res);
          bl.renderJSON(res, 'place-for-transaction');
        })
        .catch((e) => {
          this[ActionType.SET_TRANSACTION](e);
          bl.handleError(e, 'place-for-transaction');
        });
    },
  },
};
</script>

<style scoped>
</style>
