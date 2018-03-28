module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'channels',
    {
      channelID: {
        type: DataTypes.STRING,
        allowNull: false
      },
      stake1: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      stake2: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      address1: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address2: {
        type: DataTypes.STRING,
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
