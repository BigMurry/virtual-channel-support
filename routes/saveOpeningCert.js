const { asyncRequest } = require('../util')
const { body, param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')

const validator = [
  param('id').exists(),
  body('data').exists(),
  body('sig').exists(),
  body('from').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const { id, data, sig } = matchedData(req)

  const { VirtualChannel, Certificate } = getModels()

  const vc = await VirtualChannel.findById(id)
  if (!vc) {
    res.status(404).json({
      message: 'Could not find Virtual Channel'
    })
  }
  // TODO check fingerprint and sig

  const certId = await Certificate.build({
    virtualchannelId: id,
    type: 'opening',
    data,
    sig
  }).save()

  res.status(200).json({
    id: certId
  })
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
