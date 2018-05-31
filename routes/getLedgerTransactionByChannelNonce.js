const { asyncRequest } = require('../util')
const { query, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')

const validator = [
  query('channel', 'Please provide channel ID.').exists(),
  query('nonce', 'Please provide nonce.').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', errors: errors.mapped() })
  }
  const { channel, nonce } = matchedData(req)

  const { Transaction } = getModels()
  let ledgerTransaction
  if (nonce !== '0') {
    ledgerTransaction = await Transaction.findOne({
      where: {
        channelId: channel.toLowerCase(),
        nonce
      }
    })
  } else {
    ledgerTransaction = await Transaction.findAll({
      where: {
        channelId: channel.toLowerCase()
      }
    })
  }

  if (!ledgerTransaction) {
    res
      .status(404)
      .json({ status: 'error', message: 'Could not find transaction.' })
  } else {
    res.status(200).json({ status: 'success', data: { ledgerTransaction } })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
