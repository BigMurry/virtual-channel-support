const Sequelize = require('sequelize')

console.log(
  `Connecting to db at ${process.env.RDS_HOSTNAME}, using ${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}, table name: ${process.env.RDS_DB_NAME}`
)

let sequelize
let User
let Metrics

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
  User = sequelize.import('../models/user.model.js')
  Metrics = sequelize.import('../models/metrics.model.js')

  if (process.env.INIT_DB) {
    await User.sync()
    if (process.env.INIT_METRICS) {
      await Metrics.sync()
      await Metrics.build({
        id: 1,
        apicounter: 0,
        cardvolume: 0,
        cardcounter: 0,
        ethvolume: 0,
        ethcounter: 0
      }).save()
    }
  }
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
    Metrics
  }
}
