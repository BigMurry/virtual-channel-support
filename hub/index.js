const test = require('./test')
// const key = require('./key')
// const forgotPassword = require('./forgotPassword')
// const resetTokenValid = require('./resetTokenValid')
// const resetPassword = require('./resetPassword')

module.exports = app => {
  app.route('/test').get(test.handler)
  // app.route('/key').post(key.validator).post(key.handler)
  // app
  //   .route('/forgot')
  //   .post(forgotPassword.validator)
  //   .post(forgotPassword.handler)
  // app
  //   .route('/reset/:token')
  //   .get(resetTokenValid.validator)
  //   .get(resetTokenValid.handler)
  // app
  //   .route('/reset/:token')
  //   .post(resetPassword.validator)
  //   .post(resetPassword.handler)
}
