const test = require('./test')
const updateState = require('./updateState')
const getState = require('./getState')

module.exports = app => {
  app.route('/test').get(test.handler)
  app
    .route('/latestState')
    .post('updateState.validator')
    .post('updateState.handler')
  app
    .route('/latestState')
    .get('getState.validator')
    .get('getState.handler')
}
