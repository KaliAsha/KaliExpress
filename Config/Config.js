/* Dependencies */
const path = require('path')

const Config = {
  appRoot: path.join(__dirname, '../', 'App/'),
  env: 'development',
  verbose: false,

  server: require('./Server'),
  middlewares: require('./Middlewares'),
  policies: require('./Policies'),
  routes: require('./Routes'),
  errors: require('./Errors'),
  db: require('./Database')
}

module.exports = Config
