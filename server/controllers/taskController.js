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
    // console.log(req.user.id)
    return Task
      .create({
        title: req.body.title.toLowerCase(),
        scheduledStartDateTime: req.body.scheduledStartDateTime,
        scheduledEndDateTime: req.body.scheduledEndDateTime,
        userId: req.user.id
      })
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
    //   where: {
    //     userId: req.user.id,
    //     scheduledStartDateTime: {
    //       $lte: req.body.startTimeSearch},
    //     $and: {
    //       scheduledEndDateTime: {
    //         $gte: req.body.endTimeSearch
    //       }
    //     }
    //   }
    // })
    .then(task => res.render('task/one', {data: task}))
    .catch(error => res.status(400).send(error))
  }
}
