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
  const channel = await Channel.findById(channelId.toLowerCase())
  if (channel) {
    channel.depositB = depositB.toString()
    channel.status = 'joined'
    await channel.save()
  }
}

async function processChannelChallenge ({ channelId, closeTime }) {
  const { Channel } = getModels()
  // check it channel exists
  const channel = await Channel.findById(channelId.toLowerCase())
  if (channel) {
    channel.status = 'challenge'
    channel.closeTime = closeTime
    await channel.save() // not updating the closeTime
    // TODO attempt to tell user through phone
  }
}

async function processChannelUpdateState ({ channelId, nonce }) {
  const { Channel } = getModels()
  // check it channel exists
  const channel = await Channel.findById(channelId.toLowerCase())
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
  const channel = await Channel.findById(channelId.toLowerCase())
  if (channel) {
    channel.status = 'closed'
    await channel.save()
    // TODO attempt to tell user through phone
  }
}

async function processVcCloseInit ({ vcId }) {
  const { VirtualChannel } = getModels()

  const vc = await VirtualChannel.findById(vcId)
  if (vc) {
    vc.status = 'Closing'
    await vc.save()
  }
}

async function processVcCloseFinal ({ vcId }) {
  const { VirtualChannel } = getModels()

  const vc = await VirtualChannel.findById(vcId)
  if (vc) {
    vc.status = 'ClosingFinal'
    await vc.save()
  }
}

async function processVcCloseFinalTimeout ({ vcId }) {
  const { VirtualChannel } = getModels()

  const vc = await VirtualChannel.findById(vcId)
  if (vc) {
    vc.status = 'Closed'
    await vc.save()
  }
}

async function processEvent (event) {
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
    case 'VcCloseInit':
      console.log('caught VcCloseInit', event.returnValues)
      await processVcCloseInit(event.returnValues)
      break
    case 'VcCloseFinal':
      console.log('caught VcCloseFinal', event.returnValues)
      await processVcCloseFinal(event.returnValues)
      break
    case 'VcCloseFinalTimeout':
      console.log('caught VcCloseFinalTimeout', event.returnValues)
      await processVcCloseFinalTimeout(event.returnValues)
      break
  }
}

module.exports = contractAddress => {
  const channelManager = getChannelManager()

  channelManager.events.allEvents(async (err, event) => {
    if (err) {
      console.log(err)
      return
    }
    await processEvent(event)
  })

  // TODO change this to update db and change the fromBlock
  channelManager
    .getPastEvents('allEvents', { fromBlock: 0 })
    .then(async events => {
      events.map(async event => {
        await processEvent(event)
      })
    })
}
