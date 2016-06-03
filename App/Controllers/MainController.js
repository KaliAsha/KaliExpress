/* Dependencies */

const MainController = {
  index: function (req, res) {
    res.render('index', { message: 'Hello World' })
  }
}

module.exports = MainController
