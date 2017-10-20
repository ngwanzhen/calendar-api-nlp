// const app = require('../app').app
const server = require('../').server
const expect = require('chai').expect
const chai = require('chai')
const should = require('chai').should()
chai.use(require('chai-datetime'))
const request = require('supertest').agent(server)
// this.jsdom = require('jsdom-global')()
// global.$ = global.jQuery = require('jquery')
const assert = require('assert')
const chrono = require('chrono-node')
// const publicScript = require('../public/js/script')

describe('GET static pages', function () {
  after(function (done) {
    server.close()
    done()
  })

  describe('getting homepage', function () {
    this.timeout(2000)
    it('should response 200', function (done) {
      request
      .get('/')
      .end(function (err, response) {
        if (err) console.log(err)
        expect(response.status).to.equal(200)
        done()
      })
    })
  })
  describe('should get error', function () {
    this.timeout(2000)
    it('should response 404', function (done) {
      request
      .get('/weird')
      .end(function (err, response) {
        if (err) console.log(err)
        expect(response.status).to.equal(404)
        done()
      })
    })
  })

  describe('NLP tests', function () {
    let keypress = {
      which: 13
    }
    describe('positive tests', function () {
      it('go supermarket today from 2 to 3pm', function () {
        let testStr1 = 'go supermarket today from 2 to 3pm'
        assert.strictEqual(nlpInput(keypress, testStr1).title, 'go supermarket', 'keyword parsed wrong')
        new Date(nlpInput(keypress, testStr1).userStart).should.equalTime(new Date(2017, 9, 13, 14, 0))
        new Date(nlpInput(keypress, testStr1).userEnd).should.equalTime(new Date(2017, 9, 13, 15, 0))
      })
      it('go supermarket tomorrow from 14:00 to 15:00', function () {
        let testStr1 = 'go supermarket tomorrow from 14:00 to 15:00'
        assert.strictEqual(nlpInput(keypress, testStr1).title, 'go supermarket', 'keyword parsed wrong')
        new Date(nlpInput(keypress, testStr1).userStart).should.equalTime(new Date(2017, 9, 14, 14, 0))
        new Date(nlpInput(keypress, testStr1).userEnd).should.equalTime(new Date(2017, 9, 14, 15, 0))
      })
      it('go supermarket this Sunday at 9', function () {
        let testStr1 = 'go supermarket this Sunday at 9'
        assert.strictEqual(nlpInput(keypress, testStr1).title, 'go supermarket', 'keyword parsed wrong')
        new Date(nlpInput(keypress, testStr1).userStart).should.equalTime(new Date(2017, 9, 15, 9, 0))
        new Date(nlpInput(keypress, testStr1).userEnd).should.equalTime(new Date(2017, 9, 15, 9, 0))
      })
      it('go supermarket next Sunday at 1 should default to PM', function () {
        let testStr1 = 'go supermarket next Sunday at 1'
        assert.strictEqual(nlpInput(keypress, testStr1).title, 'go supermarket', 'keyword parsed wrong')
        new Date(nlpInput(keypress, testStr1).userStart).should.equalTime(new Date(2017, 9, 22, 13, 0))
        new Date(nlpInput(keypress, testStr1).userEnd).should.equalTime(new Date(2017, 9, 22, 13, 0))
      })
      it('go swimming on Aug 17 @ 18:40', function () {
        let testStr1 = 'go swimming on Aug 17 @ 18:40'
        assert.strictEqual(nlpInput(keypress, testStr1).title, 'go swimming', 'keyword parsed wrong')
        new Date(nlpInput(keypress, testStr1).userStart).should.equalTime(new Date(2017, 7, 17, 18, 40))
        new Date(nlpInput(keypress, testStr1).userEnd).should.equalTime(new Date(2017, 7, 17, 18, 40))
      })
    })
    describe('negative tests', function () {
      it('no task, only time', function () {
        let testStr1 = '2 to 3pm'
        assert.strictEqual(nlpInput(keypress, testStr1), '', 'should be empty')
      })
      it('no time, only task', function () {
        let testStr1 = 'swimming'
        assert.strictEqual(nlpInput(keypress, testStr1), '', 'should be empty')
      })
      it('invalid time', function () {
        let testStr1 = 'swimming at 25:00'
        assert.strictEqual(nlpInput(keypress, testStr1), '', 'should be empty')
      })
    })
  })
})

// bringing in the function here to test, with tweaks to userInput to be based on string, and alert to be console logs and returns formFilled instead of posting it
function nlpInput (e, userInput) {
  userInput = userInput.replace(/[!@#?$%^&*~]/g, '')
  var key = e.which
  if (key === 13) {
    let results
    let formFilled
    if (userInput.toLowerCase().split(' ').includes('sunday') || userInput.toLowerCase().split(' ').includes('sun')) {
      results = chrono.parse(userInput, new Date().getTime() + (7 * 24 * 60 * 60 * 1000))
      AMorPM(results)
    } else {
      results = chrono.parse(userInput)
      AMorPM(results)
    }

    if (results[0] && extract(userInput, results[0].text)) {
      let start = () => {
        return results[0] ? results[0].start.date() : console.log('pls input valid start time')
      }
      let end = () => {
        return results[0].end ? results[0].end.date() : results[0].start.date()
      }
      let title = () => {
        return extract(userInput, results[0].text) ? extract(userInput, results[0].text)
          : console.log('pls input valid task / venue')
      }

      formFilled = {
        userStart: start(),
        userEnd: end(),
        title: title()
      }
    } else if (!results[0]) {
      formFilled = ''
      console.log('pls input valid start and end times')
    } else if (!extract(userInput, results[0].text)) {
      formFilled = ''
      console.log('pls input valid task / venue')
    } else {
      formFilled = ''
    // console.log('err')
    }
    return formFilled
  }
  function AMorPM (results) {
    results.forEach(function (result) {
      if (!result.start.isCertain('meridiem') &&
        result.start.get('hour') >= 1 && result.start.get('hour') < 8) {
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
