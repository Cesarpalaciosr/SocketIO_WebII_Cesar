const users = [];

function userJoin(id, username, room) {
    const user  = {id, username, room};

    users.push(user);

    return user;
}

//usuario actual
function getCurrentUser(id) {
    return users.find(user => user.id === id)
}

//usuario deja el chat
function userleave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index,1);
    }
}

//salas 

function getRoomUsers(room) {
    return users.filter(user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userleave,
    getRoomUsers
}