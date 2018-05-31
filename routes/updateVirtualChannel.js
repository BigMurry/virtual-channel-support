const { asyncRequest } = require('../util')
const { body, param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')

const validator = [param('id').exists(), body('depositB').exists()]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', errors: errors.mapped() })
  }
  const { id, depositB } = matchedData(req)

  const { VirtualChannel } = getModels()

  const vc = await VirtualChannel.findById(id)
  if (!vc) {
    res.status(404).json({
      status: 'error',
      message: 'Could not find Virtual Channel.'
    })
  }

  vc.depositB = depositB || vc.depositB
  await vc.save()

  res.status(200).json({
    status: 'success',
    data: { virtualChannel: { id } }
  })
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
