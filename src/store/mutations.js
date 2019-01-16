import ActionType from './constants';

export default {
  [ActionType.SET_SCATTER]: (state, scatter) => {
    state.scatter = scatter;
  },

  [ActionType.SET_IDENTITY]: (state, identity) => {
    state.identity = identity;
  },

  [ActionType.SET_IDENTITY_ACCOUNT]: (state, identityAccount) => {
    state.identityAccount = identityAccount;
  },

  [ActionType.SET_EOS_JS]: (state, eosjs) => {
    state.eos = eosjs;
  },

  [ActionType.SET_EOS_JSAPI]: (state, eosjs) => {
    state.eosApi = eosjs;
  },

  [ActionType.SET_EOS_ACCOUNT]: (state, eosAccount) => {
    state.eosAccount = eosAccount;
  },

  [ActionType.SET_BALANCE]: (state, balance) => {
    state.balance = balance;
  },

  [ActionType.SET_TRANSACTION]: (state, transaction) => {
    let t = transaction;
    if (typeof transaction === 'string') {
      t = JSON.parse(transaction);
    }
    if (t.stack) {
      delete t.stack;
    }
    state.transaction = t;
    if (transaction) {
      state.actionInfoPopUp = true;
    }
  },

  [ActionType.SET_ACTIONINFOPOPUP]: (state, val) => {
    state.actionInfoPopUp = val;
  },

  [ActionType.LOGOUT]: (state) => {
    if (state.scatter && state.scatter.identity && state.scatter.forgetIdentity) {
      state.scatter.forgetIdentity();
    }
    state.identity = null;
    state.identityAccount = null;
    state.eos = null;
    state.eosAccount = null;
    state.balance = [];
    state.transaction = null;
    state.tokenList = null;
  },

  [ActionType.RELOGIN_SCATTER_EOS]: (state) => {
    state.identity = null;
    state.identityAccount = null;
    state.eos = null;
    state.eosAccount = null;
    state.balance = [];
    state.transaction = null;
    state.tokenList = null;
  },

  [ActionType.SET_NODE]: (state, node) => {
    state.currentNode = node;
  },
};
