const { asyncRequest } = require('../util')
const { body, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')

const validator = [
  body('agentA').exists(),
  body('agentB').exists(),
  body('depositA').exists(),
  body('ingrid').exists(),
  body('subchanAtoI').exists(),
  body('subchanBtoI').exists(),
  body('validity').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const {
    agentA,
    agentB,
    depositA,
    ingrid,
    subchanAtoI,
    subchanBtoI,
    validity
  } = matchedData(req)

  const { VirtualChannel } = getModels()

  const { id } = await VirtualChannel.build({
    agentA: agentA.toLowerCase(),
    agentB: agentB.toLowerCase(),
    depositA,
    ingrid: ingrid.toLowerCase(),
    subchanAtoI,
    subchanBtoI,
    validity
  }).save()

  res.status(200).json({
    id
  })
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
