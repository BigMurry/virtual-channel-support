const Web3 = require('web3')
const artifacts = require('../artifacts/ChannelManager.json')

let web3
let channelManager

module.exports.initWeb3 = async () => {
  let accountAddress
  if (process.env.ETH_LOCAL) {
    console.log('Connecting to local ETH node')

    web3 = new Web3('ws://localhost:9545')
    accountAddress = await web3.eth.getAccounts()[0]
    console.log('accountAddress: ', accountAddress)
  } else {
    if (!process.env.ETH_KEY) {
      throw new Error(
        'No ETH private key detected, please configure one in the environment settings.'
      )
    }
    console.log(`Connecting to ETH node at ${process.env.ETH_NODE_URL}`)
    web3 = new Web3(process.env.ETH_NODE_URL)
    const account = web3.eth.accounts.privateKeyToAccount(process.env.ETH_KEY)
    web3.eth.accounts.wallet.add(account)
    accountAddress = web3.eth.accounts.wallet[0].address
    console.log('accountAddress: ', accountAddress)
  }
  const balance = await web3.eth.getBalance(accountAddress)
  console.log('balance: ', balance)
}

module.exports.getWeb3 = () => {
  if (!web3) {
    throw new Error('Problem connecting to web3')
  } else {
    return web3
  }
}

module.exports.initChannelManager = async channelManagerAddress => {
  if (!web3) {
    throw new Error('Web3 not found')
  } else {
    channelManager = new web3.eth.Contract(artifacts.abi, channelManagerAddress)
  }
}

module.exports.getChannelManager = () => {
  if (!channelManager) {
    throw new Error('Problem initializing contract')
  } else {
    return channelManager
  }
}
