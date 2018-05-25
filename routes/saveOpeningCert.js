const { asyncRequest } = require('../util')
const { body, param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const Ethcalate = require('../../ethcalate-testing/src/src')

const validator = [
  param('id').exists(),
  body('sig').exists(),
  body('from').exists()
]

async function verifyCertUniqueness (signer) {
  /**
   * User should have only 1 cert per open virtual channel
   * User should not have any certs with the type 'opening' when creating a new opening cert
   * */
  const { Certificate } = getModels()
  const certs = await Certificate.findAll({
    where: {
      from: signer,
      type: 'opening'
    }
  })
  return certs.length === 0
}

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
  const {
    agentA,
    agentB,
    ingrid,
    subchanAtoI,
    subchanBtoI,
    closingTimeSeconds
  } = vc
  let signer = Ethcalate.recoverSignerFromOpeningCerts(sig, {
    id: parseInt(id, 10),
    agentA,
    agentB,
    ingrid,
    participantType: 'ingrid',
    depositInWei: '0',
    subchanAtoI,
    subchanBtoI,
    closingTimeSeconds
  })
  signer = signer.toLowerCase()
  console.log('signer: ', signer)

  // verify cert was signed by someone in the channel
  if (
    signer === from.toLowerCase() &&
    signer === ingrid &&
    (await verifyCertUniqueness(signer))
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
    console.log(signer)
    return res.status(400).json({
      message: 'Signer was not one of the virtual channel participants'
    })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
