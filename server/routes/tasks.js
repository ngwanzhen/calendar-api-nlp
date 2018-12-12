const express = require('express');
const router = express.Router();

const taskController = require('../controllers/controller').task
const tempTaskFormController = require('../controllers/controller').tempTaskForm
const userController = require('../controllers/authController.js')

// basic routes
router.get('/', taskController.list)

// tempFormRoutes
  /**
   * @swagger
   * /tasks/form:
   *   post:
   *     description: |
   *       Post to tempForm. Return response with parsed task with title, start time, end time and clashedTask (optional).
   *     parameters:
   *       - name: jwt
   *         in: cookie
   *         required: true
   *         type: string
   *         description: signed user token saved in cookie that would decrypt to user id
   *       - name: Origin
   *         in: header
   *         required: true
   *         type: string
   *         description: only 4200 allowed for now
   *       - name: nlp
   *         in: body
   *         description: The temp tasks to create. Provide timing, date and description in single string to be parsed OR array of strings for sequential tasks.
   *         schema:
   *            type: object
   *            required:
   *              - nlp
   *              - sequentialTasks
   *            properties:
   *              nlp:
   *                type: string
   *              sequentialTasks:
   *                type: array
   *     responses:
   *       "200":
   *         description: Successful response could be singleData, sequentialData or recurringData. clashedTask is an optional object that will only be triggered if singleData or sequentialData posted has a clash. recurringData does not check for clashes.
   *         examples:
   *           application/json: |
   *             {
   *                 "clashedTask":
   *                   {
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                   },
   *                 "singleData":
   *                   {
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                   },
   *                 "sequentialData":
   *                  [
   *                   {
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                   },
   *                   {
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                   }
   *                 ],
   *                 "recurringData":
   *                  [
   *                   {
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                   },
   *                   {
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                   }
   *                 ]
   *               }
   *       "400":
   *         description: User input does not include valid start and end times.
   *         examples:
   *           application/json: |
   *             {
   *               "code": "INVALID_DATETIME",
   *               "message": "pls input valid start and end times"
   *             }
   */
router.post('/form', tempTaskFormController.tempFormPost)
// router.get('/form', tempTaskFormController.tempFormGet)

  /**
   * @swagger
   * /tasks/add:
   *   post:
   *     description: |
   *       Post to Task model. Returns array of tasks created if successful.
   *     parameters:
   *       - name: jwt
   *         in: cookie
   *         required: true
   *         type: string
   *         description: signed user token saved in cookie that would decrypt to user id
   *       - name: Origin
   *         in: header
   *         required: true
   *         type: string
   *         description: only 4200 allowed for now
   *       - name: nlp
   *         in: body
   *         description: Array of tasks to create. Or single object of task to create.
   *         schema:
   *            type: object
   *            required:
   *              - title
   *              - scheduledStartDateTime
   *              - scheduledEndDateTime
   *            properties:
   *              title:
   *                type: string
   *              scheduledStartDateTime:
   *                type: string
   *              scheduledEndDateTime:
   *                type: string
   *     responses:
   *       "200":
   *         description: Successful response
   *         examples:
   *           application/json: |
   *             [{
   *                     "id": "swimming",
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                     "createdAt": "",
   *                     "updatedAt": "",
   *                     "userId": "",
   *              },
   *             {
   *                     "id": "swimming",
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                     "createdAt": "",
   *                     "updatedAt": "",
   *                     "userId": "",
   *              },
   *             {
   *                     "id": "swimming",
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                     "createdAt": "",
   *                     "updatedAt": "",
   *                     "userId": "",
   *              }]
   *       "400":
   *         description: Error with database
   *         examples:
   *           application/json: |
   *             {
   *
   *             }
   */
router.post('/add', taskController.create)

  /**
   * @swagger
   * /tasks/keyword:
   *   post:
   *     description: |
   *       Searches Task model title for matching keywords. Returns array / single task.
   *     parameters:
   *       - name: jwt
   *         in: cookie
   *         required: true
   *         type: string
   *         description: signed user token saved in cookie that would decrypt to user id
   *       - name: Origin
   *         in: header
   *         required: true
   *         type: string
   *         description: only 4200 allowed for now
   *       - name: keyword
   *         in: body
   *         description: String of keyword to search for.
   *         schema:
   *            type: string
   *            required:
   *              - keyword
   *     responses:
   *       "200":
   *         description: Successful response
   *         examples:
   *           application/json: |
   *             [{
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *              },
   *             {
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *              },
   *             {
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *              }]
   *       "400":
   *         description: Error with database
   *         examples:
   *           application/json: |
   *             {
   *
   *             }
   */
router.post('/keyword', taskController.findWord)
// not sure about usefulness, might be easier to just click on calendar to see, or wait for clashes when user input new appt
// router.post('/time', taskController.findTime)

// additional routes for front end to create day / month view
  /**
   * @swagger
   * /tasks/day:
   *   get:
   *     description: |
   *       Gets a listing of all tasks in Task model for today. Returns array of tasks.
   *     parameters:
   *       - name: jwt
   *         in: cookie
   *         required: true
   *         type: string
   *         description: signed user token saved in cookie that would decrypt to user id
   *       - name: Origin
   *         in: header
   *         required: true
   *         type: string
   *         description: only 4200 allowed for now
   *     responses:
   *       "200":
   *         description: Successful response
   *         examples:
   *           application/json: |
   *             [{
   *                     "id": "swimming",
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                     "createdAt": "",
   *                     "updatedAt": "",
   *                     "userId": "",
   *              },
   *             {
   *                     "id": "swimming",
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                     "createdAt": "",
   *                     "updatedAt": "",
   *                     "userId": "",
   *              },
   *             {
   *                     "id": "swimming",
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                     "createdAt": "",
   *                     "updatedAt": "",
   *                     "userId": "",
   *              }]
   *       "400":
   *         description: Error with database
   *         examples:
   *           application/json: |
   *             {
   *
   *             }
   */
router.get('/day', taskController.day)
// router.get('/month', taskController.month)
  /**
   * @swagger
   * /tasks/list:
   *   get:
   *     description: |
   *       Gets a listing of all tasks in Task model by user id. Returns array of tasks.
   *     parameters:
   *       - name: jwt
   *         in: cookie
   *         required: true
   *         type: string
   *         description: signed user token saved in cookie that would decrypt to user id
   *       - name: Origin
   *         in: header
   *         required: true
   *         type: string
   *         description: only 4200 allowed for now
   *     responses:
   *       "200":
   *         description: Successful response
   *         examples:
   *           application/json: |
   *             [{
   *                     "id": "swimming",
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                     "createdAt": "",
   *                     "updatedAt": "",
   *                     "userId": "",
   *              },
   *             {
   *                     "id": "swimming",
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                     "createdAt": "",
   *                     "updatedAt": "",
   *                     "userId": "",
   *              },
   *             {
   *                     "id": "swimming",
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                     "createdAt": "",
   *                     "updatedAt": "",
   *                     "userId": "",
   *              }]
   *       "400":
   *         description: Error with database
   *         examples:
   *           application/json: |
   *             {
   *
   *             }
   */
router.get('/list', taskController.list)
  /**
   * @swagger
   * /tasks/remind:
   *   get:
   *     description: |
   *       Gets a listing of all tasks in Task model in the next 15 minutes. Returns array of tasks.
   *     parameters:
   *       - name: jwt
   *         in: cookie
   *         required: true
   *         type: string
   *         description: signed user token saved in cookie that would decrypt to user id
   *       - name: Origin
   *         in: header
   *         required: true
   *         type: string
   *         description: only 4200 allowed for now
   *     responses:
   *       "200":
   *         description: Successful response
   *         examples:
   *           application/json: |
   *             [{
   *                     "id": "swimming",
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                     "createdAt": "",
   *                     "updatedAt": "",
   *                     "userId": "",
   *              },
   *             {
   *                     "id": "swimming",
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                     "createdAt": "",
   *                     "updatedAt": "",
   *                     "userId": "",
   *              },
   *             {
   *                     "id": "swimming",
   *                     "title": "swimming",
   *                     "scheduledStartDateTime": "",
   *                     "scheduledEndDateTime": "",
   *                     "createdAt": "",
   *                     "updatedAt": "",
   *                     "userId": "",
   *              }]
   *       "400":
   *         description: Error with database
   *         examples:
   *           application/json: |
   *             {
   *
   *             }
   */
router.get('/remind', taskController.remind)

module.exports = router;

