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
  const onChainChannel = await channelManager.getChannel.call(id)
  const [
    agentA,
    agentB,
    depositA,
    depositB,
    status,
    challenge,
    nonce,
    closeTime,
    balanceA,
    balanceB
  ] = onChainChannel
  console.log(
    'onChainChannel: ',
    agentA,
    agentB,
    depositA,
    depositB,
    status,
    challenge,
    nonce,
    closeTime,
    balanceA,
    balanceB
  )

  const { Channel } = getModels()
  const channel = await Channel.findById(id)
  let statusEnum
  switch (status.toNumber()) {
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
        agentA,
        agentB,
        depositA: depositA.toString(),
        depositB: depositB.toString(),
        challenge: challenge.toNumber(),
        status: statusEnum,
        latestNonce: nonce.toNumber(),
        latestOnChainNonce: nonce.toNumber(),
        closeTime: closeTime.toNumber()
      })
      .save()
  } else {
    // update with on chain data
    await channel.update({
      agentA,
      agentB,
      depositA: depositA.toString(),
      depositB: depositB.toString(),
      challenge: challenge.toNumber(),
      status: statusEnum,
      latestOnChainNonce: nonce.toNumber(),
      closeTime: closeTime.toNumber()
    })
  }

  res.status(200).json({ message: 'Channel updated with onchain state' })
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
