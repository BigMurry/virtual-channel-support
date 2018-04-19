const { asyncRequest } = require('../util')
const { query, param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const { Op } = require('sequelize')

const validator = [
  param('id', 'Please provide channelId.').exists(),
  query('nonce', 'Please provide nonce.').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }

  const { id, nonce } = matchedData(req)
  const { Transaction, Channel } = getModels()
  let updates = await Transaction.findAll({
    include: [{ model: Channel }],
    where: {
      [Op.and]: [
        { channelId: id.toLowerCase() },
        { nonce: { [Op.gte]: nonce } }
      ]
    },
    order: [['nonce', 'desc']]
  })
  if (!updates) {
    updates = []
  }
  res.status(200).json(updates)
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
