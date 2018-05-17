const { asyncRequest } = require('../util')
const { body, param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const Ethcalate = require('../../ethcalate-testing/src/src')

const validator = [param('id').exists(), body('status').exists()]

async function verifyAllCerts (vc) {
  const { Certificate } = getModels()
  const { agentA, agentB, ingrid } = vc
  const found = {
    [agentA]: false,
    [agentB]: false,
    [ingrid]: false
  }
  const certs = await Certificate.findAll({
    where: {
      virtualchannelId: vc.id
    }
  })
  certs.forEach(cert => {
    const signer = Ethcalate.recoverSignerFromOpeningCerts(cert.sig, vc)
    switch (signer) {
      case vc.agentA:
      case vc.agentB:
      case vc.ingrid:
        found[signer] = true
        break
    }
  })
  if (found[agentA] && found[agentB] && found[ingrid]) {
    return true
  } else {
    return false
  }
}

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const { id, status } = matchedData(req)

  const { VirtualChannel } = getModels()

  const vc = await VirtualChannel.findById(id)
  if (!vc) {
    res.status(404).json({
      message: 'Could not find Virtual Channel'
    })
  }

  switch (status) {
    case 'open':
      if (await verifyAllCerts(vc)) {
        vc.status = 'Opened'
        await vc.save()
      }
      break
  }

  res.status(200).json({
    id
  })
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
