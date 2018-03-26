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
      },
      cardvolume: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      cardcounter: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ethvolume: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ethcounter: {
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
