const { asyncRequest } = require('../util')
const { body, param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const verifyStateUpdate = require('../helpers/verifyVirtualStateUpdate')
const Ethcalate = require('../../ethcalate-testing/src/src')

const validator = [
  param('id', 'Please provide channelId.').exists(),
  body('sig', 'Please provide valid signature.').exists(),
  body(
    'vcBalanceA',
    'Please provide virtual channel balance for agent A.'
  ).exists(),
  body(
    'vcBalanceB',
    'Please provide virtual channel balance for agent B.'
  ).exists(),
  body('isAgentA', 'Please indicate who needs to sign.').exists(),
  body('nonce', 'Please provide.').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const { id, sig, vcBalanceA, vcBalanceB, isAgentA } = matchedData(req)

  const { VirtualChannel, VirtualTransaction } = getModels()

  const virtualChannel = await VirtualChannel.findById(id, {
    include: [
      {
        model: VirtualTransaction,
        required: false,
        order: [['nonce', 'desc']]
      }
    ]
  })

  if (!virtualChannel) {
    return res.status(500).json({ error: 'No channel with that id' })
  }
  // decompose into AI and BI LC updates
  // INSERT RAHUL'S CODE HERE

  // sign ledger update as vc A

  // ping ingrid

  return res.status(200).json({
    message: 'Virtual channel checkpointed',
    vcBalanceA,
    vcBalanceB,
    isAgentA,
    sig,
    virtualChannel
  })
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
