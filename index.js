require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const setupRoutes = require('./routes')
const {
  initWeb3,
  initChannelManager,
  getChannelManager,
  initEthcalate
} = require('./web3')
const { connectDb } = require('./models')

// express instance
const app = express()

// bodyparser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// enable cors for all requests
app.use(cors())

// enable pre-flighting using cors middleware
app.options('*', cors())

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// API routes
app.get('/hello', function (req, res) {
  res.send('Hello World')
})

setupRoutes(app)

app.set('trust proxy', true)
app.set('trust proxy', 'loopback')

const port = process.env.PORT || 3000
const server = app.listen(port, async () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`Ethcalate Hub listening at http://${host}:${port}`)
  await connectDb()
  await initWeb3()

  const contractAddress = process.env.CONTRACT_ADDRESS
  console.log('contractAddress: ', contractAddress)

  try {
    await initChannelManager(contractAddress)
  } catch (e) {
    console.log('e: ', e)
    console.log('Could not initialize channel manager contract, aborting.')
    process.exit(1)
  }
})
if (process.env.ENVIRONMENT === 'DEV') {
  console.log('Running in DEV mode.')
}
