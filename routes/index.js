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
const createVirtualStateUpdate = require('./createVirtualStateUpdate')
const createLedgerStateUpdate = require('./createLedgerStateUpdate')
const getVirtualStateUpdate = require('./getVirtualStateUpdate')
const getLatestVirtualStateUpdate = require('./getLatestVirtualStateUpdate')
const verifyVirtualStateUpdate = require('./verifyVirtualStateUpdate')
const getVirtualTransactionById = require('./getVirtualTransactionById')
const getVirtualTransactionByChannelNonce = require('./getVirtualTransactionByChannelNonce')
const getLedgerTransactionById = require('./getLedgerTransactionById')
const getLedgerTransactionByChannelNonce = require('./getLedgerTransactionByChannelNonce')
const cosignVirtualStateUpdate = require('./cosignVirtualStateUpdate')
const deltaVcNotOpened = require('./deltaVcNotOpened')
const cosignOpeningCert = require('./cosignOpeningCert')
const getNextVirtualChannelId = require('./getNextVirtualChannelId')

module.exports = app => {
  // test
  app.route('/test').get(test.handler)

  // virtual channel
  app
    .route('/virtualchannel')
    .post(createVirtualChannel.validator)
    .post(createVirtualChannel.handler)

  app.route('/virtualchannel/next').get(getNextVirtualChannelId.handler)

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
    .route('/virtualchannel/id/:id/stateupdate')
    .post(createVirtualStateUpdate.validator)
    .post(createVirtualStateUpdate.handler)

  app
    .route('/virtualchannel/id/:id/stateupdate')
    .get(getVirtualStateUpdate.validator)
    .get(getVirtualStateUpdate.handler)

  app
    .route('/virtualchannel/id/:id/stateupdate/latest')
    .get(getLatestVirtualStateUpdate.validator)
    .get(getLatestVirtualStateUpdate.handler)

  app
    .route('/virtualchannel/id/:id/stateupdate/verify')
    .post(verifyVirtualStateUpdate.validator)
    .post(verifyVirtualStateUpdate.handler)

  // virtual transactions
  app
    .route('/virtualtransaction/:id')
    .get(getVirtualTransactionById.validator)
    .get(getVirtualTransactionById.handler)

  app
    .route('/virtualtransaction')
    .get(getVirtualTransactionByChannelNonce.validator)
    .get(getVirtualTransactionByChannelNonce.handler)

  app
    .route('/virtualtransaction/:id/cosign')
    .post(cosignVirtualStateUpdate.validator)
    .post(cosignVirtualStateUpdate.handler)

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
    .route('/ledgertransaction/:id')
    .get(getLedgerTransactionById.validator)
    .get(getLedgerTransactionById.handler)

  app
    .route('/ledgertransaction')
    .get(getLedgerTransactionByChannelNonce.validator)
    .get(getLedgerTransactionByChannelNonce.handler)

  // certs
  app
    .route('/virtualchannel/id/:id/cert/open')
    .get(getOpeningCert.validator)
    .get(getOpeningCert.handler)

  app
    .route('/virtualchannel/id/:id/cert/open')
    .post(saveOpeningCert.validator)
    .post(saveOpeningCert.handler)

  app
    .route('/virtualchannel/id/:id/cert/open/cosign')
    .post(cosignOpeningCert.validator)
    .post(cosignOpeningCert.handler)

  app // Update
    .route('/virtualchannel/id/:id/cert/open/:cid')
    .post(updateOpeningCert.validator)
    .post(updateOpeningCert.handler)

  app
    .route('/virtualchannel/id/:id/status')
    .post(updateVirtualChannelStatus.validator)
    .post(updateVirtualChannelStatus.handler)

  // checks
  app
    .route('/virtualchannel/id/:id/check/notopened')
    .post(deltaVcNotOpened.validator)
    .post(deltaVcNotOpened.handler)
}
