const { asyncRequest } = require('../util')
const { query, param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')

const validator = [param('id').exists(), query('agent').optional()]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const { id, agent } = matchedData(req)

  const { VirtualChannel, Certificate } = getModels()

  const vc = await VirtualChannel.findById(id)
  if (!vc) {
    res.status(404).json({
      message: 'Could not find Virtual Channel'
    })
  }

  let where = {
    virtualchannelId: id,
    type: 'opening'
  }

  if (agent) {
    where = {
      ...where,
      from: agent
    }
  }

  const certs = await Certificate.findAll({ where })

  res.status(200).json({
    certs
  })
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
