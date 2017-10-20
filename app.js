require('dotenv').config()

const express = require('express')
const app = express()
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
// const flash = require('connect-flash')

// const methodOverride = require('method-override')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.use(session({
  secret: 'super secret',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

Handlebars.registerHelper('moment', require('helper-moment'))
// app.use(require('cookie-parser')())
app.use(express.static('public'))
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// app.use(flash())
const models = require('./server/models')
require('./server/routes/routes')(app, passport)
require('./server/config/passport')(passport, models.user)

models.sequelize.sync().then(function () {
  console.log('Database connected')
}).catch(function (err) {
  console.log(err, 'ERR database')
})

const server = app.listen(process.env.PORT || 3000)
console.log('Server UP at localhost:3000')

module.exports = {
  app,
  server
}
