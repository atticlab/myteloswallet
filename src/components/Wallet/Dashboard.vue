<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-header"><h4 class="title">Welcome to My Eos Wallet</h4></div>
        <div class="card-body">
          <div class="row">
            <div class="col-12">
              <p>You must have <a href="http://get-scatter.com/" target="_blank">Scatter</a> installed to safely and securely send transactions to the Telos Network. If you have any questions, check out our
                <a href="https://t.me/myeoswallet_support" target="_blank"> Support.</a></p>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <p>My Telos Wallet offers a free, open-source, client-oriented interface for
                transferring TLOS.</p>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <p>If you are going to <b>use Scatter</b>, we recommend Google Chrome, Opera or Mozilla Firefox.
                <br>If you are planning to <b>use Ledger</b>, we recommend using Google Chrome.
                <br>However, note that some of the wallet functions are not supported by the Ledger.
              </p>
              <p>The functions that are <b>not supported</b> by ledger:</p>
              <ul>
                <li>Create Account</li>
                <li>Set / Unset proxy</li>
                <li>Permissions</li>
                <li>Claim Rewards</li>
                <li>Register / Unregister Producer</li>
                <li>Airgrab</li>
                <li>Other actions with smart contracts different from eosio and eosio.token</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      currentComponent: 'Transfer',
    };
  },
};
</script>

<style scoped>
  .md-card p {
    margin: 5px 5px;
  }
</style>
