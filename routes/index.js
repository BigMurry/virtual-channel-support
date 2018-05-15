const test = require('./test')
const createVirtualChannel = require('./createVirtualChannel')

module.exports = app => {
  // testing
  app.route('/test').get(test.handler)

  // virtual channel
  app
    .route('/virtualchannel')
    .post(createVirtualChannel.validator)
    .post(createVirtualChannel.handler)
}
