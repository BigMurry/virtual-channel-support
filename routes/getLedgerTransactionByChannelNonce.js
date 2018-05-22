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
    return res.status(422).json({ errors: errors.mapped() })
  }
  const { channel, nonce } = matchedData(req)

  const { Transaction } = getModels()
  let transaction
  if (nonce !== '0') {
    transaction = await Transaction.findOne({
      where: {
        channelId: channel.toLowerCase(),
        nonce
      }
    })
  } else {
    transaction = await Transaction.findAll({
      where: {
        channelId: channel.toLowerCase()
      }
    })
  }

  if (!transaction) {
    res.status(404).json({ error: 'Could not find transaction.' })
  } else {
    res.status(200).json({ transaction })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
