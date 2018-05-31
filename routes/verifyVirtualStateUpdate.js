const { asyncRequest } = require('../util')
const { body, param, validationResult } = require('express-validator/check')
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
  body('requireSigB', 'Please provide requireSigA.').exists()
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

  const { VirtualChannel } = getModels()

  const channel = VirtualChannel.findById(id)
  if (!channel) {
    return res
      .status(400)
      .json({ status: 'error', error: 'No channel with that id' })
  }

  const stateObject = {
    virtualchannelId: parseInt(id, 10),
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
    res.status(200).json({ status: 'success', data: null })
  } else {
    return res
      .status(400)
      .json({ status: 'error', error: 'Proposed state update is invalid.' })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
