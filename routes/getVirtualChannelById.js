const { asyncRequest } = require('../util')
const { param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')

const validator = [param('id', 'Please provide channel ID.').exists()]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', errors: errors.mapped() })
  }
  const { id } = matchedData(req)

  const { VirtualChannel, VirtualTransaction } = getModels()
  const virtualChannel = await VirtualChannel.findById(id.toLowerCase(), {
    include: [
      {
        model: VirtualTransaction,
        required: false,
        limit: 1,
        order: [['nonce', 'desc']]
      }
    ]
  })

  if (!virtualChannel) {
    res
      .status(404)
      .json({ status: 'error', message: 'Could not find channel.' })
  } else {
    res.status(200).json({ status: 'success', data: { virtualChannel } })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
