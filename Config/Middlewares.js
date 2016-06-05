/* Dependencies */
const logger = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

function enableCORS (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
}

const Middlewares = [
  logger('dev'),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  cookieParser(),
  enableCORS
]

module.exports = Middlewares
