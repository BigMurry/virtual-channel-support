const { asyncRequest } = require('../util')
const { param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')

const validator = [param('id', 'Please provide transaction ID.').exists()]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const { id } = matchedData(req)

  const { VirtualTransaction, VirtualChannel } = getModels()
  const transaction = await VirtualTransaction.findById(id, {
    include: [{ model: VirtualChannel }]
  })

  if (!transaction) {
    res.status(404).json({ error: 'Could not find channel.' })
  } else {
    res.status(200).json({ transaction })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
