const test = require('./test')
const updateState = require('./updateState')
const getState = require('./getState')
const getChannels = require('./getChannels')
const getChannelStatus = require('./getChannelStatus')
const getChannelID = require('./getChannelID')
const updatePhone = require('./updatePhone')

module.exports = app => {
  app.route('/test').get(test.handler)
  app
    .route('/state')
    .get(getState.validator)
    .get(getState.handler)
  // app
  //   .route('/latestState')
  //   .get('getState.validator')
  //   .get('getState.handler')
  app
    .route('/getChannels')
    .get(getChannels.validator)
    .get(getChannels.handler)
  app
    .route('/getChannelStatus')
    .get(getChannelStatus.validator)
    .get(getChannelStatus.handler)
  app
    .route('/getChannelID')
    .get(getChannelID.validator)
    .get(getChannelID.handler)
  app
    .route('/updatePhone')
    .post(updatePhone.validator)
    .post(updatePhone.handler)
}
