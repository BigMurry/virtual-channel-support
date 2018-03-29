module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'transactions',
    {
      channelId: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: true
      },
      sigA: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      sigB: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      balanceA: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      balanceB: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      nonce: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      currentState: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'transactions',
      timestamps: true
    }
  )
}
