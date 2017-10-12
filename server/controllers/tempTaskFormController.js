const tempTaskForm = require('../models').tempTaskForm

module.exports = {
  tempFormPost (req, res) {
    console.log(req.body)
    return tempTaskForm
    .create({
      title: req.body.title,
      scheduledStartDateTime: req.body.userStart,
      scheduledEndDateTime: req.body.userEnd
    })
    .then(task => res.send('ok'))
    .catch(error => res.status(400).send(error))
  },
  tempFormGet (req, res) {
    return tempTaskForm
  .all()
  .then(tempTask => res.render('task/formModal', {data: tempTask.pop()}))
  .catch(error => res.status(400).send(error))
  }
}
