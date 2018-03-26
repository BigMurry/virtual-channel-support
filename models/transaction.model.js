module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      channelID: {
        type: DataTypes.STRING,
        allowNull: false
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      r: {
        type: DataTypes.STRING,
        allowNull: false
      },
      s: {
        type: DataTypes.STRING,
        allowNull: false
      },
      stateSender: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      stateReciever: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      nonce: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      destinationAddress: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'transaction',
      timestamps: true
    }
  )
}
