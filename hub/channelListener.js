const { getChannelManager } = require('../web3')
const { getModels } = require('../models')

async function processChannelOpen ({
  channelId,
  agentA,
  agentB,
  tokenContract,
  depositA,
  challenge,
  channelManagerAddress
}) {
  const { User, Channel } = getModels()

  const channel = await Channel.findById(channelId)
  if (!channel) {
    let agent = await User.findById(agentA.toLowerCase())
    if (!agent) {
      await User.build({
        address: agentA.toLowerCase()
      }).save()
    }

    agent = await User.findById(agentB.toLowerCase())
    if (!agent) {
      await User.build({
        address: agentB.toLowerCase()
      }).save()
    }

    await Channel.build({
      id: channelId.toLowerCase(),
      tokenContract: tokenContract.toLowerCase(),
      depositA: depositA.toString(),
      depositB: 0,
      agentA: agentA.toLowerCase(),
      agentB: agentB.toLowerCase(),
      challenge: challenge.toString(),
      status: 'open',
      latestNonce: 0,
      channelManagerAddress
    }).save()
  }
}

async function processChannelJoin ({ channelId, depositB }) {
  const { Channel } = getModels()
  // check if channel exists
  let channel = await Channel.findById(channelId.toLowerCase())
  if (channel) {
    channel.depositB = depositB.toString()
    channel.status = 'joined'
    await channel.save()
  }
}

async function processChannelChallenge ({
  channelId,
  closeTime,
  challengeStartedBy
}) {
  const { Channel } = getModels()
  // check it channel exists
  let channel = await Channel.findById(channelId.toLowerCase())
  if (channel) {
    channel.status = 'challenge'
    channel.closeTime = closeTime
    channel.challengeStartedBy = challengeStartedBy.toLowerCase()
    await channel.save() // not updating the closeTime
    // TODO attempt to tell user through phone
  }
}

async function processChannelUpdateState ({ channelId, nonce }) {
  const { Channel } = getModels()
  // check it channel exists
  let channel = await Channel.findById(channelId.toLowerCase())
  if (channel) {
    channel.latestOnChainNonce = nonce
    if (nonce > channel.nonce) {
      // this will need to get flagged on the front end
      channel.latestNonce = nonce
    }
    await channel.save()
    // TODO attempt to tell user through phone
  }
}

async function processChannelClose ({ channelId }) {
  const { Channel } = getModels()
  // check it channel exists
  let channel = await Channel.findById(channelId.toLowerCase())
  if (channel) {
    channel.status = 'closed'
    await channel.save()
    // TODO attempt to tell user through phone
  }
}

module.exports = async contractAddress => {
  const channelManager = getChannelManager()

  channelManager.events.allEvents(async (err, event) => {
    if (err) {
      console.log(err)
      return
    }
    const channelAttributes = {
      ...event.returnValues,
      channelManagerAddress: channelManager.options.address.toLowerCase()
    }
    switch (event.event) {
      case 'ChannelOpen':
        console.log('caught ChannelOpen', channelAttributes)
        await processChannelOpen(channelAttributes)
        break
      case 'ChannelJoin':
        console.log('caught ChannelJoin', channelAttributes)
        await processChannelJoin(channelAttributes)
        break
      case 'ChannelChallenge':
        console.log('caught ChannelChallenge', channelAttributes)
        await processChannelChallenge(channelAttributes)
        break
      case 'ChannelUpdateState':
        console.log('caught ChannelUpdateState', channelAttributes)
        await processChannelUpdateState(channelAttributes)
        break
      case 'ChannelClose':
        console.log('caught ChannelClose', channelAttributes)
        await processChannelClose(channelAttributes)
        break
    }
  })

  // TODO change this to update db and change the fromBlock
  channelManager
    .getPastEvents('allEvents', { fromBlock: 0 })
    .then(async events => {
      events.map(async event => {
        const channelAttributes = {
          ...event.returnValues,
          channelManagerAddress: channelManager.options.address.toLowerCase()
        }
        switch (event.event) {
          case 'ChannelOpen':
            console.log('Found ChannelOpen', channelAttributes)
            await processChannelOpen(channelAttributes)
            break
          case 'ChannelJoin':
            console.log('Found ChannelJoin', channelAttributes)
            await processChannelJoin(channelAttributes)
            break
          case 'ChannelChallenge':
            console.log('Found ChannelChallenge', channelAttributes)
            await processChannelChallenge(channelAttributes)
            break
          case 'ChannelUpdateState':
            console.log('Found ChannelUpdateState', channelAttributes)
            await processChannelUpdateState(channelAttributes)
            break
          case 'ChannelClose':
            console.log('Found ChannelClose', channelAttributes)
            await processChannelClose(channelAttributes)
            break
        }
      })
    })
}
