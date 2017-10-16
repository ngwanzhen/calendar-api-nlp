'use strict'
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    scheduledStartDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    scheduledEndDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })

  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    })
  }

  return Task
}
