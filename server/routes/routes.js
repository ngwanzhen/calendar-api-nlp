const taskController = require('../controllers/controller').task
const tempTaskFormController = require('../controllers/controller').tempTaskForm

module.exports = (app) => {
  app.get('/', (req, res) => res.render('home'))
  app.get('/task', taskController.list)

  app.post('/task/form', tempTaskFormController.tempFormPost)
  app.get('/task/form', tempTaskFormController.tempFormGet)

  app.post('/task/add', taskController.create)
  app.post('/task/keyword', taskController.findWord)
  app.post('/task/time', taskController.findTime)
}
