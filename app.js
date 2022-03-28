const express = require('express')
const socketio = require('socket.io')
const path = require('path')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.render('index')
})

const server = app.listen(3000, ()=>{
    console.log('Start server at localhost:3000')
})

// Initialize socket for the server 
const io = socketio(server)

io.on('connection', (socket)=>{
    console.log('New user connected')

    socket.username = 'Anonymous'
    socket.on('change_username', data =>{
        socket.username = data.username
    })

    // handle new message 
    socket.on('new_message', data =>{
        console.log("new message")
        io.sockets.emit('receive_message', {message: data.message, username: socket.username})
    })

    socket.on('typing',data=>{
        socket.broadcast.emit('typing', {username: socket.username})
    })
})