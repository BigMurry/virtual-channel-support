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
    closeTime,
    balanceA, // eslint-disable-line
    balanceB, // eslint-disable-line
    challengeStartedBy
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

  let channelAttr = {
    statusEnum,
    channelManagerAddress: channelManager.options.address.toLowerCase()
  }
  // closed channel loses on chain state, don't update unless not closed
  if (channelAttr.statusEnum !== 'closed') {
    const attributes = {
      agentA: agentA.toLowerCase(),
      agentB: agentB.toLowerCase(),
      tokenContract: tokenContract.toLowerCase(),
      depositA,
      depositB,
      challenge,
      latestNonce: nonce,
      latestOnChainNonce: nonce,
      closeTime: closeTime,
      challengeStartedBy: challengeStartedBy.toLowerCase()
    }
    channelAttr = { ...channelAttr, ...attributes }
  }

  if (!channel) {
    // only overwrite nonce if channel doesnt exist
    channelAttr.latestNonce = nonce
    await channel.build(channelAttr).save()
  } else {
    // nonce in hub is more up to date than the onchain nonce
    await channel.update(channelAttr)
  }

  res.status(200).json({
    channel: channelAttr
  })
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
