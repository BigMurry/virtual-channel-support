module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'virtualchannels',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      tokenContract: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      depositA: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      depositB: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      balanceA: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      balanceB: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      agentA: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      agentB: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      ingrid: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      subchanAtoI: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      subchanBtoI: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      validity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM(
          'Empty',
          'Closing',
          'WaitingToClose',
          'ClosingFinal',
          'Timeouted',
          'Closed'
        ),
        allowNull: false
      },
      latestNonce: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      tableName: 'virtualchannels',
      timestamps: false
    }
  )
}
