module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'users',
    {
      address: {
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false
      },
      phone: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      name: {
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
