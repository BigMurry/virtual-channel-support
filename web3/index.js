const Web3 = require('web3')
const WalletProvider = require('truffle-hdwallet-provider-privkey')

let web3

module.exports.initWeb3 = () => {
  if (process.env.ETH_LOCAL) {
    console.log('Connecting to local ETH node')
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545/'))
  } else {
    if (!process.env.ETH_KEY) {
      throw new Error(
        'No ETH private key detected, please configure one in the environment settings.'
      )
    }
    const w = new WalletProvider(process.env.ETH_KEY, process.env.ETH_NODE_URL)
    web3 = new Web3(w.engine)
  }
}

module.exports.getWeb3 = () => {
  if (!web3) {
    throw new Error('Problem connecting to web3')
  } else {
    return web3
  }
}

module.exports.getAccounts = () => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}
