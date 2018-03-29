const test = require('./test')
const getStateUpdates = require('./getStateUpdates')
const getChannelByAddresses = require('./getChannelByAddresses')
const getChannelById = require('./getChannelById')
const getChannels = require('./getChannels')
const getUserByAddress = require('./getUserByAddress')
const updatePhone = require('./updatePhone')
const updateState = require('./updateState')
const verifyStateUpdate = require('./verifyStateUpdate')

module.exports = app => {
  app.route('/test').get(test.handler)
  app
    .route('/stateupdates')
    .get(getStateUpdates.validator)
    .get(getStateUpdates.handler)
  app.route('/state').post(updateState.validator).post(updateState.handler)
  app
    .route('/verify')
    .post(verifyStateUpdate.validator)
    .post(verifyStateUpdate.handler)
  app
    .route('/channel/:agentA/:agentB')
    .get(getChannelByAddresses.validator)
    .get(getChannelByAddresses.handler)
  app
    .route('/channel/:id')
    .get(getChannelById.validator)
    .get(getChannelById.handler)
  app.route('/channel').get(getChannels.validator).get(getChannels.handler)
  app
    .route('/user/:address')
    .get(getUserByAddress.validator)
    .get(getUserByAddress.handler)
  app.route('/phone').post(updatePhone.validator).post(updatePhone.handler)
}
