module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'users',
    {
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      channelIds: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true
      },
      phone: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'users',
      timestamps: false
    }
  )
}
