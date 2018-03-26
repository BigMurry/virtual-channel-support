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
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      channelID: {
        type: DataTypes.STRING,
        allowNull: false
      },
      balance: {
        type: DataTypes.BIGINT
        allowNull: false
      }
    },
    {
      tableName: 'users',
      timestamps: false
    }
  )
}
