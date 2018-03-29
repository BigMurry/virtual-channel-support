const { asyncRequest } = require('../util')
const { query, param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const { Op } = require('sequelize')

const validator = [
  param('channelId', 'Please provide channelId.').exists(),
  query('nonce', 'Please provide nonce.').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }

  const { channelId, nonce } = matchedData(req)
  const { Transaction } = getModels()
  const updates = await Transaction.findAll({
    where: {
      [Op.and]: [{ channelId }, { nonce: { [Op.gte]: nonce } }]
    }
  })
  if (!updates) {
    res.status(500).json({ error: 'Could not find any state updates' })
  } else {
    res.status(200).json({ updates })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
