//DOM elements
const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
let message = document.getElementById('message');
let btn = document.getElementById('send');
let btns = document.getElementById('share');
const file = document.getElementById('file');
//const status = document.getElementById('status');        
let output = document.getElementById('output');
let actions = document.getElementById('actions'); 
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
const socket = io(); //no lleva argumento porque esta en el mismo dominio


/*
        Socket events
*/
// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });

  socket.on('join:message',function (data) {
    console.log(data);

    actions.innerHTML = '';
    output.innerHTML += `<p> <span>${data.time} </span>
    <strong>${data.username}</strong>
    </p>
    `
    output.scrollTop = output.scrollHeight;
})


  //al cargar los mensajes enviados borra la notificacion de 'escribiendo'
socket.on('chat:message',function (data) {
    console.log(data);

    actions.innerHTML = '';
    output.innerHTML += `<p> <span>${data.time} </span>
    <strong>${data.username}</strong>: 
    ${data.message}
    </p>
    `
    output.scrollTop = output.scrollHeight;
})

socket.on('chat:typing', function (user) {
    actions.innerHTML += `
    <p><em>${user.username} esta escribiendo...</em></p>
    `
})

socket.on('addimage', ()=>{

})


/*
    Funciones javascript para el cliente
*/
    //boton de enviar
    btn.addEventListener('click', () => {
        socket.emit('chat:message', {//Socket.emit envia datos al servidor
            message: message.value,
            username: username,
            room: room
        })
        console.log({
            username: username,
            message: message.value,
            room: room
        })
    })

    addEventListener('keypress', () => {
        socket.emit('chat:typing', {
            username: username,
            room: room
        })
        console.log({
            username: username,
            room: room
        })
    })
    
    
    //funcion cargar archivos
//boton de compartir imagen
/*btns.addEventListener('click', ()=>{
    
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file.files[0]);
    
    fileReader.onload = (event) => {
        console.log('complete File read succesfully')
        socket.emit('user_image', event.target.resul)
    }
})*/

function upload(files) {
    socket.emit("upload", files[0], (status) => {
        console.log(status);
      } 
 );
}
//mensaje de usuario esta escribiendo
message.addEventListener('keypress', function () {
    socket.emit('chat:typing', username);
})

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });

  //nombre de la sala
  function outputRoomName(room) {
        roomName.innerText = room;
  }

  //users al dom
  function outputUsers(users) {
    userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
  }