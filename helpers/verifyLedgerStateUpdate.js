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
  console.log(
    `isValidStateUpdate(${channelId},
    ${nonce},
    ${balanceA},
    ${balanceB},
    ${sigA},
    ${sigB},
    ${requireSigA},
    ${requireSigB})`
  )

  let isValid
  if (process.env.ETH_LOCAL) {
    isValid = await channelManager.methods
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
      .call()
  } else {
    isValid = await web3.eth.call({
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
  }

  return isValid
}
