### Task Management App
## Key Features
User authentication using jwt cookie that would decrypt to user id
Natural langauge processing for schedule management
Database using postgres and sequelize

* deployed api: https://fathomless-chamber-45221.herokuapp.com/
* documentation: https://thecodingdog.github.io/calendar-api-nlp/
* demo with front-end using default user: https://safe-headland-74827.herokuapp.com/

## Deployment:
process.env.NODE_ENV=production
heroku config:set NODE_ENV=production

### User Stories
Auth
* user able to signup / login to see his own tasks by day, week, month

Add Tasks with NLP
* able to add task and time in a single string input such as 'swimming next Friday at 2pm', 'Nov 15, 2017, Harry’s   birthday'
* able to check for clashes in timing before proceeding to book a slot
* able to add recurring schedule using the words 'birthday' or 'anniversary' or 'every day / month / week'
* able to 'guess' am / pm from morning / evening / best guess based on hour

View Tasks
* able to search / filter for relevant tasks by time and keywords
* user will get reminded of task coming up in 15 mins

### Assumptions
* Upon clashes, users will be shown clashing schedule, but still allowed to proceed with booking
* Searches by "location" works like searching for "keyword". i.e. it includes searches for activity, name etc. in order to cover for cases like 'dinner at Jo's'
* String inputs without time will be defaulted to 12 noon
* String inputs without end time will be defaulted to end at start time
* String inputs without dates will be defaulted to today
* String inputs without AM/PM will be defaulted to PM if its between 1-4, else defaulted to AM
* Week starts from Monday - Sunday i.e. inputting 'jogging this Sunday' results in 22nd Oct 2017
* Doesn't account for different timezones
* Recurring events for daily will be repeated for 30 days
* Recurring events for weekly will be repeated for 53 weeks (1 year)
* Recurring events for monthly will be repeated for 12 months (1 year)

### ERD
User has many tempTaskForm and tasks
tempTaskForm belongs to users
Task belongs to users
![ERD](public/img/erd.png?raw=true 'start')

### Built With
* Node
* Express
* Handlebars
* PostgresSQL + Sequelize
* Mocha, Chai for testing

### Packages that helped
* Sequelize for ORM management
https://scotch.io/tutorials/getting-started-with-node-express-and-postgres-using-sequelize
* Chrono-node is a good NLP parser that extracts date and times
https://github.com/wanasit/chrono
* Passport, sequelize, bcrypt tutorial
https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537
* Chai-datetime plugin to help test time equality http://chaijs.com/plugins/chai-datetime/
* helper-moment is a good handlebars date time parser for SQL datetime
https://github.com/helpers/handlebars-helper-moment
* bootstrap-datetimepicker is a good css plugin that makes form input for date easier
https://github.com/smalot/bootstrap-datetimepicker
* Materialize CSS
* node-notifier for error alerts

### Test Case Coverage
![Test Cases](public/img/test-cases.png?raw=true 'start')

### Solved bugs
* join wedding party at Raffles 'this Sunday' at 9pm results in 'last Sunday' because NLP assumes Sunday is start of week
* no AM/PM in user input results in AM by default. Added logic to only push to PM between 1-4. All else should be AM.
* creating multiple rows for recurring events has setheader issues in sequelize crashing the server.

### Front end implementation considerations
* added routes for task/day (list all tasks for today) and task/month (list all tasks this month) to help front-end create calendar view accordingly
* added routes for upcoming events starting in < 15mins (facilitate reminder function)

### Unsolved-challenges /  Todos
* to recognise 'for 20mins'
* fix bug where 2 to 4am defaults to 14:00 to 4:00 coz of AM PM defaulting
* cleaning up keywords to remove verbs like go using 'compromise' package
https://github.com/nlp-compromise/compromise
* allowing search to be performed in NLP using 'natural' package
https://github.com/NaturalNode/natural
* modularise the nlp function into separate file?
* fix nlp edge cases (e.g. last day of month)
