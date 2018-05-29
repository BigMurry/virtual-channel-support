const { asyncRequest } = require('../util')
const { body, param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const Ethcalate = require('../../ethcalate-testing/src/src')

const validator = [
  param('id').exists(),
  param('cid').exists(),
  body('sig').exists(),
  body('from').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const { id, sig, from, cid } = matchedData(req)

  const { VirtualChannel, Certificate } = getModels()

  const vc = await VirtualChannel.findById(id)
  if (!vc) {
    return res.status(404).json({
      message: 'Could not find Virtual Channel'
    })
  }
  const cert = await Certificate.findById(cid)
  if (!cert) {
    return res.status(404).json({
      message: 'Could not find Certificate'
    })
  }

  let signer = Ethcalate.recoverSignerFromOpeningCerts(sig, vc)
  // verify cert was signed by someone in the channel
  if (
    signer === from.toLowerCase() &&
    (signer === vc.agentA || signer === vc.agentB || signer === vc.ingrid)
  ) {
    cert.sig = sig || cert.sig
    await cert.save()
    return res.status(200).json({
      id,
      cid
    })
  } else {
    return res.status(400).json({
      message: 'Signer was not one of the virtual channel participants'
    })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
