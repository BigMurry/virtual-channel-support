const test = require('./test')
const createVirtualChannel = require('./createVirtualChannel')
const getOpeningCert = require('./getOpeningCert')
const saveOpeningCert = require('./saveOpeningCert')
const updateOpeningCert = require('./updateOpeningCert')
const updateVirtualChannelStatus = require('./updateVirtualChannelStatus')

module.exports = app => {
  // test
  app.route('/test').get(test.handler)

  // virtual channel
  app
    .route('/virtualchannel')
    .post(createVirtualChannel.validator)
    .post(createVirtualChannel.handler)

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
    .post(saveOpeningCert.validator)
    .post(saveOpeningCert.handler)

  app
    .route('/virtualchannel/:id/status')
    .post(updateVirtualChannelStatus.validator)
    .post(updateVirtualChannelStatus.handler)
}
