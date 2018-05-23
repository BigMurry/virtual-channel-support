const { asyncRequest } = require('../util')
const { body, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const Ethcalate = require('../../ethcalate-testing/src/src')

const validator = [
  body('id').exists(),
  body('agentA').exists(),
  body('agentB').exists(),
  body('depositA').exists(),
  body('ingrid').exists(),
  body('subchanAtoI').exists(),
  body('subchanBtoI').exists(),
  body('validity').exists(),
  body('closingTimeSeconds').exists(),
  body('cert').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const {
    id,
    agentA,
    agentB,
    depositA,
    ingrid,
    subchanAtoI,
    subchanBtoI,
    validity,
    cert,
    closingTimeSeconds
  } = matchedData(req)

  const { VirtualChannel, Certificate, Channel } = getModels()

  console.log('closingTimeSeconds: ', closingTimeSeconds)

  let signer = Ethcalate.recoverSignerFromOpeningCerts(cert, {
    id,
    agentA,
    agentB,
    ingrid,
    subchanAtoI,
    subchanBtoI,
    participantType: 'agentA',
    depositInWei: depositA,
    closingTimeSeconds
  })
  if (signer.toLowerCase() !== agentA.toLowerCase()) {
    return res.status(400).json({
      message: 'Cert was not signed by agentA'
    })
  }

  // dont open VC if LC is inactive
  const lc1 = await Channel.findById(subchanAtoI)
  const lc2 = await Channel.findById(subchanBtoI)
  if (lc1.status !== 'joined' || lc2.status !== 'joined') {
    return res.status(400).json({
      message:
        'One or more of the underlying ledger channels are not in open phase.'
    })
  }

  await VirtualChannel.build({
    id,
    agentA: agentA.toLowerCase(),
    agentB: agentB.toLowerCase(),
    depositA,
    balanceA: depositA,
    ingrid: ingrid.toLowerCase(),
    subchanAtoI,
    subchanBtoI,
    validity,
    closingTimeSeconds
  }).save()

  const certId = await Certificate.build({
    virtualchannelId: id,
    type: 'opening',
    sig: cert,
    from: signer
  }).save()

  res.status(200).json({
    id,
    certId
  })
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
