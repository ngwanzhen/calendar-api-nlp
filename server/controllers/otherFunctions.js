const chrono = require('chrono-node')
const notifier = require('node-notifier')

module.exports = {
  nlpMaster(userInput) {
    let original = nlpInput(userInput)
    let dstart = original.scheduledStartDateTime
    let yearStart = dstart.getFullYear()
    let monthStart = dstart.getMonth()
    let dayStart = dstart.getDate()
    let hourStart = dstart.getHours()
    let minuteStart = dstart.getMinutes()
    let dend = original.scheduledEndDateTime
    let yearEnd = dend.getFullYear()
    let monthEnd = dend.getMonth()
    let dayEnd = dend.getDate()
    let hourEnd = dend.getHours()
    let minuteEnd = dend.getMinutes()
    let resultsArr = []

    // for yearly events
    if (userInput.toLowerCase().split(' ').includes('anniversary') || userInput.toLowerCase().split(' ').includes('birthday')) {
      for (let i = 0; i < 101; i++) {
        let temp = {}
        temp.scheduledStartDateTime = new Date(yearStart + i, monthStart, dayStart, hourStart, minuteStart)
        temp.scheduledEndDateTime = new Date(yearEnd + i, monthEnd, dayEnd, hourEnd, minuteEnd)
        temp.title = original.title
        resultsArr.push(temp)
      }
      return resultsArr
      // for monthly events
    } else if (userInput.toLowerCase().split(' ').includes('every') && userInput.toLowerCase().split(' ').includes('month')) {
      for (let i = 0; i < 13; i++) {
        let temp = {}
        temp.scheduledStartDateTime = new Date(yearStart, monthStart + i, dayStart, hourStart, minuteStart)
        temp.scheduledEndDateTime = new Date(yearEnd, monthEnd + i, dayEnd, hourEnd, minuteEnd)
        temp.title = original.title
        resultsArr.push(temp)
      }
      return resultsArr
      // for weekly events
    } else if (userInput.toLowerCase().split(' ').includes('every') && userInput.toLowerCase().split(' ').includes('week')) {
      let original = nlpInput(userInput)
      for (let i = 0; i < 54; i++) {
        let temp = {}
        temp.scheduledStartDateTime = new Date(yearStart, monthStart, dayStart + (7 * i), hourStart, minuteStart)
        temp.scheduledEndDateTime = new Date(yearEnd + i, monthEnd, dayEnd + (7 * i), hourEnd, minuteEnd)
        temp.title = original.title
        resultsArr.push(temp)
      }
      return resultsArr
      // for daily events
    } else if (userInput.toLowerCase().split(' ').includes('every') && userInput.toLowerCase().split(' ').includes('day')) {
      for (let i = 0; i < 31; i++) {
        let temp = {}
        temp.scheduledStartDateTime = new Date(yearStart, monthStart, dayStart + i, hourStart, minuteStart)
        temp.scheduledEndDateTime = new Date(yearEnd, monthEnd, dayEnd + i, hourEnd, minuteStart)
        temp.title = original.title
        resultsArr.push(temp)
      }
      return resultsArr
      // else singular event
    } else {
      return nlpInput(userInput)
    }

    // changing sunday to start of week
    function nlpInput(userInput) {
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
          return results[0] ? results[0].start.date() : ''
        }
        let end = () => {
          return results[0].end ? results[0].end.date() : results[0].start.date()
        }
        let title = () => {
          return extract(userInput, results[0].text) ? extract(userInput, results[0].text) : ''
        }
        formFilled = {
          scheduledStartDateTime: start(),
          scheduledEndDateTime: end(),
          title: title().toLowerCase()
        }
        return formFilled
      } else if (!results[0]) {
        notifier.notify('pls input valid start and end times')
      } else if (!extract(userInput, results[0].text)) {
        notifier.notify('pls input valid task / venue')
      } else {
        formFilled = ''
      }

      // if AM/PM not in user input
      function AMorPM(results) {
        results.forEach(function (result) {
          if (!result.start.isCertain('meridiem') &&
            result.start.get('hour') >= 1 && result.start.get('hour') < 4) {
            result.start.assign('meridiem', 1)
            result.start.assign('hour', result.start.get('hour') + 12)
          }
        })
        return results
      }

      // extracts keywords after stripping out date/time
      function extract(original, timedate) {
        let originalArr = original.split(' ')
        let toremove = timedate.replace(/[,!@#?$%^&*~]/g, '').split(' ')
        let ansArr = originalArr.filter((e) => {if (!toremove.includes(e.replace(/[,!@#?$%^&*~]/g, '').replace(/\s/g, ''))) {return e} })
        return ansArr.join(' ')
      }
    }
  }
}
