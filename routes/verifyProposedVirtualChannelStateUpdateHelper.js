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
  const channel = await VirtualChannel.findById(virtualchannelId.toLowerCase())
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
  if (requireSigA) {
    if (sigA) {
      signer = Ethcalate.recoverDataFromProposedStateUpdate(sigA, {
        id: virtualchannelId.toLowerCase(),
        nonce: nonce.toString(),
        balanceA,
        balanceB
      })
      if (signer !== channel.agentA) {
        console.log('Incorrect signer detected for proposed state.')
        return false
      }
    } else {
      console.log('Missing required signature (sigA).')
      return false
    }
  }
  if (requireSigB) {
    if (sigB) {
      signer = Ethcalate.recoverDataFromProposedStateUpdate(sigB, {
        id: virtualchannelId.toLowerCase(),
        nonce: nonce.toString(),
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
  // valid state update params are sent to an active channel?
  if (
    Number(balanceA) + Number(balanceB) !==
    Number(channel.depositA) + Number(channel.depositB)
  ) {
    console.log('Balances do not add to deposits')
    return false
  } else if (nonce <= channel.nonce) {
    console.log('Nonce must be greater than latest channel noncce.')
    return false
  } else if (channel.status !== 'Opened') {
    console.log('Virtual channel cannot accept state updates at this time.')
    return false
  }

  return true
}
