const { getChannelManager } = require('../web3')

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
    requireSigB,
    { gas: 1000000 }
  )
  return isValid
}
