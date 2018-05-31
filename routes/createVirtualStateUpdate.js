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
    return res.status(422).json({ status: 'error', errors: errors.mapped() })
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
    return res
      .status(404)
      .json({ status: 'error', message: 'No channel with that id' })
  }

  if (channel.status !== 'Opened') {
    return res
      .status(404)
      .json({ status: 'error', message: 'Virtual channel status invalid' })
  }

  if (!requireSigA && !requireSigB) {
    return res.status(400).json({
      status: 'error',
      message:
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
    return res.status(200).json({ status: 'success', data: null })
  } else {
    return res
      .status(400)
      .json({ status: 'error', message: 'Invalid state update provided' })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
