// const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy
const User = require('../models').User
const bcrypt = require('bcrypt')

module.exports = function (passport) {
  // var User = user
  const LocalStrategy = require('passport-local').Strategy
  const passportJWT = require("passport-jwt");
  const JWTStrategy = passportJWT.Strategy;
  const ExtractJWT = passportJWT.ExtractJwt;

  passport.use('local-signup', new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback

    }, function (req, username, password, done) {
      var generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      }
      User.findOne({
        where: {
          username: username
        }
      }).then(function (user) {
        if (user) {
          return done(null, false, {
            message: 'That name is already taken'
          })
        } else {
          var userPassword = generateHash(password)
          var data =
          {
            username: username,
            password: userPassword
          }
          User.create(data).then(function (newUser, created) {
            if (!newUser) {
              return done(null, false)
            }
            if (newUser) {
              return done(null, newUser)
            }
          })
        }
      })
    }
  ))

  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id).then(function (user) {
      if (user) {
        done(null, user.get())
      } else {
        done(user.errors, null)
      }
    })
  })

  passport.use('local-signin', new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, username, password, done) {
      // var User = user;
      var isValidPassword = function (userpass, password) {
        return bcrypt.compareSync(password, userpass)
      }
      User.findOne({
        where: {
          username: username
        }
      }).then(function (user) {
        if (!user) {
          return done(null, false, {
            message: 'name does not exist'
          })
        }

        if (!isValidPassword(user.password, password)) {
          return done(null, false, {
            message: 'Incorrect password.'
          })
        }

        var userinfo = user.get()
        return done(null, userinfo)
      }).catch(function (err) {
        console.log('Error:', err)

        return done(null, false, {
          message: 'Something went wrong with your Signin'
        })
      })
    }
  ))

  var cookieExtractor = function (req) {
    var token = null;
    if (req && req.headers.cookie) {
      token = req.headers.cookie.split('jwt=')[1];
    }
    console.log('token', token)
    return token;
  };

  passport.use(new JWTStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: 'your_jwt_secret'
  },
    function (jwtPayload, done) {
      console.log('jwtPayload', jwtPayload)
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      // return User.findById(jwtPayload.id)
      // .then(user => {
      // console.log('user', user)
      return done(null, jwtPayload);
      // })
      // .catch(err => {
      //   return cb(err);
      // });
    }
  ));

}

// const Sequelize = require('sequelize')
// const DataTypes = sequelize.DataTypes;
//
// const env = process.env.NODE_ENV || 'development'
// const config = require(`${__dirname}/../config/config.json`)[env]
// if (config.use_env_variable) {
//   var sequelize = new Sequelize(process.env[config.use_env_variable]);
// } else {
//   var sequelize = new Sequelize(config.database, config.username, config.password, config);
// }
// passport.serializeUser(function (user, done) {
//   done(null, user.id)
//   // console.log(user.id)
// })
//
// // Passport "deserializes" objects by taking the user's serialization (id) and looking it up in the database
// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user)
//   })
// })

// passport.use(new LocalStrategy(function (username, pass, done) {
//   User.findOne({
//     where: {
//       'username': username
//     }
//   }).then(function (user, err) {
//     if (user == null) {
//       return done(null, false, { message: 'Incorrect credentials.' })
//     }
//
//     // var hashedPassword = bcrypt.hashSync(pass, 10)
//     // console.log(hashedPassword)
//     hash = bcrypt.hashSync('123', 10)
//     // console.log(hash)
//     // console.log(bcrypt.compareSync("123", hash))
//     if (bcrypt.compareSync(pass, hash)) {
//       console.log('should pass')
//       console.log(pass)
//       console.log(user.password)
//       return done(null, user)
//     }
//
//     return done(null, false, { message: 'Incorrect credentials.' })
//   })
// }
// ))
// //     if (err) { return cb(err) }
// //     if (!user) {
// //       return cb(null, err)
// //     }
// //     if (!bcrypt.compareSync(pass, user.password)) {
// //       return cb(null, err)
// //     }
// //     return cb(null, user)
// //   })
// // }))
//
// passport.serializeUser(function (user, done) {
//   done(null, user.id)
// })
//
// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user)
//   })
// })
//
// //   {
// //   usernameField: 'username', // this configures what u termed as username
// //   passwordField: 'password', // this configures what u termed as password
// //   passReqToCallback: true // this gives ability to call back req.body
// // }, localVerify))
// //
// // // callback function that we are defining within localVerify
// // // this is triggered upon login to compare, but to see success failure processes, goes to router
// // function localVerify (req, passportEmail, password, next) {
// //   return User
// //     .findOne({
// //       where: {
// //           email: passportEmail
// //         }
// //     })
// //     .then(function (err, foundUser) {
// //       console.log(foundUser)
// //       if (err) {
// //         console.log('err', err)
// //         return next(err) // go to failureRedirect
// //       }
// //       if (!foundUser) {
// //         return next(null, err, req.flash('message', 'User does not exist'))
// //       }
// //       if (foundUser.validPassword(password)) {
// //         // console.log('success, redirect to whatever router says')
// //         next(null, foundUser) // go to successRedirect
// //       }
// //       if (!foundUser.validPassword(password)) {
// //         return next(null, err, req.flash('message', 'Oops! Wrong password!'))
// //       // to set error msg using failureFlash
// //       // next(null, err) // goes to failureRedirect
// //       }
// //     })
// // }
//
// //   email, pass, cb) {
// //   User.findOne({
// //     where: {
// //       email: email
// //     }
// //   }).then(function (user, err) {
// //     if (err) { return cb(err) }
// //     if (!user) {
// //       return cb(null, false)
// //     }
// //     if (!bcrypt.compareSync(pass, user.password)) {
// //       return cb(null, false)
// //     }
// //     console.log('strategy ran');
// //     return cb(null, user)
// //   })
// // }))
// //
// // passport.serializeUser(function (user, done) {
// //   done(null, user.id)
// // })
// //
// // passport.deserializeUser(function (id, done) {
// //   User.findById(id, function (err, user) {
// //     done(err, user)
// //   })
// // })
//
// module.exports = passport
