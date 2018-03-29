const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')
const ninjadb = require('ninjadb')
const db = ninjadb.create('db')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

io.on('connection', socket => {
  socket.emit('characters', db.find())

  socket.on('newCharacter', character => {
    db.push(character)
    socket.broadcast.emit('newCharacter', character)
  })
})

nextApp.prepare().then(() => {
  app.get('/characters', (req, res) => {
    res.json(db.find())
  })

  app.get('*', (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(4500, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:4500')
  })
})