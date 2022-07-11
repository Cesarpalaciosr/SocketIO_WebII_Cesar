const socket = io(); //no lleva argumento porque esta en el mismo dominio

//DOM elements
let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');
let timeOutId = 0;

btn.addEventListener('click', () => {
    socket.emit('chat:message', {//Socket.emit envia datos al servidor
        message: message.value,
        username: username.value
    })
    console.log({
            username: username.value,
            message: message.value,
        })
})

message.addEventListener('keypress', function () {
    socket.emit('chat:typing', username.value);
})

socket.on('chat:message',function (data) {
    actions.innerHTML = '';
    output.innerHTML += `<p>
    <strong>${data.username}</strong>: ${data.message}
</p>
    
    `
})

socket.on('chat:typing', function (user) {
    actions.innerHTML += `
    <p><em>${user} esta escribiendo...</em></p>
    `
})