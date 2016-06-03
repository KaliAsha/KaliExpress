/* Dependencies */
const path = require('path')

const Controllers = path.join('../', 'App/', 'Controllers/')

const Routes = {
  '/': require(Controllers + 'MainController')
}

module.exports = Routes
