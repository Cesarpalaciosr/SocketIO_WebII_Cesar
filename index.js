const path = require('path')
const express = require('express');
const app = express();
const port = 3000;
const server = app.listen (port, () => { console.log(`sever on port: ${port}`) })
const io = require('socket.io')(server);

//static files
app.use(express.static(path.join(__dirname, 'public')));

//webSockets 
io.on('connection', (socket) =>{
    console.log('new connection Socket_id: '+socket.id)
    socket.on('event', function(data){
        console.log('event fired');
        });
})

