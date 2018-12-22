const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const userController = require('../controllers/authController.js')

// router.get('/register', userController.signup)
// router.get('/login', userController.signin)
// router.get('/logout', userController.logout)
router.post('/register', (req, res) => {
  passport.authenticate('local-signup', {session: false}, (err, user, info) => {
    console.log('user here', JSON.stringify(user))
    if (err || !user) {
      console.log('database connection err', err, user, info)
      return res.status(400).json({
        message: info.message,
        user: user
      });
    }
    req.login(user, {session: false}, (err) => {
      if (err) {
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      console.log('user', user)
      const token = jwt.sign(user.toJSON(), 'your_jwt_secret');
      res.cookie('jwt', token)
      return res.json({user, token});
    });
  })(req, res);
});
router.post('/login', (req, res) => {
  passport.authenticate('local-signin', {session: false}, (err, user, info) => {
    if (err || !user) {
      console.log('user does not exist', err)
      return res.status(400).json({
        message: 'Something is not right',
        user: user
      });
    }
    req.login(user, {session: false}, (err) => {
      if (err) {
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      console.log('user', user)
      const token = jwt.sign(user, 'your_jwt_secret');
      let options = {
        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        // httpOnly: false, // The cookie only accessible by the web server
        // signed: true // Indicates if the cookie should be signed
        // secure: false
      }
      // res.header("Access-Control-Allow-Credentials", true);
      res.cookie('jwt', token, options) // options is optional
      return res.json({user, token});
    });
  })(req, res);
});
router.get('/cookie', function (req, res) {
  res.cookie(cookie_name, 'cookie_value').send('Cookie is set');
});

module.exports = router;

