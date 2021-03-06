/* Dependencies */
const http = require('http')
const path = require('path')
const express = require('express')
const expressHbs = require('express-handlebars')
const socketio = require('socket.io')
const mongoose = require('mongoose')
const Config = require('../Config/Config')

class App {
  constructor () {
    this.config = {}
    let self = this
    // Load each config objects
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
      if (!appConf.server.CORS && element.name === 'enableCORS') {
        // Exclude enableCORS if disabled
        return
      } else {
        // Load the middleware
        App.use(element)
        if (verbose) console.log('\t\t- ' + element.name)
      }
    })
    /** Routes Setup */
    if (verbose) console.log('\t- Routes Setup')
    Object.keys(appConf.routes).forEach(function (element, index) {
      let method, route, controller, action
      let policies = []
      // Split route to set method and route
      const methodRgxp = /^(?:([a-z]*?) )?(.*)$/i
      method = (methodRgxp.exec(element)[1] + '').toLowerCase()
      route = methodRgxp.exec(element)[2]
      if (['all', 'get', 'post', 'head', 'put', 'delete'].indexOf(method) === -1) {
        method = 'all'
      }
      if (appConf.routes[element].controller) {
        // Use route options if they are set
        if (appConf.routes[element].policies) {
          appConf.routes[element].policies.forEach(function (element, index) {
            policies.push(appConf.policies[element])
          })
        }
        controller = appConf.routes[element].controller
        action = appConf.routes[element].action || 'index'
      } else {
        // Else get controller infos from string
        const ctrlString = appConf.routes[element]
        const tabCtrlStr = ctrlString.split('.')
        controller = tabCtrlStr[0]
        action = tabCtrlStr[1] || 'index'
      }
      // Load the route
      App[method](route, policies, require('./Controllers/' + controller)[action])
      if (verbose) console.log('\t\t- ' + method + ' ' + route + ' : ' + controller + '.' + action)
    })
    /** Errors Handling */
    if (verbose) console.log('\t- Errors Handling')
    App.use(appConf.errors.error404)
    if (App.get('env') === 'development') {
      App.use(appConf.errors.devErrorHandler)
    }
    App.use(appConf.errors.prodErrorHandler)
    /** Connection to MongoDB */
    if (appConf.db) {
      // Connect if mongoDB's config exist
      mongoose.connect(appConf.db.connectStr)
    }
  }

  start () {
    /** Create HTTP Server */
    const serverConfig = this.config.server
    const Server = this.server = http.createServer(this.app)
    Server.listen(serverConfig.port)
    Server.on('error', serverConfig.onError)
    Server.on('listening', serverConfig.onListening)
    /** Create Socket.io Server */
    const Io = this.io = socketio(Server)
    this.config.socketIo.socket(Io)

  }
}

module.exports = App
