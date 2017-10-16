// $(function () {
//   $('#nlpInput').keypress(function nlpInput (e, userInput) {
//     var key = e.which
//     if (key === 13) {
//       userInput = $('#nlpInput').val().replace(/[!@#?$%^&*~]/g, '')
//       let results
//       let formFilled
//       if (userInput.toLowerCase().split(' ').includes('sunday') || userInput.toLowerCase().split(' ').includes('sun')) {
//         results = chrono.parse(userInput, new Date().getTime() + (7 * 24 * 60 * 60 * 1000))
//         AMorPM(results)
//       } else {
//         results = chrono.parse(userInput)
//         AMorPM(results)
//       }
//       if (results[0] && extract(userInput, results[0].text)) {
//         let start = () => {
//           return results[0] ? results[0].start.date() : window.alert('pls input valid start time')
//         }
//         let end = () => {
//           return results[0].end ? results[0].end.date() : results[0].start.date()
//         }
//         let title = () => {
//           return extract(userInput, results[0].text) ? extract(userInput, results[0].text) : window.alert('pls input valid task / venue')
//         }
//         formFilled = {
//           userStart: start(),
//           userEnd: end(),
//           title: title()
//         }
//
//         $.post('/task/form', formFilled).done((e) => {
//           if (e === 'ok') {
//             window.location.href = '/task/form'
//           }
//         })
//       } else if (!results[0]) {
//         window.alert('pls input valid start and end times')
//       } else if (!extract(userInput, results[0].text)) {
//         window.alert('pls input valid task / venue')
//       } else {
//         formFilled = ''
//       }
//     }
//   })
// })
//
// function AMorPM (results) {
//   results.forEach(function (result) {
//     if (!result.start.isCertain('meridiem') &&
//       result.start.get('hour') >= 1 && result.start.get('hour') < 8) {
//       result.start.assign('meridiem', 1)
//       result.start.assign('hour', result.start.get('hour') + 12)
//     }
//   })
//   return results
// }
//
// function extract (original, timedate) {
//   let originalArr = original.split(' ')
//   let toremove = timedate.replace(/[,!@#?$%^&*~]/g, '').split(' ')
//   let ansArr = originalArr.filter((e) => { if (!toremove.includes(e.replace(/[,!@#?$%^&*~]/g, '').replace(/\s/g, ''))) { return e } })
//   return ansArr.join(' ')
// }

// module.export = {
//   AMorPM,
//   extract
// }
