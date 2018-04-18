const { asyncRequest } = require('../util')
const { body, param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const verifyStateUpdate = require('./verifyStateUpdateHelper')

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

  const { Channel } = getModels()

  const channel = Channel.findById(id)
  if (!channel) {
    return res.status(500).json({ error: 'No channel with that id' })
  }

  const stateObject = {
    channelId: id,
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
    res.status(200).json({ message: 'State valid' })
  } else {
    return res.status(500).json({ error: 'Invalid state update provided' })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
