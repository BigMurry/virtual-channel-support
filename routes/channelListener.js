const { getChannelManager } = require('../web3')
const { getModels } = require('../models')

async function processChannelOpen ({
  channelId,
  agentA,
  agentB,
  depositA,
  challenge
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
      depositA: depositA.toString(),
      depositB: 0,
      agentA: agentA.toLowerCase(),
      agentB: agentB.toLowerCase(),
      challenge: challenge.toString(),
      status: 'open',
      latestNonce: 0
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

async function processChannelChallenge ({ channelId, closeTime }) {
  const { Channel } = getModels()
  // check it channel exists
  let channel = await Channel.findById(channelId.toLowerCase())
  if (channel) {
    channel.status = 'challenge'
    channel.closeTime = closeTime.toNumber()
    await channel.save() // not updating the closeTime
    // TODO attempt to tell user through phone
  }
}

async function processChannelUpdateState ({ channelId, nonce }) {
  const { Channel } = getModels()
  // check it channel exists
  let channel = await Channel.findById(channelId.toLowerCase())
  if (channel) {
    nonce = nonce.toNumber()
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
    switch (event.event) {
      case 'ChannelOpen':
        console.log('caught ChannelOpen', event.returnValues)
        await processChannelOpen(event.returnValues)
        break
      case 'ChannelJoin':
        console.log('caught ChannelJoin', event.returnValues)
        await processChannelJoin(event.returnValues)
        break
      case 'ChannelChallenge':
        console.log('caught ChannelChallenge', event.returnValues)
        await processChannelChallenge(event.returnValues)
        break
      case 'ChannelUpdateState':
        console.log('caught ChannelUpdateState', event.returnValues)
        await processChannelUpdateState(event.returnValues)
        break
      case 'ChannelClose':
        console.log('caught ChannelClose', event.returnValues)
        await processChannelClose(event.returnValues)
        break
    }
  })

  // TODO change this to update db and change the fromBlock
  channelManager
    .getPastEvents('allEvents', { fromBlock: 0 })
    .then(async events => {
      events.map(async event => {
        switch (event.event) {
          case 'ChannelOpen':
            console.log('Found ChannelOpen', event.returnValues)
            await processChannelOpen(event.returnValues)
            break
          case 'ChannelJoin':
            console.log('Found ChannelJoin', event.returnValues)
            await processChannelJoin(event.returnValues)
            break
          case 'ChannelChallenge':
            console.log('Found ChannelChallenge', event.returnValues)
            await processChannelChallenge(event.returnValues)
            break
          case 'ChannelUpdateState':
            console.log('Found ChannelUpdateState', event.returnValues)
            await processChannelUpdateState(event.returnValues)
            break
          case 'ChannelClose':
            console.log('Found ChannelClose', event.returnValues)
            await processChannelClose(event.returnValues)
            break
        }
      })
    })
}
