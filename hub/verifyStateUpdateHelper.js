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
  const web3 = getWeb3()
  const isValid = await web3.eth.call({
    to: channelManager.address,
    data: channelManager.methods
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
      .encodeABI()
  })
  return isValid
}
