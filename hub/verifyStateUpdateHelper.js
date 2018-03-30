const { getChannelManager } = require('../web3')

module.exports = async stateUpdateObject => {
  const channelManager = getChannelManager()
  const isValid = await channelManager.isValidStateUpdate.call(
    stateUpdateObject.channelId,
    stateUpdateObject.nonce,
    stateUpdateObject.balanceA,
    stateUpdateObject.balanceB,
    stateUpdateObject.sigA,
    stateUpdateObject.sigB,
    stateUpdateObject.requireSigA,
    stateUpdateObject.requireSigB
  )
  console.log('isValid: ', isValid)
  return isValid
}
