const { asyncRequest, twilio } = require('../util')
const { getModels } = require('../models')

module.exports = async channel => {
  const { User } = getModels()
  const user1 = await User.findOne({ where: { address: channel.address1 } })
  const user2 = await User.findOne({ where: { address: channel.address2 } })
  const phone1 = user1.phone
  const phone2 = user2.phone

  let error1, error2

  if (phone1) {
    twilio.messages.create(
      {
        to: phone1,
        from: '+12157039437',
        body: '[For ' +
          channel.address1 +
          '] Status update for channel [channelID: ' +
          channelID +
          ']. [Status: ' +
          channel.status
      },
      (err, message) => {
        error1 = err
      }
    )
  }

  if (phone2) {
    twilio.messages.create(
      {
        to: phone2,
        from: '+12157039437',
        body: '[For ' +
          channel.address2 +
          '] Status update for channel [channelID: ' +
          channelID +
          ']. [Status: ' +
          channel.status
      },
      (err, message) => {
        error2 = err
      }
    )
  }

  if (error1 || error2) {
    return { error: error1 + ' ' + error2 }
  }
  return { success: 'State notifications sent' }
}
