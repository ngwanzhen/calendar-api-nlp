const tempTaskForm = require('../models').tempTaskForm
const Task = require('../models').Task
const nlpMaster = require('./otherFunctions').nlpMaster



module.exports = {
  tempFormGet(req, res) {
    return tempTaskForm
      .findAll({
        attributes: ['title', 'scheduledStartDateTime', 'scheduledEndDateTime'],
        where: { userId: req.user.id }
      })
      .then(tempTask => res.render('task/formModal', { arrData: tempTask }))
      .catch(error => res.status(400).send(error))
  },

  tempFormPost(req, res, next) {
    // destroys all previous forms
    console.log('req', req.body)
    let resultsArr = []
    let parsedForm
    let sequentialArr
    return tempTaskForm
      .destroy({
        where: { userId: req.user.id }
      })
      // creates a new parsedForm or resultArr if recurring event or sequentialForm
      .then(() => {
        let nlpResults = nlpMaster(req.body.nlp)
        console.log('nlpResults', nlpResults)
        if (nlpResults.length > 1) {
          resultsArr = nlpResults
        } else { parsedForm = nlpResults }
        if (req.body.seqentialTask && req.body.sequentialTask.filter(Boolean).length !== 0) {
          console.log('what')
          let tempSequentialArr = []
          if (!Array.isArray(req.body.sequentialTask)) {
            tempSequentialArr.push(req.body.sequentialTask)
          } else tempSequentialArr = req.body.sequentialTask
          sequentialArr = []
          let previousDate = new Date(parsedForm.scheduledStartDateTime).toDateString()
          sequentialArr.push(parsedForm)
          // TODO: fix sequential! when only 2 records, doesn't work. only 3 or 1 works! and body expected now is {nlp: 'text', sequentialTask: [ '', '' ]} need to change this to better handling + swagger!
          tempSequentialArr.forEach((e) => {
            let sequentialTask = e + ' ' + previousDate
            let sequentialForm = nlpMaster(sequentialTask)
            sequentialArr.push(sequentialForm)
          })

          sequentialArr.forEach((e) => {
            return tempTaskForm
              .create({
                title: e.title,
                scheduledStartDateTime: e.scheduledStartDateTime,
                scheduledEndDateTime: e.scheduledEndDateTime,
                userId: req.user.id
              })
          })
        } else if (parsedForm) {
          console.log('parsedForm', parsedForm)
          return tempTaskForm
            .create({
              title: parsedForm.title,
              scheduledStartDateTime: parsedForm.scheduledStartDateTime,
              scheduledEndDateTime: parsedForm.scheduledEndDateTime,
              userId: req.user.id
            })
        } else {
          resultsArr.forEach((e) => {
            return tempTaskForm
              .create({
                title: e.title,
                scheduledStartDateTime: e.scheduledStartDateTime,
                scheduledEndDateTime: e.scheduledEndDateTime,
                userId: req.user.id
              })
          })
        }
      })
      // checks for clashes to be displayed if singular event. recurring event is assumed to be created regardless
      .then(() => {
        if (parsedForm) {
          return Task
            .findAll({
              attributes: ['title', 'scheduledStartDateTime', 'scheduledEndDateTime'],
              where: {
                $or: [
                  {
                    userId: req.user.id,
                    $and:
                    {
                      scheduledStartDateTime: {
                        $lte: parsedForm.scheduledStartDateTime
                      },
                      scheduledEndDateTime: {
                        $gte: parsedForm.scheduledEndDateTime
                      }
                    }
                  },
                  {
                    userId: req.user.id,
                    $and:
                    {
                      scheduledStartDateTime: {
                        $gt: parsedForm.scheduledStartDateTime,
                        $lt: parsedForm.scheduledEndDateTime
                      }
                    }
                  },
                  {
                    userId: req.user.id,
                    $and:
                    {
                      scheduledStartDateTime: {
                        $lte: parsedForm.scheduledStartDateTime
                      },
                      scheduledEndDateTime: {
                        $gt: parsedForm.scheduledStartDateTime
                      }
                    }
                  }
                ]
              }
            })
            .then(clashTask => {
              // next()
              // res.send(sequentialForm)
              // res.render('task/formModal', {
              //   clashTask: clashTask,
              //   singleData: parsedForm,
              //   sequentialData: sequentialArr
              // })
              res.send({
                clashTask: clashTask,
                singleData: parsedForm,
                sequentialData: sequentialArr
              })
            })
            .catch(error => res.status(400).send(error))
        } else res.send({ recurringData: resultsArr })
      })
      .catch(error => res.status(400).send(error))
  }
}
