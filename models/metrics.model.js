module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'metrics',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      apicounter: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      tableName: 'metrics',
      timestamps: true
    }
  )
}
