const { getChannelManager } = require('../web3')
const { getModels } = require('../models')

module.exports = async stateUpdateObject => {
  const channelManager = getChannelManager()
  const isValid = await channelManager.isValidStateUpdate(
    stateUpdateObject.channelId,
    stateUpdateObject.nonce,
    stateUpdateObject.balanceA,
    stateUpdateObject.balanceB,
    stateUpdateObject.sigA,
    stateUpdateObject.sigB
  )
  console.log('isValid: ', isValid)
  return isValid
}
