const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, localVerify))

function localVerify (req, passportEmail, password, next) {
  User
    .findOne({
      email: passportEmail
    })
    .exec(function (err, foundUser) {
      if (err) {
        console.log('err', err)
        return next(err)
      }
      if (!foundUser) {
        return next(null, err, req.flash('message', 'User does not exist'))
      }
      if (foundUser.validPassword(password)) {
        next(null, foundUser)
      }
      if (!foundUser.validPassword(password)) {
        return next(null, err, req.flash('message', 'Pls try again. Password does not match.'))
      }
    })
}

module.exports = passport
