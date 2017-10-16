const tempTaskForm = require('../models').tempTaskForm
const Task = require('../models').Task
const chrono = require('chrono-node')
// const nlpInput = require('./nlpFunction')
let parsedForm
let resultsArr = []

module.exports = {
  tempFormPost (req, res) {
    if (parsedForm) {
      return tempTaskForm
      .create({
        title: parsedForm.title,
        scheduledStartDateTime: parsedForm.scheduledStartDateTime,
        scheduledEndDateTime: parsedForm.scheduledEndDateTime,
        userId: req.user.id
      })
      .then(task => res.redirect('/task/form'))
      .catch(error => res.status(400).send(error))
    } else {
      resultsArr.forEach((e) => {
        return tempTaskForm
        .create({
          title: e.title,
          scheduledStartDateTime: e.scheduledStartDateTime,
          scheduledEndDateTime: e.scheduledEndDateTime,
          userId: req.user.id
        })
        .then(task => res.redirect('/task/form'))
        .catch(error => res.status(400).send(error))
      })
    }
  },
  tempFormGet (req, res) {
    return tempTaskForm
  .findAll({ attributes: ['title', 'scheduledStartDateTime', 'scheduledEndDateTime'] })
  .then(tempTask => res.render('task/formModal', {data: tempTask.pop()}))
  .catch(error => res.status(400).send(error))
  },
  checkClash (req, res, next) {
    parsedForm = nlpMaster(req.body.nlp)
    if (parsedForm) {
      return Task
      .findAll({ attributes: ['title', 'scheduledStartDateTime', 'scheduledEndDateTime'],
        where: {
          $or: [
            {userId: req.user.id,
              $and:
              {scheduledStartDateTime: {
                $lte: parsedForm.scheduledStartDateTime},
                scheduledEndDateTime: {
                  $gte: parsedForm.scheduledEndDateTime
                }
              }},
            {userId: req.user.id,
              $and:
              {scheduledStartDateTime: {
                $gt: parsedForm.scheduledStartDateTime,
                $lt: parsedForm.scheduledEndDateTime
              }
              }},
            {userId: req.user.id,
              $and:
              {scheduledStartDateTime: {
                $lte: parsedForm.scheduledStartDateTime},
                scheduledEndDateTime: {
                  $gt: parsedForm.scheduledStartDateTime
                }
              }}
          ]
        }
      })
        .then(clashTask => {
          if (clashTask.length !== 0) { res.render('task/formModal', {clashTask: clashTask, data: parsedForm}) } else next()
        })
        .catch(error => res.status(400).send(error))
    } else next()

// should be modularized elsewhere?
    function nlpMaster (userInput) {
      if (userInput.toLowerCase().split(' ').includes('anniversary') || userInput.toLowerCase().split(' ').includes('birthday')) {
        let temp = nlpInput(userInput)
        for (let i = 0; i < 10; i++) {
          let dstart = temp.scheduledStartDateTime
          let yearStart = dstart.getFullYear()
          let monthStart = dstart.getMonth()
          let dayStart = dstart.getDate()
          let dend = temp.scheduledEndDateTime
          let yearEnd = dend.getFullYear()
          let monthEnd = dend.getMonth()
          let dayEnd = dend.getDate()
          temp.scheduledStartDateTime = new Date(yearStart + i, monthStart, dayStart)
          temp.scheduledEndDateTime = new Date(yearEnd + i, monthEnd, dayEnd)
          resultsArr.push(temp)
        }
        console.log(resultsArr)
      } else {
        return nlpInput(userInput)
      }
    }
    function nlpInput (userInput) {
      userInput = userInput.replace(/[!@#?$%^&*~]/g, '')
      let results
      let formFilled
      if (new Date().getDay() === 0) {
        if (userInput.toLowerCase().split(' ').includes('sunday') || userInput.toLowerCase().split(' ').includes('sun')) {
          results = chrono.parse(userInput)
          AMorPM(results)
        } else {
          results = chrono.parse(userInput, new Date().getTime() - (7 * 24 * 60 * 60 * 1000))
          AMorPM(results)
        }
      } else {
        if (userInput.toLowerCase().split(' ').includes('sunday') || userInput.toLowerCase().split(' ').includes('sun')) {
          results = chrono.parse(userInput, new Date().getTime() + (7 * 24 * 60 * 60 * 1000))
          AMorPM(results)
        } else {
          results = chrono.parse(userInput)
          AMorPM(results)
        }
      }
      if (results[0] && extract(userInput, results[0].text)) {
        let start = () => {
          return results[0] ? results[0].start.date() : console.log('pls input valid start time')
        }
        let end = () => {
          return results[0].end ? results[0].end.date() : results[0].start.date()
        }
        let title = () => {
          return extract(userInput, results[0].text) ? extract(userInput, results[0].text) : console.log('pls input valid task / venue')
        }
        formFilled = {
          scheduledStartDateTime: start(),
          scheduledEndDateTime: end(),
          title: title()
        }
        return formFilled
      } else if (!results[0]) {
        console.log('pls input valid start and end times')
      } else if (!extract(userInput, results[0].text)) {
        console.log('pls input valid task / venue')
      } else {
        formFilled = ''
      }

      function AMorPM (results) {
        results.forEach(function (result) {
          if (!result.start.isCertain('meridiem') &&
            result.start.get('hour') >= 1 && result.start.get('hour') < 4) {
            result.start.assign('meridiem', 1)
            result.start.assign('hour', result.start.get('hour') + 12)
          }
        })
        return results
      }

      function extract (original, timedate) {
        let originalArr = original.split(' ')
        let toremove = timedate.replace(/[,!@#?$%^&*~]/g, '').split(' ')
        let ansArr = originalArr.filter((e) => { if (!toremove.includes(e.replace(/[,!@#?$%^&*~]/g, '').replace(/\s/g, ''))) { return e } })
        return ansArr.join(' ')
      }
    }
  }

}
