const { asyncRequest } = require('../util')

const handler = async (req, res) => {
  res.status(200).json({ status: 'success', data: null })
}

module.exports.handler = asyncRequest.bind(null, handler)
