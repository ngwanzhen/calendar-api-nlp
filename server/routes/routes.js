const taskController = require('../controllers/controller').task
const tempTaskFormController = require('../controllers/controller').tempTaskForm
const userController = require('../controllers/authcontroller.js')
// const userController = require('../controllers/controller').user
const passport = require('passport')

module.exports = (app, passport) => {
// basic routes
  app.get('/', userController.isLoggedIn, taskController.day)
  app.get('/task', userController.isLoggedIn, taskController.list)

  app.post('/task/form', userController.isLoggedIn, tempTaskFormController.tempFormPost)
  app.get('/task/form', userController.isLoggedIn, tempTaskFormController.tempFormGet)

  app.post('/task/add', userController.isLoggedIn, taskController.create)
  app.post('/task/keyword', userController.isLoggedIn, taskController.findWord)
  app.post('/task/time', userController.isLoggedIn, taskController.findTime)

// additional routes for front end to create day / month view
  app.get('/task/day', userController.isLoggedIn, taskController.day)
  app.get('/task/month', userController.isLoggedIn, taskController.month)

// user Auth routes
  app.get('/userAuth/register', userController.signup)
  app.get('/userAuth/login', userController.signin)
  app.get('/userAuth/logout', userController.logout)
  app.post('/userAuth/register', passport.authenticate('local-signup', {
    successRedirect: '/task/day',
    failureRedirect: '/userAuth/register'
  }))
  app.post('/userAuth/login', passport.authenticate('local-signin', {
    successRedirect: '/task/day',
    failureRedirect: '/userAuth/register'
  }

))
}
