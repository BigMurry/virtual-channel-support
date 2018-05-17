module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'channels',
    {
      id: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
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
      agentA: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      agentB: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      challenge: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('open', 'joined', 'challenge', 'closed'),
        allowNull: false
      },
      latestNonce: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      latestOnChainNonce: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      closeTime: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      challengeStartedBy: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      channelManagerAddress: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'channels',
      timestamps: false
    }
  )
}
