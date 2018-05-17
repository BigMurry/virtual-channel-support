const { getModels } = require('../models')
const { getWeb3 } = require('../web3')
const Ethcalate = require('../../ethcalate-testing/src/src')

module.exports = async ({
  virtualchannelId,
  nonce,
  balanceA,
  balanceB,
  sigA,
  sigB,
  requireSigA,
  requireSigB
}) => {
  console.log(
    `isValidStateUpdate(${virtualchannelId},
    ${nonce},
    ${balanceA},
    ${balanceB},
    ${sigA},
    ${sigB},
    ${requireSigA},
    ${requireSigB})`
  )
  const web3 = getWeb3()
  const { VirtualChannel } = getModels()
  const channel = VirtualChannel.findById(virtualchannelId.toLowerCase())
  if (!channel) {
    console.log('No virtual channel with that ID')
    return false
  }

  // verify signer
  let signer
  if (!requireSigA && !requireSigB) {
    console.log('At least one signature required.')
    return false
  }
  if (!requireSigA) {
    if (sigA) {
      signer = Ethcalate.recoverDataFromProposedStateUpdate(sigA, {
        virtualchannelId,
        nonce,
        balanceA,
        balanceB
      })
      if (signer !== channel.agentB) {
        console.log('Incorrect signer detected for proposed state.')
        return false
      }
    } else {
      console.log('Missing required signature (sigA).')
      return false
    }
  }
  if (!requireSigB) {
    if (sigB) {
      signer = Ethcalate.recoverDataFromProposedStateUpdate(sigB, {
        virtualchannelId,
        nonce,
        balanceA,
        balanceB
      })
      if (signer !== channel.agentB) {
        console.log('Incorrect signer detected for proposed state.')
        return false
      }
    } else {
      console.log('Missing required signature (sigB).')
      return false
    }
  }
  console.log('Signer of proposed state:', signer)

  // valid state update params are sent to an active channel?
  if (balanceA + balanceB !== channel.depositA + channel.depositB) {
    console.log('Balances do not add to deposits')
    return false
  } else if (channel.status !== 'Opened') {
    console.log('channel.status:', channel.status)
    console.log('Virtual Channel cannot accept state updates in this phase.')
    return false
  } else if (nonce <= channel.nonce) {
    console.log('Nonce must be greater than latest channel noncce.')
    return false
  }

  return true
}
