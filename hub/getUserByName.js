const { asyncRequest } = require('../util')
const { param, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')

const validator = [param('name', 'Please provide address.').exists()]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }

  const { name } = matchedData(req)
  const { User } = getModels()
  const result = await User.findOne({
    where: { name }
  })
  if (!result) {
    res.status(404).json({ error: 'Error fetching from db.' })
  } else {
    res.status(200).json({ result })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
