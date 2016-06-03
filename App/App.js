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
    /** App Setup */
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
    appConf.middlewares.forEach(function (element, index) {
      App.use(element)
    })
    /** Routes Setup */
    Object.keys(appConf.routes).forEach(function (element, index) {
      App.use(element, appConf.routes[element])
    })
    /** Errors Handling */
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
