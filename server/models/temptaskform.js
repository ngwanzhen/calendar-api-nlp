'use strict'
module.exports = (sequelize, DataTypes) => {
  const tempTaskForm = sequelize.define('tempTaskForm', {
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

  tempTaskForm.associate = (models) => {
    tempTaskForm.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      allowNull: false
    })
  }

  return tempTaskForm
}
