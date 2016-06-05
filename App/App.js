/* Dependencies */
const http = require('http')
const path = require('path')
const express = require('express')
const expressHbs = require('express-handlebars')
const Config = require('../Config/Config')

class App {
  constructor () {
    this.config = {}
    let self = this
    Object.keys(Config).forEach(function (element, index) {
      self.config[element] = Config[element]
    })

  }

  init () {
    const App = this.app = express()
    const appConf = this.config
    const verbose = this.config.verbose
    /** App Setup */
    if (verbose) console.log('\t- App Setup')
    App.engine('hbs', expressHbs({
      defaultLayout: 'main',
      extname: '.hbs',
      layoutsDir: path.join(appConf.appRoot, 'Views/layouts/'),
      partialsDir: path.join(appConf.appRoot, 'Views/partials/')
    }))
    App.set('env', appConf.env)
    App.set('view engine', 'hbs')
    App.set('views', path.join(appConf.appRoot, 'Views/'))
    /** Middlewares Setup */
    if (verbose) console.log('\t- Middlewares Setup')
    appConf.middlewares.forEach(function (element, index) {
      App.use(element)
    })
    /** Routes Setup */
    if (verbose) console.log('\t- Routes Setup')
    Object.keys(appConf.routes).forEach(function (element, index) {
      const ctrlString = appConf.routes[element]
      const methodRgxp = /^(?:([a-z]*?) )?(.*)$/i
      let method = (methodRgxp.exec(element)[1] + '').toLowerCase()
      const route = methodRgxp.exec(element)[2]
      if (['all', 'get', 'post', 'head', 'put', 'delete'].indexOf(method) === -1) {
        method = 'all'
      }
      const tabCtrlStr = ctrlString.split('.')
      const controller = tabCtrlStr[0]
      const action = tabCtrlStr[1] || 'index'
      App[method](route, require('./Controllers/' + controller)[action])
      if (verbose) console.log('\t\t- ' + method + ' ' + route + ' : ' + controller + '.' + action)
    })
    /** Errors Handling */
    if (verbose) console.log('\t- Errors Handling')
    App.use(appConf.errors.error404)
    if (App.get('env') === 'development') {
      App.use(appConf.errors.devErrorHandler)
    }
    App.use(appConf.errors.prodErrorHandler)
  }

  start () {
    const serverConfig = this.config.server
    const Server = this.server = http.createServer(this.app)
    Server.listen(serverConfig.port)
    Server.on('error', serverConfig.onError)
    Server.on('listening', serverConfig.onListening)
  }
}

module.exports = App
