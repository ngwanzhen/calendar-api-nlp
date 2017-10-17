const Task = require('../models').Task
// const moment = require('moment')

module.exports = {
  list (req, res) {
    return Task
    .findAll({ attributes: ['title', 'scheduledStartDateTime', 'scheduledEndDateTime'], order: [['scheduledStartDateTime', 'DESC']],
      where: { userId: req.user.id }
    })
    .then(task => res.render('task/list', {data: task}))
    .catch(error => res.status(400).send(error))
  },
  day (req, res) {
    return Task
    .findAll({ attributes: ['title', 'scheduledStartDateTime', 'scheduledEndDateTime'], order: [['scheduledStartDateTime', 'DESC']],
      where: { userId: req.user.id, scheduledStartDateTime: {
        $lte: new Date().setHours(24, 0, 0, 0)},
        scheduledEndDateTime: {
          $gte: new Date().setHours(0, 0, 0, 0) }
      }
    })
    .then(task => res.render('task/list', {data: task}))
    .catch(error => res.status(400).send(error))
  },
  month (req, res) {
    let date = new Date(), y = date.getFullYear(), m = date.getMonth()
    let firstDay = new Date(y, m, 1)
    let lastDay = new Date(y, m + 1, 0)

    return Task
    .findAll({ attributes: ['title', 'scheduledStartDateTime', 'scheduledEndDateTime'], order: [['scheduledStartDateTime', 'DESC']],
      where: { userId: req.user.id, scheduledStartDateTime: {
        $lte: lastDay },
        scheduledEndDateTime: {
          $gte: firstDay }
      }
    })
    .then(task => res.render('task/list', {data: task}))
    .catch(error => res.status(400).send(error))
  },
  create (req, res) {
    let tempArr = []
    if (Array.isArray(req.body.title)) {
      for (let i = 0; i < req.body.title.length; i++) {
        let eventObj = {}
        eventObj.title = req.body.title[i]
        eventObj.scheduledStartDateTime = req.body.scheduledStartDateTime[i]
        eventObj.scheduledEndDateTime = req.body.scheduledEndDateTime[i]
        eventObj.userId = req.user.id
        tempArr.push(eventObj)
      }
    } else {
      req.body.userId = req.user.id
      tempArr.push(req.body)
    }
    return Task
      .bulkCreate(tempArr)
      // .then((task)=>res.send(task))
      .then(task => res.redirect('/task'))
      .catch(error => res.status(400).send(error))
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
