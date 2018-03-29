const { asyncRequest } = require('../util')
const { body, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const { getModels } = require('../models')

const validator = [
  body('phone', 'Please provide phone number.').exists(),
  body('address', 'Please provide address.').exists()
]

const handler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }

  const { phone, address } = matchedData(req)
  const { User } = getModels()
  const result = await User.findOne({
    where: { address }
  })
  if (!result || !status) {
    res.status(500).json({ error: 'Error fetching from db.' })
  } else {
    result.phone = phone
    await result.save()
    res.status(200).json({ success: 'Updated phone number' })
  }
}

module.exports.validator = validator
module.exports.handler = asyncRequest.bind(null, handler)
