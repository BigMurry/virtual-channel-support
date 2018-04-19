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
  const isValid = await channelManager.methods
    .isValidStateUpdate(
      channelId,
      nonce,
      balanceA,
      balanceB,
      sigA,
      sigB,
      requireSigA,
      requireSigB
    )
    .call({ gas: 1000000 })
  return isValid
}
