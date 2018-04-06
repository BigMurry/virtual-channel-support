const test = require('./test')
const getStateUpdates = require('./getStateUpdates')
const getChannelByAddresses = require('./getChannelByAddresses')
const getChannelById = require('./getChannelById')
const getTransactionById = require('./getChannelById')
const getLatestStateUpdate = require('./getLatestStateUpdate')
const getChannels = require('./getChannels')
const getUnjoinedChannels = require('./getUnjoinedChannels')
const getUserByAddress = require('./getUserByAddress')
const getUserByName = require('./getUserbyName')
const updatePhone = require('./updatePhone')
const updateState = require('./updateState')
const updateName = require('./updateName')
const verifyStateUpdate = require('./verifyStateUpdate')

module.exports = app => {
  // testing
  app.route('/test').get(test.handler)

  // user
  app
    .route('/user/address/:address')
    .get(getUserByAddress.validator)
    .get(getUserByAddress.handler)
  app
    .route('/user/name/:name')
    .get(getUserByName.validator)
    .get(getUserByName.handler)
  app.route('/phone')
    .post(updatePhone.validator)
    .post(updatePhone.handler)
  app
    .route('/name')
    .post(updateName.validator)
    .post(updateName.handler)

  // state updates
  app
    .route('/stateupdates')
    .get(getStateUpdates.validator)
    .get(getStateUpdates.handler)
  app.route('/state')
    .post(updateState.validator)
    .post(updateState.handler)
  app
    .route('/verify')
    .post(verifyStateUpdate.validator)
    .post(verifyStateUpdate.handler)

  // channel
  app
    .route('/channel/a/:agentA/b/:agentB')
    .get(getChannelByAddresses.validator)
    .get(getChannelByAddresses.handler)
  app
    .route('/channel/id/:id')
    .get(getChannelById.validator)
    .get(getChannelById.handler)
  app
    .route('/channel')
    .get(getChannels.validator)
    .get(getChannels.handler)
  app
    .route('/channel/unjoined')
    .get(getUnjoinedChannels.validator)
    .get(getUnjoinedChannels.handler)
  app
    .route('/channel/id/:id/latest')
    .get(getLatestStateUpdate.validator)
    .get(getLatestStateUpdate.handler)

  // transaction
  app
    .route('/transaction/:id')
    .get(getTransactionById.validator)
    .get(getTransactionById.handler)
}
