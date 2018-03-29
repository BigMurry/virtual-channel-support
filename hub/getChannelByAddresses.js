const { asyncRequest } = require('../util')
const { param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const { Op } = require('sequelize')

const validator = [
  param('agentA', 'Please provide agentA.').exists(),
  param('agentB', 'Please provide agentB.').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }

  const { agentA, agentB } = matchedData(req)

  const { Channel } = getModels()
  const channel = await Channel.findOne({
    where: {
      [Op.and]: [{ agentA }, { agentB }]
    }
  })
  if (!channel) {
    res.status(500).json({ error: 'Error fetching from db.' })
  } else {
    res.status(200).json({ channel })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
