'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // id: {
    //   allowNull: false,
    //   autoIncrement: true,
    //   primaryKey: true,
    //   type: DataTypes.INTEGER
    // },
    username: {
      type: DataTypes.STRING,
      isUnique: true,
      allowNull: false
      // validate: {
      //   isEmail: true
      // }
    },
    password: {
      type: DataTypes.STRING
    }
  })

  User.associate = (models) => {
    User.hasMany(models.tempTaskForm, {
      foreignKey: 'tempTaskFormId',
      as: 'tempTaskForm'
    })
    User.hasMany(models.Task, {
      foreignKey: 'taskId',
      as: 'task'
    })
  }
  return User
}
