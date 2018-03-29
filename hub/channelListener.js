const { getWeb3 } = require('../web3')
const { getModels } = require('../models')
const artifacts = require('../artifacts/ChannelManager.json')

module.exports = async contractAddress => {
  const { abi } = artifacts
  const web3 = getWeb3()
  const contract = web3.eth.contract(abi).at(contractAddress)
  const channelOpen = contract.ChannelOpen()
  const channelJoin = contract.ChannelJoin()
  const channelChallenge = contract.ChannelChallenge()
  const channelClose = contract.ChannelClose()
  const { User, Channel } = getModels()

  channelOpen.watch(async (error, result) => {
    console.log('channel opened')
    if (!error) {
      let response = result.args
      console.log('response: ', response)
      // check if channel exists
      let channel = await Channel.findOne({
        where: { channelId: response.channelId }
      })
      if (!channel) {
        // check if user exists
        let agentA = await User.findOne({
          where: { address: response.agentA }
        })
        // if not, add new user
        if (!agentA) {
          agentA = await User.build({
            address: response.agentA,
            channelIds: [response.channelId]
          }).save()
        }
        // check if user exists
        let agentB = await User.findOne({
          where: { address: response.agentB }
        })
        // if not, add new user
        if (!agentB) {
          agentB = await User.build({
            address: response.agentB,
            channelIDs: [response.channelId]
          }).save()
        }

        // create new channel DB entry
        channel = await Channel.build({
          channelId: response.channelId,
          depositA: response.depositA.toString(),
          depositB: 0,
          agentA: response.agentA,
          agentB: response.agentB,
          status: 'open',
          latestNonce: 0
        }).save()
      }
    }
  })

  channelJoin.watch(async (error, result) => {
    console.log('channel joined')
    if (!error) {
      let response = result.args
      console.log('response: ', response)
      // check if channel exists
      let channel = await Channel.findOne({
        where: { channelId: response.channelId }
      })
      if (channel) {
        channel.depositB = response.depositB.toString()
        await channel.save()
      }
    }
  })

  channelChallenge.watch(async (error, result) => {
    console.log('channel in challenge period')
    if (!error) {
      let response = result.args
      console.log('response: ', response)
      // check it channel exists
      let channel = await Channel.findOne({
        where: { channelId: response.channelId }
      })
      if (channel) {
        channel.status = 'challenge'
        await channel.save()
        // TODO attempt to tell user through phone
      }
    }
  })

  channelClose.watch(async (error, result) => {
    console.log('channel closed')
    if (!error) {
      let response = result.args
      console.log('response: ', response)
      // check it channel exists
      let channel = await Channel.findOne({
        where: { channelId: response.channelId }
      })
      if (channel) {
        channel.status = 'close'
        await channel.save()
        // TODO attempt to tell user through phone
      }
    }
  })
}
