const { asyncRequest } = require('../util')
const { param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')

const validator = [param('id', 'Please provide channel ID.').exists()]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  const { id } = matchedData(req)

  const { Channel } = getModels()
  const channel = Channel.findOne({ where: { channelId: id } })
  if (!channel) {
    res.status(500).json({ error: 'Error fetching from db.' })
  } else {
    res.status(200).json({ channel })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
