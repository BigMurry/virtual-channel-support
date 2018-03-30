const { asyncRequest } = require('../util')
const { query, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const { Op } = require('sequelize')

const validator = [query('address', 'Please provide address.').exists()]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }

  const { address } = matchedData(req)

  const { Channel, Transaction } = getModels()
  const channels = await Channel.findAll({
    include: [
      {
        model: Transaction
      }
    ],
    where: {
      [Op.or]: [{ agentA: address }, { agentB: address }]
    }
  })
  res.status(200).json({ channels })
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
