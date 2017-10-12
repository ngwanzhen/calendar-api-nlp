// var chrono = require('chrono-node')

$(function () {
  $('#nlpInput').keypress(function (e) {
    var key = e.which
    if (key === 13) {
      let userInput = $('#nlpInput').val().replace(/[!@#?$%^&*~]/g, '')
      let result = chrono.parse(userInput)
      let start = () => {
        return result[0].start ? result[0].start.date() : alert('pls input start time')
      }
      let end = () => {
        return result[0].end ? result[0].end.date() : result[0].start.date()
      }
      console.log(start())
      console.log(end())
      console.log(result[0].text)
      console.log(extract(userInput, result[0].text))

      function extract (original, timedate) {
        let originalArr = original.split(' ')
        let toremove = timedate.replace(/[,!@#?$%^&*~]/g, '').split(' ')
        let ansArr = originalArr.filter((e) => { if (!toremove.includes(e.replace(/[,!@#?$%^&*~]/g, '').replace(/\s/g, ''))) { return e } })
        return ansArr.join(' ')
      }

      let formFilled = {
        userStart: start(),
        userEnd: end(),
        title: extract(userInput, result[0].text)
      }

      $.post('/task/form', formFilled).done((e) => {
        if (e === 'ok') {
          // console.log('should not redirect')
          window.location.href = '/task/form'
        }
      })
    }
  })
})
