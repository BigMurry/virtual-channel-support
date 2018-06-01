const { asyncRequest } = require('../util')
const { query, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const { Op } = require('sequelize')

const validator = [
  query('address', 'Please provide address.').optional(),
  query('a', 'Please provide "a".').optional(),
  query('b', 'Please provide "b".').optional()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', errors: errors.mapped() })
  }

  const { address, status, a, b } = matchedData(req)

  const { Channel, Transaction } = getModels()

  let where = {
    [Op.and]: []
  }

  if (address) {
    const addressQuery = {
      [Op.or]: [
        { agentA: address.toLowerCase() },
        { agentB: address.toLowerCase() }
      ]
    }

    where[Op.and].push(addressQuery)
  }

  if (status) {
    where[Op.and].push({ status })
  }

  if (a) {
    where[Op.and].push({ agentA: a.toLowerCase() })
  }

  if (b) {
    where[Op.and].push({ agentB: b.toLowerCase() })
  }

  // TODO MAKE THIS SCALE
  const ledgerChannel = await Channel.findAll({
    include: [
      {
        model: Transaction,
        required: false,
        limit: 1,
        order: [['nonce', 'desc']]
      }
    ],
    where
  })
  res.status(200).json({ status: 'error', data: { ledgerChannel } })
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
