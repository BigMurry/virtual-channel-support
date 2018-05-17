const { asyncRequest } = require('../util')
const { param, body, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const Ethcalate = require('../../ethcalate-testing/src/src')

const validator = [
  param('id').exists(),
  body('depositB').exists(),
  body('cert').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const { id, depositB, cert } = matchedData(req)

  const { VirtualChannel, Certificate } = getModels()

  let vc = await VirtualChannel.findById(id)
  if (!vc) {
    return res.status(404).json({
      message: 'Virtual Channel not found'
    })
  }
  const { agentA, agentB, ingrid } = vc

  let signer = Ethcalate.recoverSignerFromOpeningCerts(cert, {
    id,
    agentA,
    agentB,
    ingrid,
    participantType: 'agentB',
    depositInWei: depositB
  })

  if (signer.toLowerCase() !== agentB) {
    return res.status(400).json({
      message: 'Opening cert not signed by agentB'
    })
  }

  const certId = await Certificate.build({
    virtualchannelId: id,
    type: 'opening',
    sig: cert,
    from: signer
  }).save()

  vc.depositB = depositB
  vc.balanceB = depositB
  await vc.save()

  res.status(200).json({
    message: `Channel joined`,
    id,
    agentB,
    depositB,
    balanceB: depositB,
    certId
  })
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
