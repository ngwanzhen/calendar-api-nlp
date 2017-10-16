const taskController = require('../controllers/controller').task
const tempTaskFormController = require('../controllers/controller').tempTaskForm
const userController = require('../controllers/authcontroller.js')
// const userController = require('../controllers/controller').user
const passport = require('passport')

module.exports = (app, passport) => {
  app.get('/', (req, res) => res.render('home'))
  app.get('/task', userController.isLoggedIn, taskController.list)

  app.post('/task/form', tempTaskFormController.checkClash, tempTaskFormController.tempFormPost)
  app.get('/task/form', tempTaskFormController.tempFormGet)

  app.post('/task/add', taskController.create)
  app.post('/task/keyword', taskController.findWord)
  app.post('/task/time', taskController.findTime)

  app.get('/userAuth/register', userController.signup)
  app.get('/userAuth/login', userController.signin)
  app.get('/userAuth/logout', userController.logout)
  app.post('/userAuth/register', passport.authenticate('local-signup', {
    successRedirect: '/task',
    failureRedirect: '/userAuth/register'
  }))
  app.post('/userAuth/login', passport.authenticate('local-signin', {
    successRedirect: '/task',
    failureRedirect: '/userAuth/register'
  }

))

  // app.get('/userAuth/register', (req, res) => res.render('userAuth/register'))
  // app.post('/userAuth/register', passport.authenticate('local-signup', {
  //   successRedirect: '/tasks',
  //   failureRedirect: '/'
  // }))
  //
  // app.get('/userAuth/login', (req, res) => res.render('userAuth/login'))
  // app.post('/userAuth/login', passport.authenticate('local', { successRedirect: '/',
  //   failureRedirect: '/task' }))
}
