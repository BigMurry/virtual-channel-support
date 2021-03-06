const { asyncRequest } = require('../util')
const { param, body, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const verifyStateUpdate = require('../helpers/verifyVirtualStateUpdate')

const validator = [
  param('id', 'Please provide channelId.').exists(),
  body('nonce', 'Please provide nonce.').exists(),
  body('balanceA', 'Please provide balanceA.').exists(),
  body('balanceB', 'Please provide balanceB.').exists(),
  body('sigA', 'Please provide sigA.').exists(),
  body('sigB', 'Please provide sigB.').exists(),
  body('requireSigA', 'Please provide requireSigA.').exists(),
  body('requireSigB', 'Please provide requireSigB.').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const {
    id,
    nonce,
    balanceA,
    balanceB,
    sigA,
    sigB,
    requireSigA,
    requireSigB
  } = matchedData(req)

  const { VirtualTransaction, VirtualChannel } = getModels()

  const channel = await VirtualChannel.findById(id.toLowerCase())
  if (!channel) {
    return res.status(404).json({ error: 'No channel with that id' })
  }

  if (channel.status !== 'Opened') {
    return res.status(404).json({ error: 'Virtual channel status invalid' })
  }

  if (!requireSigA && !requireSigB) {
    return res.status(400).json({
      error:
        'At least one signature required for a valid state update proposal'
    })
  }

  const stateObject = {
    virtualchannelId: id,
    nonce,
    balanceA,
    balanceB,
    sigA,
    sigB,
    requireSigA,
    requireSigB
  }

  const verified = await verifyStateUpdate(stateObject)
  if (verified) {
    await VirtualTransaction.build(stateObject).save()
    channel.latestNonce = nonce
    await channel.save()
    return res
      .status(200)
      .json({ message: 'Proposed state update received and validated' })
  } else {
    return res.status(400).json({ error: 'Invalid state update provided' })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
