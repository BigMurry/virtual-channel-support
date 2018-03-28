const { asyncRequest } = require('../util')
const { query, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')
const getChannelStatusHelper = require('./getChannelStatusHelper')
const { Op } = require('sequelize')

const validator = [
  query('channelID', 'Please provide channelID.').exists(),
  query('nonce', 'Please provide nonce.').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }

  const { channelID, nonce } = matchedData(req) 
  const { Transaction } = getModels()
  const result = await Transaction.findAll({
  	where: {
      [Op.and]: [
      	{channelID}, 
      	{nonce: {[Op.gte]: nonce}}
      ]
  	}
  })
  const status = await getChannelStatusHelper(channelID)
  if(!result || !status) {
  	res.status(500).json({error: 'Error fetching from db.'})
  } else {
  	res.status(200).json({result, status})
  }

}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
