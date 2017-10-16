
module.exports = {

  signup (req, res) {
    res.render('userAuth/register')
  },
  signin (req, res) {
    res.render('userAuth/login')
  },
  logout (req, res) {
    req.session.destroy(function (err) {
      res.redirect('/')
    })
  },
  isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/userAuth/login')
  }

}
