/* Dependencies */
const logger = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const Middlewares = [
  logger('dev'),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  cookieParser()
]

module.exports = Middlewares
