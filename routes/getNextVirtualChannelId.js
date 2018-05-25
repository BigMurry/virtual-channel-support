const { asyncRequest } = require('../util')
const { getModels } = require('../models')

const handler = async (req, res, next) => {
  const { VirtualChannel } = getModels()

  const vc = await VirtualChannel.findOne({
    order: [['id', 'DESC']]
  })
  if (!vc) {
    return res.status(200).json({
      nextId: 0
    })
  }

  return res.status(200).json({
    nextId: vc.id + 1
  })
}

module.exports.handler = asyncRequest.bind(null, handler)
