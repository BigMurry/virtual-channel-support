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

  const { VirtualTransaction } = getModels()
  let virtualTransaction
  if (nonce !== '0') {
    virtualTransaction = await VirtualTransaction.findOne({
      where: {
        channelId: channel.toLowerCase(),
        nonce
      }
    })
  } else {
    virtualTransaction = await VirtualTransaction.findAll({
      where: {
        channelId: channel.toLowerCase()
      }
    })
  }

  if (!virtualTransaction) {
    res
      .status(404)
      .json({ status: 'error', message: 'Could not find transaction.' })
  } else {
    res.status(200).json({ status: 'success', data: { virtualTransaction } })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
