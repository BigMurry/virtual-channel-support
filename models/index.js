const Sequelize = require('sequelize')

console.log(
  `Connecting to db at ${process.env.RDS_HOSTNAME}, using ${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}, table name: ${process.env.RDS_DB_NAME}`
)

let sequelize
let User
let Transaction
let Channel

module.exports.connectDb = async () => {
  sequelize = new Sequelize(
    process.env.RDS_DB_NAME,
    process.env.RDS_USERNAME,
    process.env.RDS_PASSWORD,
    {
      host: process.env.RDS_HOSTNAME,
      dialect: 'postgres',
      operatorsAliases: false,
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      port: 5432,
      dialectOptions: {
        ssl: process.env.DB_SSL,
        sslrootcert: 'rds-combined-ca-bundle.pem'
      }
    }
  )
  await sequelize.authenticate()
  console.log('Connection has been established successfully.')

  // tables
  User = sequelize.import('../models/user.model.js')
  Transaction = sequelize.import('../models/transaction.model.js')
  Channel = sequelize.import('../models/channel.model.js')

  if (process.env.INIT_DB) {
    await User.sync({ force: true })
    await Transaction.sync({ force: true })
    await Channel.sync({ force: true })
  }

  // relations
  Transaction.belongsTo(Channel)
  Channel.hasMany(Transaction)
}

module.exports.getDb = () => {
  if (!sequelize) {
    throw new Error('Database connection error.')
  }
  return sequelize
}

module.exports.getModels = () => {
  return {
    User,
    Transaction,
    Channel
  }
}
