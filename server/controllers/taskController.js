const Task = require('../models').Task

module.exports = {
  list (req, res) {
    return Task
    .findAll({ order: [['scheduledStartDateTime', 'DESC']] })
    // .all()
    .then(task => res.render('task/list', {data: task}))
    .catch(error => res.status(400).send(error))
  },
  create (req, res) {
    console.log(req.body)
    return Task
      .create({
        title: req.body.title,
        scheduledStartDateTime: req.body.scheduledStartDateTime,
        scheduledEndDateTime: req.body.scheduledEndDateTime
      })
      .then(task => res.redirect('/task'))
      .catch(error => res.status(400).send(error))
  },
  findWord (req, res) {
    console.log(req.body.keyword)
    return Task
    .findAll({
      where: {
        title: {
          $like: '%' + req.body.keyword + '%'
        }
      }
    })
    .then(task => res.render('task/one', {data: task}))
    .catch(error => res.status(400).send(error))
  },
  findTime (req, res) {
    return Task
    .findAll({
      where: {
        scheduledStartDateTime: {
          $gte: req.body.startTimeSearch},
        $and: {
          scheduledEndDateTime: {
            $lte: req.body.endTimeSearch
          }
        }
      }
    })
    .then(task => res.render('task/one', {data: task}))
    .catch(error => res.status(400).send(error))
  }
}
