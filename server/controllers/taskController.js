const Task = require('../models').Task

module.exports = {
  list (req, res) {
    return Task
    .findAll({ attributes: ['title', 'scheduledStartDateTime', 'scheduledEndDateTime'], order: [['scheduledStartDateTime', 'DESC']],
      where: { userId: req.user.id }
    })
    .then(task => res.render('task/list', {data: task}))
    .catch(error => res.status(400).send(error))
  },
  create (req, res) {
    let tempArr = []
    if (req.body.title.length) {
      for (let i = 0; i < req.body.title.length; i++) {
        let eventObj = {}
        eventObj.title = req.body.title[i]
        eventObj.scheduledStartDateTime = req.body.scheduledStartDateTime[i]
        eventObj.scheduledEndDateTime = req.body.scheduledEndDateTime[i]
        tempArr.push(eventObj)
      }
    } else {
      tempArr.push(req.body)
    }

    tempArr.forEach((e) => {
      return Task
      .create({
        title: e.title.toLowerCase(),
        scheduledStartDateTime: e.scheduledStartDateTime,
        scheduledEndDateTime: e.scheduledEndDateTime,
        userId: req.user.id
      })
      .then(task => res.redirect('/task'))
      .catch(error => res.status(400).send(error))
    })
  },
  findWord (req, res) {
    // console.log(req.body.keyword)
    return Task
    .findAll({ attributes: ['title', 'scheduledStartDateTime', 'scheduledEndDateTime'],
      where: {
        title: {
          $like: '%' + req.body.keyword.toLowerCase() + '%'
        }
      }
    })
    .then(task => res.render('task/one', {data: task}))
    .catch(error => res.status(400).send(error))
  },
  findTime (req, res) {
    return Task
    .findAll({ attributes: ['title', 'scheduledStartDateTime', 'scheduledEndDateTime'],
      where: {
        $or: [
          {userId: req.user.id,
            $and:
            {scheduledStartDateTime: {
              $lte: req.body.startTimeSearch},
              scheduledEndDateTime: {
                $gte: req.body.endTimeSearch
              }
            }},
          {userId: req.user.id,
            $and:
            {scheduledStartDateTime: {
              $gt: req.body.startTimeSearch,
              $lt: req.body.endTimeSearch
            }
            }},
          {userId: req.user.id,
            $and:
            {scheduledStartDateTime: {
              $lte: req.body.startTimeSearch},
              scheduledEndDateTime: {
                $gt: req.body.startTimeSearch
              }
            }}
        ]
      }
    })
    .then(task => res.render('task/one', {data: task}))
    .catch(error => res.status(400).send(error))
  }
}
