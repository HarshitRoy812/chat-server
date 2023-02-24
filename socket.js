const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);


const users = {};

io.on('connection',(socket) => {
    socket.on('new_user',(name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user_joined',name);
    })


    socket.on('send_msg',(message) => {
        socket.broadcast.emit('receive_msg',message,users[socket.id]);
    })
    
    socket.on('disconnect',() => {
        socket.broadcast.emit('user_disconnected',users[socket.id]);
        delete users[socket.id];
    })
})
httpServer.listen(3000);