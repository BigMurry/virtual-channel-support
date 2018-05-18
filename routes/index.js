const test = require('./test')
const getLedgerChannelByAddresses = require('./getLedgerChannelByAddresses')
const getLedgerChannelById = require('./getLedgerChannelById')
const getVirtualChannelByAddresses = require('./getVirtualChannelByAddresses')
const getVirtualChannelById = require('./getVirtualChannelById')
const getVirtualChannels = require('./getVirtualChannels')
const createVirtualChannel = require('./createVirtualChannel')
const joinVirtualChannel = require('./joinVirtualChannel')
const getOpeningCert = require('./getOpeningCert')
const saveOpeningCert = require('./saveOpeningCert')
const updateOpeningCert = require('./updateOpeningCert')
const updateVirtualChannelStatus = require('./updateVirtualChannelStatus')
const createProposeStateUpdate = require('./createProposeStateUpdate')
const createLedgerStateUpdate = require('./createLedgerStateUpdate')
const getVirtualStateUpdate = require('./getVirtualStateUpdate')
const getLatestVirtualStateUpdate = require('./getLatestVirtualStateUpdate')
const verifyProposedVirtualChannelStateUpdate = require('./verifyProposedVirtualChannelStateUpdate')
const getVirtualTransactionById = require('./getVirtualTransactionById')
const getVirtualTransactionByChannelNonce = require('./getVirtualTransactionByChannelNonce')
const getTransactionById = require('./getTransactionById')
const getTransactionByChannelNonce = require('./getTransactionByChannelNonce')

module.exports = app => {
  // test
  app.route('/test').get(test.handler)

  // virtual channel
  app
    .route('/virtualchannel')
    .post(createVirtualChannel.validator)
    .post(createVirtualChannel.handler)

  app
    .route('/virtualchannel/id/:id/join')
    .post(joinVirtualChannel.validator)
    .post(joinVirtualChannel.handler)

  app
    .route('/virtualchannel/a/:agentA/b/:agentB')
    .get(getVirtualChannelByAddresses.validator)
    .get(getVirtualChannelByAddresses.handler)

  app
    .route('/virtualchannel/id/:id')
    .get(getVirtualChannelById.validator)
    .get(getVirtualChannelById.handler)

  app
    .route('/virtualchannel')
    .get(getVirtualChannels.validator)
    .get(getVirtualChannels.handler)

  app
    .route('/virtualchannel/id/:id/proposestateupdate')
    .post(createProposeStateUpdate.validator)
    .post(createProposeStateUpdate.handler)

  app
    .route('/virtualchannel/id/:id/proposestateupdate')
    .get(getVirtualStateUpdate.validator)
    .get(getVirtualStateUpdate.handler)

  app
    .route('/virtualchannel/id/:id/proposestateupdate/latest')
    .get(getLatestVirtualStateUpdate.validator)
    .get(getLatestVirtualStateUpdate.handler)

  app
    .route('/virtualchannel/id/:id/proposestateupdate/verify')
    .post(verifyProposedVirtualChannelStateUpdate.validator)
    .post(verifyProposedVirtualChannelStateUpdate.handler)

  // virtual transactions
  app
    .route('/virtualtransaction/:id')
    .get(getVirtualTransactionById.validator)
    .get(getVirtualTransactionById.handler)

  app
    .route('/virtualtransaction')
    .get(getVirtualTransactionByChannelNonce.validator)
    .get(getVirtualTransactionByChannelNonce.handler)

  // ledger channel
  app
    .route('/ledgerchannel/a/:agentA/b/:agentB')
    .get(getLedgerChannelByAddresses.validator)
    .get(getLedgerChannelByAddresses.handler)

  app
    .route('/ledgerchannel/id/:id')
    .get(getLedgerChannelById.validator)
    .get(getLedgerChannelById.handler)

  app
    .route('/ledgerchannel/id/:id/stateupdate')
    .post(createLedgerStateUpdate.validator)
    .post(createLedgerStateUpdate.handler)

  // ledger channel transactions
  app
    .route('/transaction/:id')
    .get(getTransactionById.validator)
    .get(getTransactionById.handler)

  app
    .route('/transaction')
    .get(getTransactionByChannelNonce.validator)
    .get(getTransactionByChannelNonce.handler)

  // certs
  app
    .route('/virtualchannel/id/:id/cert/open')
    .get(getOpeningCert.validator)
    .get(getOpeningCert.handler)

  app
    .route('/virtualchannel/id/:id/cert/open')
    .post(saveOpeningCert.validator)
    .post(saveOpeningCert.handler)

  app // Update
    .route('/virtualchannel/id/:id/cert/open/:cid')
    .post(updateOpeningCert.validator)
    .post(updateOpeningCert.handler)

  app
    .route('/virtualchannel/id/:id/status')
    .post(updateVirtualChannelStatus.validator)
    .post(updateVirtualChannelStatus.handler)
}
