/* Dependencies */
const Application = require('./App/App')
const App = new Application()

console.log('Initialisation...')
App.init()

console.log('Starting server...')
App.start()
