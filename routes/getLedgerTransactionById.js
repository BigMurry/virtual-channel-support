const { asyncRequest } = require('../util')
const { param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')

const validator = [param('id', 'Please provide transaction ID.').exists()]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', errors: errors.mapped() })
  }
  const { id } = matchedData(req)

  const { Transaction, Channel } = getModels()
  const ledgerTransaction = await Transaction.findById(id, {
    include: [{ model: Channel }]
  })

  if (!ledgerTransaction) {
    res
      .status(404)
      .json({ status: 'error', message: 'Could not find channel.' })
  } else {
    res.status(200).json({ status: 'error', data: { ledgerTransaction } })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
