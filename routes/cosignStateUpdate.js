const { asyncRequest } = require('../util')
const { body, param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const { getWeb3 } = require('../web3')
const verifyStateUpdate = require('./verifyProposedVirtualChannelStateUpdateHelper')

const validator = [
  param('id', 'Please provide transaction ID.').exists(),
  body('id').exists(),
  body('sig').exists(),
  body('isAgentA').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const { id, sig, isAgentA } = matchedData(req)

  const { VirtualTransaction, VirtualChannel } = getModels()
  let transaction = await VirtualTransaction.findById(id, {
    include: [{ model: VirtualChannel }]
  })

  if (!transaction) {
    res.status(404).json({ error: 'Could not find channel.' })
  }
  console.log('transaction:', transaction)
  // recreate hash
  const web3 = getWeb3()
  const hash = web3.utils.soliditySha3(
    { type: 'bytes32', value: transaction.virtualchannelId },
    { type: 'uint256', value: transaction.nonce },
    { type: 'uint256', value: transaction.balanceA },
    { type: 'uint256', value: transaction.balanceB }
  )
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
    transaction.hash = hash
    if (isAgentA) {
      transaction.sigA = sig
    } else {
      transaction.sigB = sig
    }
    await transaction.save()
    return res
      .status(200)
      .json({ message: 'Transaction successfully cosigned' })
  } else {
    return res.status(400).json({ error: 'Invalid signature scheme detected.' })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
