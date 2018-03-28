const { asyncRequest } = require('../util')
const { query, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const { Op } = require('sequelize')

const validator = [
  query('address1', 'Please provide address1.').exists(),
  query('address2', 'Please provide address2.').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }

  const { address1, address2 } = matchedData(req) 
  
  const { Channel } = getModels()
  const result = await Channel.findOne({
  	where: {
      [Op.and]: [{address1}, {address2}]
    }
  })
  if (!result) {
  	res.status(500).json({ error: 'Error fetching from db.' })
  } else {
    res.status(200).json({ channelID: result.channelID })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
