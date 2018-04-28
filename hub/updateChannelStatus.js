const { asyncRequest } = require('../util')
const { param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const { getChannelManager } = require('../web3')

const validator = [param('id', 'Please provide channel ID.').exists()]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const { id } = matchedData(req)

  const channelManager = getChannelManager()
  const onChainChannel = await channelManager.methods.getChannel(id).call()
  console.log('onChainChannel: ', Object.values(onChainChannel))
  const [
    agentA,
    agentB,
    tokenContract,
    depositA,
    depositB,
    status,
    challenge,
    nonce,
    closeTime
  ] = Object.values(onChainChannel)

  const { Channel } = getModels()
  const channel = await Channel.findById(id.toLowerCase())
  let statusEnum
  switch (parseInt(status)) {
    case 0:
      statusEnum = 'open'
      break
    case 1:
      statusEnum = 'joined'
      break
    case 2:
      statusEnum = 'challenge'
      break
    case 3:
      statusEnum = 'closed'
      break
  }
  if (!channel) {
    // we dont have the channel in our db, build it
    await channel
      .build({
        agentA: agentA.toLowerCase(),
        agentB: agentB.toLowerCase(),
        tokenContract: tokenContract.toLowerCase(),
        depositA,
        depositB,
        challenge,
        status: statusEnum,
        latestNonce: nonce,
        latestOnChainNonce: nonce,
        closeTime: closeTime
      })
      .save()
  } else {
    // update with on chain data
    await channel.update({
      agentA: agentA.toLowerCase(),
      agentB: agentB.toLowerCase(),
      tokenContract: tokenContract.toLowerCase(),
      depositA,
      depositB,
      challenge,
      status: statusEnum,
      latestOnChainNonce: nonce,
      closeTime
    })
  }

  res.status(200).json({
    channel: {
      agentA,
      agentB,
      depositA,
      depositB,
      challenge,
      status: statusEnum,
      latestNonce: nonce,
      latestOnChainNonce: nonce,
      closeTime
    }
  })
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
