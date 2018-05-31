const { asyncRequest } = require('../util')
const { param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const { delta } = require('../config.json')

const validator = [param('id', 'Please provide virtual channel id.').exists()]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', errors: errors.mapped() })
  }
  const { id } = matchedData(req)

  const { VirtualChannel, Certificate } = getModels()

  const virtualChannel = await VirtualChannel.findById(id)

  if (!virtualChannel) {
    return res
      .status(404)
      .json({ status: 'error', message: 'No channel with that id.' })
  }

  const { agentA, agentB, ingrid } = virtualChannel

  let certA = await Certificate.findOne({
    where: {
      virtualchannelId: id,
      from: agentA
    }
  })

  let certB = await Certificate.findOne({
    where: {
      virtualchannelId: id,
      from: agentB
    }
  })

  let certI = await Certificate.findOne({
    where: {
      virtualchannelId: id,
      from: ingrid
    }
  })

  if (certA && certB && certI) {
    return res.status(200).json({
      message: 'Found all certs.'
    })
  } else {
    console.log(`Waiting ${delta * 1000} ms for certs to show up.`)
    virtualChannel.deltaStartTimeSeconds = Date.now() / 1000 // convert ms to s
    await virtualChannel.save()
    setTimeout(async () => {
      certA = await Certificate.findOne({
        where: {
          virtualchannelId: id,
          from: agentA
        }
      })

      certB = await Certificate.findOne({
        where: {
          virtualchannelId: id,
          from: agentB
        }
      })

      certI = await Certificate.findOne({
        where: {
          virtualchannelId: id,
          from: ingrid
        }
      })

      if (certA && certB && certI) {
        // certs found at time delta
      } else {
        virtualChannel.status = 'NotOpened'
        await virtualChannel.save()
        console.log(
          `Changed virtualChannel ID ${id} to NotOpened after time delta expired`
        )
      }
    }, delta * 1000)

    return res.status(200).json({
      status: 'success',
      message: 'Did not find certs, starting delta timer.',
      data: { delta }
    })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
