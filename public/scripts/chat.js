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
        Socket evenst
*/
// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//al cargar los mensajes enviados borra la notificacion de 'escribiendo'
socket.on('chat:message',function (data) {
    actions.innerHTML = '';
    output.innerHTML += `<p> <span>${data.time} </span>
    <strong>${data.username}</strong>: 
    ${data.message}
    </p>
    `
    output.scrollTop =output.scrollHeight;
})

socket.on('chat:typing', function (user) {
    actions.innerHTML += `
    <p><em>${user} esta escribiendo...</em></p>
    `
})

/*
    Funciones javascript para el cliente
*/
// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}
// mostrar lista de usuarios conectados
function outputUsers(users) {
      userList.innerHTML = '';
      users.forEach((user) => {
          const li = document.createElement('li');
          li.innerText = user.username;
          userList.appendChild(li);
        });
    }
    
    //boton de enviar
    btn.addEventListener('click', () => {
        socket.emit('chat:message', {//Socket.emit envia datos al servidor
            message: message.value,
            username: username
        })
        console.log({
            username: username,
            message: message.value,
        })
    })
    
    //funcion cargar archivos
//boton de compartir imagen
btns.addEventListener('addimage', ()=>{
    
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file.files[0]);
    
    fileReader.onload = (event) => {
        console.log('complete File read succesfully')
    }
})

//mensaje de usuario esta escribiendo
message.addEventListener('keypress', function () {
    socket.emit('chat:typing', username.value);
})

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });