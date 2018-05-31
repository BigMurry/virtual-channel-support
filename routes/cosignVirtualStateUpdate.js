const { asyncRequest } = require('../util')
const { body, param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const verifyStateUpdate = require('../helpers/verifyVirtualStateUpdate')

const validator = [
  param('id', 'Please provide transaction ID.').exists(),
  body('id').exists(),
  body('sig').exists(),
  body('isAgentA').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', data: errors.mapped() })
  }
  const { id, sig, isAgentA } = matchedData(req)

  const { VirtualTransaction, VirtualChannel } = getModels()
  let transaction = await VirtualTransaction.findById(id, {
    include: [{ model: VirtualChannel }]
  })

  if (!transaction) {
    res
      .status(404)
      .json({ status: 'error', message: 'Could not find channel.' })
  }
  console.log('transaction:', transaction)
  // verify signature passed in is correct
  const stateObject = {
    virtualchannelId: transaction.virtualchannelId,
    nonce: transaction.nonce,
    balanceA: transaction.balanceA,
    balanceB: transaction.balanceB,
    sigA: isAgentA ? sig : transaction.sigA,
    sigB: isAgentA ? transaction.sigB : sig,
    requireSigA: isAgentA,
    requireSigB: !isAgentA
  }

  const verified = await verifyStateUpdate(stateObject)
  if (verified) {
    if (isAgentA) {
      transaction.sigA = sig
    } else {
      transaction.sigB = sig
    }
    await transaction.save()
    return res.status(200).json({ status: 'success', data: null })
  } else {
    return res
      .status(400)
      .json({ status: 'error', message: 'Invalid signature scheme detected.' })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
