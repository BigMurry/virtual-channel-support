const { asyncRequest } = require('../util')
const { body, param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const { getEthcalate } = require('../web3')

const validator = [
  param('id').exists(),
  body('sig').exists(),
  body('from').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const { id, sig, from } = matchedData(req)

  const { VirtualChannel, Certificate } = getModels()

  const vc = await VirtualChannel.findById(id)
  if (!vc) {
    return res.status(404).json({
      message: 'Could not find Virtual Channel'
    })
  }

  const ethcalate = getEthcalate()
  let signer = ethcalate.recoverSignerFromOpeningCerts(sig, vc)
  signer = signer.toLowerCase()

  // verify cert was signed by someone in the channel
  if (
    signer === from.toLowerCase() &&
    (signer === vc.agentA || signer === vc.agentB || signer === vc.ingrid)
  ) {
    const certId = await Certificate.build({
      virtualchannelId: id,
      type: 'opening',
      sig,
      from: signer
    }).save()

    return res.status(200).json({
      id: certId
    })
  } else {
    return res.status(400).json({
      message: 'Signer was not one of the virtual channel participants'
    })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
