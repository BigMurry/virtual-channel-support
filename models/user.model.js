module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'users',
    {
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      channelIDs: {
        type: DataTypes.Array(DataTypes.STRING),
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'users',
      timestamps: false
    }
  )
}
