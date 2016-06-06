/* Dependencies */

const Server = {
  port: 8080,
  CORS: true,
  onError: function (error) {
    throw error
  },
  onListening: function () {
    console.log('Server started on ' + Server.port)
  }
}

module.exports = Server
