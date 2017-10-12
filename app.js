require('dotenv').config()

const express = require('express')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
Handlebars.registerHelper('moment', require('helper-moment'));

const bodyParser = require('body-parser')
const app = express()
// const session = require('express-session')
// const flash = require('connect-flash')
// const passport = require('./config/passport')
// const methodOverride = require('method-override')

app.use(express.static('public'))
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

require('./server/routes/routes')(app)

// assuming logged in, findAll in taskController
// app.get('/', taskController.findAll)

// app.use('/task', taskRoute)

app.listen(process.env.PORT || 3000)
console.log('Server UP at localhost:3000')

module.exports = app
