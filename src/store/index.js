import Vue from 'vue'
import Vuex from 'vuex'
import bl from 'src/bl'
import mutations from './mutations'
import actions from './actions'
import numeral from 'numeral'
import us from 'microseconds'

Vue.use(Vuex)

const ROUND = 1

function getRestPercent(account, usage, quota) {
  if (account === null) {
    console.debug('getRestPercent(...) => (account === null) => result = "N/A"')
    return 'N/A'
  } else if (quota > 0) {
    const rest = (quota - usage) * 100
    const result = parseFloat((rest / quota).toFixed(ROUND))
    console.debug(`getRestPercent(...) => (quota) > 0) => result = ${result}`)
    return result
  }
  console.debug('getRestPercent(...) => (else) => result = 0.000')
  return 0.000
}

function getPercent(account, usage, quota) {
  if (account === null) {
    console.debug('getRestPercent(...) => (account === null) => result = "N/A"')
    return 0
  } else if (quota > 0) {
    const result = ((usage / quota) * 100).toFixed(ROUND)
    console.debug(`getPercent(...) => (quota) > 0) => result = ${result}`)
    return parseFloat(result)
  }
  console.debug('getPercent(...) => (else) => result = 0.000')
  return 0
}

function formatMicrosecond(n) {
  let parsed = us.parse(n)
  if (parsed.days) return parsed.days + ' d'
  if (parsed.hours) return parsed.hours + ' h'
  if (parsed.minutes) return parsed.minutes + ' m'
  if (parsed.seconds) return parsed.seconds + ' s'
  if (parsed.milliseconds) return parsed.milliseconds + ' ms'
  if (parsed.microseconds) return parsed.microseconds + ' μs'
  return '0 μs'
}

const state = {
  scatter: null,
  identity: null,
  identityAccount: null,
  eos: null,
  eosApi: null,
  eosAccount: null,
  balance: 0,
  transaction: null,
  tokenList: null,
  airgrabs: null,
  actionInfoPopUp: false,
  hardware: null,
  ledgerWallet: null,
  currentToken: 'TLOS',
  nodeList: [
    {
      link: 'api.telosfoundation.io',
      port: 443,
      protocol: 'https'
    },
    {
      link: 'api.eos.miami',
      port: 443,
      protocol: 'https'
    },
    {
      link: 'api.tlos.goodblock.io',
      port: 443,
      protocol: 'https'
    },
    {
      link: 'api.blindblocart.io',
      port: 443,
      protocol: 'https'
    },
    {
      link: 'telos.caleos.io',
      port: 443,
      protocol: 'https'
    },
    {
      link: 'api.telosvancouver.io',
      port: 7777,
      protocol: 'https'
    },
    {
      link: 'api.telosvenezuela.com',
      port: 443,
      protocol: 'https'
    },
    {
      link: 'telos.eos.barcelona',
      port: 443,
      protocol: 'https'
    },
    {
      link: 'telos.eosdetroit.io',
      port: 443,
      protocol: 'https'
    },
    {
      link: 'api.telosunlimited.io',
      port: 443,
      protocol: 'https'
    },
    {
      link: 'api.apac.telosglobal.io',
      port: 8888,
      protocol: 'http'
    },
    {
      link: 'api.emea.telosglobal.io',
      port: 8888,
      protocol: 'http'
    },
    {
      link: 'api.na.telosglobal.io',
      port: 8888,
      protocol: 'http'
    },
    {
      link: 'api.telos.csx.io',
      port: 8787,
      protocol: 'http'
    },
  ],
  currentNode: null,
}

state.currentNode = state.nodeList[0]

const getters = {
  eosConfig: () => ({
    blockchain: "eos",
    chainId: "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11",
    protocol: state.currentNode.protocol,
    host: state.currentNode.link,
    port: state.currentNode.port,
    httpEndpoint: state.currentNode.protocol + '://' + state.currentNode.link + ':' + state.currentNode.port,
    expireInSeconds: 60,
    broadcast: true,
    verbose: false,
    sign: true,
  }),
  // eosConfigLedger: currentState => ({
  //   blockchain: process.env.VUE_APP_BLOCKCHAIN,
  //   chainId: process.env.VUE_APP_EOS_CHAIN_ID,
  //   protocol: 'https',
  //   host: state.currentNode.slice(8),
  //   port: 443,
  //   // httpEndpoint: `${process.env.VUE_APP_EOS_PROTOCOL}://${process.env.VUE_APP_EOS_HOST}:${process.env.VUE_APP_EOS_PORT}`,
  //   httpEndpoint: state.currentNode,
  //   expireInSeconds: 60,
  //   broadcast: true,
  //   verbose: false,
  //   sign: false,
  // }),
  getAccountName: currentState => ((currentState.identityAccount) ? currentState.identityAccount.name : ''),
  getAuthority: currentState => ((currentState.identityAccount) ? currentState.identityAccount.authority : ''),
  userFullName: (currentState) => {
    let res = ''
    if (!currentState.identity || !currentState.identity.personal) {
      return res
    }
    if (currentState.identity.personal.firstname) {
      res += currentState.identity.personal.firstname
      res += ' '
    }
    if (currentState.identity.personal.lastname) {
      res += currentState.identity.personal.lastname
    }
    return res
  },
  getBalance: currentState => bl.getFirstBalance(currentState.balance),
  getTotal: currentState => bl.getFirstBalance(currentState.balance),
  getRefund: (currentState) => {
    if (currentState.eosAccount) {
      if (currentState.eosAccount.refund_request) {
        return parseFloat(currentState.eosAccount.refund_request.net_amount) + parseFloat(currentState.eosAccount.refund_request.cpu_amount)
      } else if (process.env.NODE_ENV === 'development') {
        console.debug('getStacked => eosAccount.voter_info is null...')
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.debug('getStacked => eosAccount is null...')
    }
    return 0
  },
  getStacked: (currentState) => {
    if (currentState.eosAccount) {
      if (currentState.eosAccount.voter_info) {
        if (currentState.eosAccount.voter_info.staked) {
          return currentState.eosAccount.voter_info.staked / 10000
        }
      } else if (process.env.NODE_ENV === 'development') {
        console.debug('getStacked => eosAccount.voter_info is null...')
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.debug('getStacked => eosAccount is null...')
    }
    return 0
  },
  getRamTotal: (currentState) => {
    if (!currentState.eosAccount) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('getRam => currentState.eosAccount is null...')
      }
      return 0
    }
    return numeral(currentState.eosAccount.ram_quota).format('0.0 ib')
    // return getRestPercent(
    //   currentState.eosAccount, currentState.eosAccount.ram_usage, currentState.eosAccount.ram_quota,
    // );
  },
  getRamUsed: (currentState) => {
    if (!currentState.eosAccount) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('getRam => currentState.eosAccount is null...')
      }
      return 0
    }
    return numeral(currentState.eosAccount.ram_usage).format('0.0 ib')
    // return getRestPercent(
    //   currentState.eosAccount, currentState.eosAccount.ram_usage, currentState.eosAccount.ram_quota,
    // );
  },
  getRamPercentage: (currentState) => {
    if (!currentState.eosAccount) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('getRam => currentState.eosAccount is null...')
      }
      return 0
    }
    return getPercent(
      currentState.eosAccount, currentState.eosAccount.ram_usage, currentState.eosAccount.ram_quota,
    )
  },
  getRamInBytes: (currentState) => {
    if (!currentState.eosAccount) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('getRamInBytes => currentState.eosAccount is null...')
      }
      return 0
    }
    return currentState.eosAccount.ram_quota
  },
  getFreeRamInBytes: (currentState) => {
    if (!currentState.eosAccount) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('getFreeRamInBytes => currentState.eosAccount is null...')
      }
      return 0
    }
    return currentState.eosAccount.ram_quota - currentState.eosAccount.ram_usage
  },
  getNetTotal: (currentState) => {
    if (!currentState.eosAccount) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('getNet => currentState.eosAccount is null...')
      }
      return 0
    }
    return numeral(currentState.eosAccount.net_limit.max).format('0.0 ib')
    // return getRestPercent(currentState.eosAccount, currentState.eosAccount.net_limit.used,
    //   currentState.eosAccount.net_limit.max);
  },
  getNetUsed: (currentState) => {
    if (!currentState.eosAccount) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('getNet => currentState.eosAccount is null...')
      }
      return 0
    }
    return numeral(currentState.eosAccount.net_limit.used).format('0.0 ib')
    // return getRestPercent(currentState.eosAccount, currentState.eosAccount.net_limit.used,
    //   currentState.eosAccount.net_limit.max);
  },
  getNetPercentage: (currentState) => {
    if (!currentState.eosAccount) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('getNet => currentState.eosAccount is null...')
      }
      return 0
    }
    return getPercent(currentState.eosAccount, currentState.eosAccount.net_limit.used,
      currentState.eosAccount.net_limit.max)
  },
  getCpuTotal: (currentState) => {
    if (!currentState.eosAccount) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('getCpu => currentState.eosAccount is null...')
      }
      return 0
    }
    return formatMicrosecond(currentState.eosAccount.cpu_limit.max)
    // return getRestPercent(currentState.eosAccount, currentState.eosAccount.cpu_limit.used,
    //   currentState.eosAccount.cpu_limit.max);
  },
  getCpuUsed: (currentState) => {
    if (!currentState.eosAccount) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('getCpu => currentState.eosAccount is null...')
      }
      return 0
    }
    return formatMicrosecond(currentState.eosAccount.cpu_limit.used)
    // return getRestPercent(currentState.eosAccount, currentState.eosAccount.cpu_limit.used,
    //   currentState.eosAccount.cpu_limit.max);
  },
  getCpuPercentage: (currentState) => {
    if (!currentState.eosAccount) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('getCpu => currentState.eosAccount is null...')
      }
      return 0
    }
    return getPercent(currentState.eosAccount, currentState.eosAccount.cpu_limit.used,
      currentState.eosAccount.cpu_limit.max)
  },
  getSymbol: (currentState) => {
    if (!currentState.identityAccount || !currentState.identityAccount.blockchain) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('getSymbol => currentState.identityAccount is null...')
      }
      return ''
    }
    return currentState.identityAccount.blockchain.toUpperCase()
  },
  getAccountNameWithAuthority() {
    return ''
  },
}

getters.getAccountNameWithAuthority = () => {
  if (getters.getAccountName(state) && getters.getAuthority(state)) {
    return `${getters.getAccountName(state)}@${getters.getAuthority(state)}`
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
})
