const path = require('path')
const express = require('express');
const app = express();
const cors = require("cors");
const port = 3000;
const server = app.listen (port, () => { console.log(`sever on port: ${port}`) })
const io = require('socket.io')(server);
const formatMessage = require('./utils/messages')
const {userJoin, userLeave, getCurrentUser, getRoomUsers} = require('./utils/user')
const  { writeFile } = require("fs");

//static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "application/json","X-Content-Type-Options: nosniff",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  next();
});
``
//webSockets 
io.on('connection', (socket) =>{ //es la conexion al socket
   console.log('id de usuario: '+socket.id)

    //El primer parametro de la funcion hace referencia al nombre del evento creado
    //Espera los mensajes para emitirlos a las personas conectadas
    
    //ingresan a la sala
    socket.on('joinRoom', ({username, room})=>{
      const user = userJoin(socket.id, username, room);
      console.log(`new connection Socket_id: ${socket.id} name: ${user.username } room: ${user.room}`)
        socket.join(user.room);

        socket.broadcast.to(user.room).emit('join:message',formatMessage( `El usuario ${user.username} se ha unido a la sala `))


        //envia el nombre de usuario y la sala
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
    })
    
    socket.on('chat:message', (data) => {//Socket.on escucha los eventos
            const user = getCurrentUser(socket.id)
      console.log(data.room, data.username, data.message);
            io.to(data.room).emit('chat:message',formatMessage(data.username, data.message ) );
        });   
    

    socket.on('chat:typing', (user) => {
      const data = getCurrentUser(socket.id)
      socket.broadcast.to(user.room).emit('chat:typing',user)//emite a todos menos al que origino el envio
    })

    socket.on("upload", (file, callback) => {
      console.log(file); // <Buffer 25 50 44 ...>
      io.sockets.emit('addimage', `${file.username} envio este archivo`)
      // save the content to the disk, for example
      writeFile("/tmp/upload", file, (err) => {
        callback({ message: err ? "failure" : "success" });
      });
    });

    socket.on ('disconnect', () =>{
        const user = userLeave(socket.id);
        
        if (user) {
            io.to(user.room).emit('chat:message', formatMessage(user.username, ` ha salido del chat`))
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
              room: user.room,
              users: getRoomUsers(user.room),
            });
          }
        } 
        )

})

