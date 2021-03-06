const { asyncRequest } = require('../util')
const { param, query, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const { Op } = require('sequelize')

const validator = [
  param('id', 'Please provide channel ID.').exists(),
  query('sig', 'Please provide either "sigA" or "sigB" or both.').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const { id, sig } = matchedData(req)
  let where = {}
  if (Array.isArray(sig)) {
    sig.forEach(s => {
      where[s] = {
        [Op.ne]: ''
      }
    })
  } else {
    where[sig] = {
      [Op.ne]: ''
    }
  }

  const { VirtualTransaction, VirtualChannel } = getModels()
  const virtualChannel = await VirtualChannel.findById(id.toLowerCase(), {
    include: [
      {
        model: VirtualTransaction,
        required: false,
        limit: 1,
        order: [['nonce', 'desc']],
        where
      }
    ]
  })

  if (!virtualChannel) {
    res.status(404).json({ error: 'Could not find virtualChannel.' })
  } else {
    res.status(200).json({ channel: virtualChannel })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
