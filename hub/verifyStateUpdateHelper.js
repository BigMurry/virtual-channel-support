const { getChannelManager, getWeb3 } = require('../web3')

module.exports = async ({
  channelId,
  nonce,
  balanceA,
  balanceB,
  sigA,
  sigB,
  requireSigA,
  requireSigB
}) => {
  const channelManager = getChannelManager()
  const isValid = await channelManager.isValidStateUpdate.call(
    channelId,
    nonce,
    balanceA,
    balanceB,
    sigA,
    sigB,
    requireSigA,
    requireSigB
  )
  return isValid
}
