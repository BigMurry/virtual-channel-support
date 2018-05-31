const { asyncRequest } = require('../util')
const { body, param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const Ethcalate = require('../../ethcalate-testing/src/src')

const validator = [param('id').exists(), body('status').exists()]

async function verifyAllCerts (vc) {
  const { Certificate } = getModels()
  const {
    id,
    agentA,
    agentB,
    ingrid,
    depositA,
    depositB,
    subchanAtoI,
    subchanBtoI,
    closingTimeSeconds
  } = vc
  const found = {
    [agentA]: false,
    [agentB]: false,
    [ingrid]: false
  }
  const certs = await Certificate.findAll({
    where: {
      virtualchannelId: id
    }
  })
  certs.forEach(cert => {
    let sigParams
    switch (cert.from) {
      case agentA:
        sigParams = {
          id,
          agentA,
          agentB,
          ingrid,
          participantType: 'agentA',
          depositInWei: depositA,
          subchanAtoI,
          subchanBtoI,
          closingTimeSeconds
        }
        break
      case agentB:
        sigParams = {
          id,
          agentA,
          agentB,
          ingrid,
          participantType: 'agentB',
          depositInWei: depositB,
          subchanAtoI,
          subchanBtoI,
          closingTimeSeconds
        }
        break
      case ingrid:
        sigParams = {
          id,
          agentA,
          agentB,
          ingrid,
          participantType: 'ingrid',
          depositInWei: '0',
          subchanAtoI,
          subchanBtoI,
          closingTimeSeconds
        }
        break
    }
    const signer = Ethcalate.recoverSignerFromOpeningCerts(cert.sig, sigParams)
    if (signer === cert.from) {
      found[signer] = true
    } else {
      console.log(`Found invalid cert id: ${cert.id}`)
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
    return res.status(422).json({ status: 'error', errors: errors.mapped() })
  }
  const { id, status } = matchedData(req)

  const { VirtualChannel } = getModels()

  const vc = await VirtualChannel.findById(id)
  if (!vc) {
    res.status(404).json({
      status: 'error',
      message: 'Could not find Virtual Channel'
    })
  }

  switch (status) {
    case 'opened':
      if (await verifyAllCerts(vc)) {
        vc.status = 'Opened'
        await vc.save()
      }
      break
  }

  res.status(200).json({
    status: 'success',
    data: { virtualChannel: { id } }
  })
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
