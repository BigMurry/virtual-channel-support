module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'channels',
    {
      channelId: {
        type: DataTypes.TEXT,
        allowNull: false
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
      status: {
        type: DataTypes.ENUM('open', 'challenge', 'closed'),
        allowNull: false
      },
      latestNonce: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'channels',
      timestamps: false
    }
  )
}
