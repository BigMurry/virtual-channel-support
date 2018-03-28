const { getModels } = require('../models')

module.exports = async (channelID) => {
  const { Channel } = getModels()
  const result = await Channel.findOne({
  	where: { channelID }
  })
  if (!result) {
  	return null
  } else {
    return result.status
  }
}