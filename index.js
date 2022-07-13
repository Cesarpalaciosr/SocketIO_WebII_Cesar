const path = require('path')
const express = require('express');
const app = express();
const cors = require("cors");
const port = 3000;
const server = app.listen (port, () => { console.log(`sever on port: ${port}`) })
const io = require('socket.io')(server);
const formatMessage = require('./utils/messages')
const {userJoin, userleave, getCurrentUser, getRoomUsers} = require('./utils/user')
//static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "application/json",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  next();
});

//webSockets 
io.on('connection', (socket) =>{ //es la conexion al socket
    console.log('new connection Socket_id: '+socket.id)

    //El primer parametro de la funcion hace referencia al nombre del evento creado
    //Espera los mensajes para emitirlos a las personas conectadas
    
    //ingresan a la sala
    socket.on('joinRoom', ({username, room})=>{

        socket.broadcast.emit('message', `El usuario se ha unido a la sala ${username}`)
    })
    
    socket.on('chat:message', function(data){//Socket.on escucha los eventos
            console.log(data);
            io.sockets.emit('chat:message',formatMessage(data.username, data.message ) );
        });   
    

    socket.on('chat:typing', function (user) {
        socket.broadcast.emit('chat:typing',user)//emite a todos menos al que origino el envio
    })

    socket.on('addimage', function (file) {
        io.sockets.emit('add.image'), `${file.username} envio este archivo`
    })

    socket.on ('disconnect', (data) =>{
        io.emit('message', formatMessage(data.username, ` ha salido del chat`))
    })
})

