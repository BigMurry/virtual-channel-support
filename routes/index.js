const test = require('./test')
const getChannelByAddresses = require('./getChannelByAddresses')
const getChannelById = require('./getChannelById')
const getVirtualChannelByAddresses = require('./getVirtualChannelByAddresses')
const getVirtualChannelById = require('./getVirtualChannelById')
const createVirtualChannel = require('./createVirtualChannel')
const getOpeningCert = require('./getOpeningCert')
const saveOpeningCert = require('./saveOpeningCert')
const updateOpeningCert = require('./updateOpeningCert')
const updateVirtualChannelStatus = require('./updateVirtualChannelStatus')
const proposeStateUpdate = require('./proposeStateUpdate')

module.exports = app => {
  // test
  app.route('/test').get(test.handler)

  // virtual channel
  app
    .route('/virtualchannel')
    .post(createVirtualChannel.validator)
    .post(createVirtualChannel.handler)

  app
    .route('/virtualchannel/a/:agentA/b/:agentB')
    .get(getVirtualChannelByAddresses.validator)
    .get(getVirtualChannelByAddresses.handler)

  app
    .route('/virtualchannel/id/:id')
    .get(getVirtualChannelById.validator)
    .get(getVirtualChannelById.handler)

  app
    .route('/virtualchannel/id/:id/proposestateupdate')
    .post(proposeStateUpdate.validator)
    .post(proposeStateUpdate.handler)

  // ledger channel
  app
    .route('/channel/a/:agentA/b/:agentB')
    .get(getChannelByAddresses.validator)
    .get(getChannelByAddresses.handler)

  app
    .route('/channel/id/:id')
    .get(getChannelById.validator)
    .get(getChannelById.handler)

  // certs
  app
    .route('/virtualchannel/:id/cert/open')
    .get(getOpeningCert.validator)
    .get(getOpeningCert.handler)

  app
    .route('/virtualchannel/:id/cert/open')
    .post(saveOpeningCert.validator)
    .post(saveOpeningCert.handler)

  app // Update
    .route('/virtualchannel/:id/cert/open/:cid')
    .post(updateOpeningCert.validator)
    .post(updateOpeningCert.handler)

  app
    .route('/virtualchannel/:id/status')
    .post(updateVirtualChannelStatus.validator)
    .post(updateVirtualChannelStatus.handler)
}
