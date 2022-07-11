const path = require('path')
const express = require('express');
const app = express();
const port = 3000;
const server = app.listen (port, () => { console.log(`sever on port: ${port}`) })
const io = require('socket.io')(server);

//static files
app.use(express.static(path.join(__dirname, 'public')));

//webSockets 
io.on('connection', (socket) =>{ //es la conexion al socket
    console.log('new connection Socket_id: '+socket.id)
    socket.on('chat:message', function(data){//Socket.on escucha los eventos
            console.log(data);
            io.sockets.emit('chat:message',data);
        });   
    
    socket.on('chat:typing', function (user) {
        socket.broadcast.emit('chat:typing',user)//emite a todos menos al que origino el envio
    })
})

