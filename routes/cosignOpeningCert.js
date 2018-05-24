const { asyncRequest } = require('../util')
const { body, param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const Ethcalate = require('../../ethcalate-testing/src/src')

const validator = [
  param('id').exists(),
  body('ingridSigA').exists(),
  body('ingridSigB').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const { id, ingridSigA, ingridSigB } = matchedData(req)

  const { VirtualChannel, Certificate } = getModels()

  const vc = await VirtualChannel.findById(id)
  if (!vc) {
    return res.status(404).json({
      message: 'Could not find Virtual Channel'
    })
  }
  const certs = await Certificate.findAll({
    where: {
      virtualchannelId: id
    }
  })
  if (!certs) {
    return res.status(404).json({
      message: 'Could not find opening certificates'
    })
  }
  if (certs.length !== 2) {
    return res.status(404).json({
      message: 'Incorrect number of certificates to cosign'
    })
  }

  certs.forEach(cert => {
    if (cert.from === vc.agentA) {
      cert.ingridSig = ingridSigA
      cert.save()
    } else if (cert.from === vc.agentB) {
      cert.ingridSig = ingridSigB
      cert.save()
    }
  })

  return res.status(200).json({
    certs
  })
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
