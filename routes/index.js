const test = require('./test')

module.exports = app => {
  // testing
  app.route('/test').get(test.handler)
}
