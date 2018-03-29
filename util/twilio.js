const accountSid = 'ACfc3a9f279537597f8c0b80a7380b3edc'
const authToken = '2812f5715bf2834efeae62024877fdd8'

const client = require('twilio')(accountSid, authToken)

module.exports = client
