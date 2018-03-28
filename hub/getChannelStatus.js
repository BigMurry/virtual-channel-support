const { asyncRequest } = require('../util')
const { query, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const getChannelStatusHelper = require('./getChannelStatusHelper')

const validator = [
  query('channelID', 'Please provide channelID.').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }

  const { channelID } = matchedData(req) 

  const result = await getChannelStatusHelper(channelID)  
  if (!result) {
    res.status(500).json({ error: 'Error fetching from db.' })
  } else {
    res.status(200).json({status: result})
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
