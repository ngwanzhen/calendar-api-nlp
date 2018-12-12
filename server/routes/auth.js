const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const userController = require('../controllers/authController.js')

  /**
   * @swagger
   * /userAuth/register:
   *   post:
   *     description: |
   *       Register users with email & password.
   *     parameters:
   *       - name: x-api-key
   *         in: header
   *         required: true
   *         type: string
   *       - name: x-aa-client-id
   *         in: header
   *         required: true
   *         type: string
   *       - name: x-ga-client-id
   *         in: header
   *         required: false
   *         type: string
   *       - name: Origin
   *         in: header
   *         required: true
   *         type: string
   *       - name: Authorization
   *         in: header
   *         description: Access Token
   *         required: true
   *         type: string
   *       - name: userId
   *         in: path
   *         required: true
   *         type: string
   *       - name: qty
   *         in: query
   *         description: Number of flights to retrieve
   *         required: false
   *         type: number
   *     responses:
   *       "200":
   *         description: Successful response
   *         schema:
   *           type: object
   *           properties:
   *             data:
   *               type: object
   *               required:
   *                 - navitaireCustomerNumber
   *                 - flights
   *               properties:
   *                 navitaireCustomerNumber:
   *                   type: string
   *                 flights:
   *                   type: array
   *                   items:
   *                     type: object
   *                     required:
   *                       - arrivalCity
   *                       - bookingId
   *                       - bookingStatus
   *                       - channelType
   *                       - departureCity
   *                       - departureDate
   *                       - firstName
   *                       - flightNumber
   *                       - lastName
   *                       - recordLocator
   *                       - title
   *                     properties:
   *                       arrivalCity:
   *                         type: string
   *                       bookingId:
   *                         type: string
   *                       bookingStatus:
   *                         type: string
   *                       channelType:
   *                         type: string
   *                       departureCity:
   *                         type: string
   *                       departureDate:
   *                         type: string
   *                       firstName:
   *                         type: string
   *                       flightNumber:
   *                         type: string
   *                       lastName:
   *                         type: string
   *                       recordLocator:
   *                         type: string
   *                       title:
   *                         type: string
   *         examples:
   *           application/json: |
   *             {
   *                 "navitaireCustomerNumber": "1234567890",
   *                 "flights": [
   *                   {
   *                     "arrivalCity": "KUL",
   *                     "bookingId": "205448239",
   *                     "bookingStatus": "HoldCanceled",
   *                     "channelType": "Web",
   *                     "departureCity": "SIN",
   *                     "departureDate": "2017-03-10T06:05:00",
   *                     "firstName": "Test",
   *                     "flightNumber": " 701",
   *                     "lastName": "Test",
   *                     "recordLocator": "AGS75A",
   *                     "title": "MR"
   *                   }
   *                 ]
   *               }
   *       "400":
   *         schema:
   *           $ref: "#/definitions/ErrorResponse"
   *         examples:
   *           application/json: |
   *             {
   *               "code": "INVALID_NUMBER_OF_FLIGHTS",
   *               "message": "Invalid Number of Flights"
   *             }
   *       '401':
   *         description: User is not authorized.
   *         examples:
   *           application/json: |
   *             {
   *                 "code": "UNAUTHORIZED",
   *                 "message": "User is not authorized to request this resource."
   *              }
   *       "403":
   *         schema:
   *           $ref: "#/definitions/ErrorResponse"
   *         examples:
   *           application/json:  |
   *             {
   *               "code": "INVALID_API_KEY",
   *               "message": "Forbidden. Invalid Api Key."
   *             }
   *       '404':
   *         description: Invalid user's identifier.
   *         examples:
   *           application/json: |
   *             {
   *               "code": "USER_DOES_NOT_EXIST",
   *               "message": "User Does Not Exist"
   *             }
   */
router.get('/register', userController.signup)
router.get('/login', userController.signin)
router.get('/logout', userController.logout)
router.post('/register', (req, res) => {
  passport.authenticate('local-signup', {session: false}, (err, user, info) => {
    console.log('user here', JSON.stringify(user))
    if (err || !user) {
      console.log('database connection err', err, user, info)
      return res.status(400).json({
        message: info.message,
        user: user
      });
    }
    req.login(user, {session: false}, (err) => {
      if (err) {
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      console.log('user', user)
      const token = jwt.sign(user.toJSON(), 'your_jwt_secret');
      return res.json({user, token});
    });
  })(req, res);
});
router.post('/login', (req, res) => {
  passport.authenticate('local-signin', {session: false}, (err, user, info) => {
    if (err || !user) {
      console.log('user does not exist', err)
      return res.status(400).json({
        message: 'Something is not right',
        user: user
      });
    }
    req.login(user, {session: false}, (err) => {
      if (err) {
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      console.log('user', user)
      const token = jwt.sign(user, 'your_jwt_secret');
      let options = {
        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        // httpOnly: true, // The cookie only accessible by the web server
        // signed: true // Indicates if the cookie should be signed
      }
      // res.header("Access-Control-Allow-Credentials", true);
      res.cookie('jwt', token, options) // options is optional
      return res.json({user, token});
    });
  })(req, res);
});

module.exports = router;

