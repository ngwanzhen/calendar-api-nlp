const taskController = require('../controllers/controller').task
const tempTaskFormController = require('../controllers/controller').tempTaskForm
const userController = require('../controllers/authcontroller.js')
// const userController = require('../controllers/controller').user
const passport = require('passport')
const jwt = require('jsonwebtoken');

module.exports = (app) => {
  // basic routes
  app.get('/', taskController.list)

  // app.get('/', userController.isLoggedIn, taskController.day)
  app.get('/task', userController.isLoggedIn, taskController.list)

  app.post('/task/form', tempTaskFormController.tempFormPost)
  app.get('/task/form', userController.isLoggedIn, tempTaskFormController.tempFormGet)

  app.post('/task/add', userController.isLoggedIn, taskController.create)
  app.post('/task/keyword', userController.isLoggedIn, taskController.findWord)
  app.post('/task/time', userController.isLoggedIn, taskController.findTime)

  // additional routes for front end to create day / month view
  app.get('/task/day', taskController.day)
  // app.get('/task/day', userController.isLoggedIn, taskController.day)
  app.get('/task/month', userController.isLoggedIn, taskController.month)
  // app.get('/task/list', userController.isLoggedIn, taskController.list)
  app.get('/task/list', taskController.list)
  app.get('/task/remind', userController.isLoggedIn, taskController.remind)

  // // user Auth routes
  // app.get('/userAuth/register', userController.signup)
  // app.get('/userAuth/login', userController.signin)
  // app.get('/userAuth/logout', userController.logout)
  // app.post('/userAuth/register', (req, res, next) => {
  //   passport.authenticate('local-signup', {session: false}, (err, user, info) => {
  //     console.log('user here', JSON.stringify(user))
  //     if (err || !user) {
  //       console.log('err here', err, user, info)
  //       return res.status(400).json({
  //         message: info.message,
  //         user: user
  //       });
  //     }
  //     req.login(user, {session: false}, (err) => {
  //       if (err) {
  //         res.send(err);
  //       }
  //       // generate a signed son web token with the contents of user object and return it in the response
  //       console.log('user', user)
  //       const token = jwt.sign(user.toJSON(), 'your_jwt_secret');
  //       return res.json({user, token});
  //     });
  //   })(req, res);
  // });
  // app.post('/userAuth/login', (req, res, next) => {
  //   passport.authenticate('local-signin', {session: false}, (err, user, info) => {
  //     if (err || !user) {
  //       console.log('err here', err)
  //       return res.status(400).json({
  //         message: 'Something is not right',
  //         user: user
  //       });
  //     }
  //     req.login(user, {session: false}, (err) => {
  //       if (err) {
  //         res.send(err);
  //       }
  //       // generate a signed son web token with the contents of user object and return it in the response
  //       console.log('user', user)
  //       const token = jwt.sign(user, 'your_jwt_secret');
  //       return res.json({user, token});
  //     });
  //   })(req, res);
  // });
  // app.post('/userAuth/register', passport.authenticate('local-signup', {
  //   successRedirect: '/task/day',
  //   failureRedirect: '/userAuth/register'
  // }))
  // app.post('/userAuth/login', passport.authenticate('local-signin', {
  //   successRedirect: '/task/day',
  //   failureRedirect: '/userAuth/register'
  // }
  // ))
}
