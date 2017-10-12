const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const passport = require('../config/passport')

router.route('/register')
  .get(function (req, res) {
    res.render('userAuth/register')
  })
  .post(userController.create, passport.authenticate('local', {
    successRedirect: '/favrecipe',
    failureRedirect: '/userAuth/login'
  }))

router.route('/login')
    .get(userController.authenticateUser, function (req, res) {
      res.render('userAuth/login', {loginflash: req.flash('message')})
    })
    .post(passport.authenticate('local', {
      successRedirect: '/favrecipe',
      failureFlash: true,
      failureRedirect: '/userAuth/login'
    }))

router.get('/logout', function (req, res) {
  req.logout()
  console.log('logged out')
  res.redirect('/')
})

module.exports = router
