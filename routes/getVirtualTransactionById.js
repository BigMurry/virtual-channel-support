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

  const { VirtualTransaction, VirtualChannel } = getModels()
  const virtualTransaction = await VirtualTransaction.findById(id, {
    include: [{ model: VirtualChannel }]
  })

  if (!virtualTransaction) {
    res.status(404).json({ status: 'error', error: 'Could not find channel.' })
  } else {
    res.status(200).json({ status: 'success', data: { virtualTransaction } })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
