/* Dependencies */
const express = require('express')

const Router = express.Router()

Router.get('/', function(req, res) {
  res.render('index', {message: 'Hello World'})
})

module.exports = Router