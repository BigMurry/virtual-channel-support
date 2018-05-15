module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'certificates',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      virtualchannelId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'certificates',
      timestamps: true
    }
  )
}
