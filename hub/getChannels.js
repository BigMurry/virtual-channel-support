const { asyncRequest } = require('../util')
const { query, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')

const validator = [
  query('address', 'Please provide address.').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }

  const { address } = matchedData(req) 
  
  const { User } = getModels()
  const result = await User.find({
  	where: { address }
  })
  if (!result) {
  	res.status(500).json({ error: 'Error fetching from db.' })
  } else {
    res.status(200).json({ channelIDs: result.channelIDs })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
