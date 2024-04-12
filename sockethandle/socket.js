var io = require('socket.io')();

let users = []

function getIdByName(name) {
    for (const user of users) {
        if (user.name == name) {
            return user.id;
        }
    }
}
function getNameByID(id) {
    for (const user of users) {
        if (user.id == id) {
            return user.name;
        }
    }
}

io.on('connection', (socket) => {
    console.log(socket.id + ' a user connected');
    socket.on('CLIENT_SEND_NAME', data => {
        users.push({
            id: socket.id,
            name: data
        });
        io.emit('SERVER_SEND_CHAO', {
            message: "anh " + data + " moi tham gia phong",
            member: users
        })
    })
    socket.on('CLIENT_SEND_MESSAGE', data => {
        if (data.startsWith('/')) {
            let name = data.split(' ')[0];
            name = name.substr(1,name.length);
            let message = data.slice(name.length+2,data.length);
            socket.to(getIdByName(name)).emit('SERVER_SEND_MESSAGE', {
                message: message,
                to: name,
                from: getNameByID(socket.id)
            });
            socket.emit('SERVER_SEND_MESSAGE', {
                message: message,
                to: name,
                from: getNameByID(socket.id)
            });
        } else {
            io.emit('SERVER_SEND_MESSAGE', {
                message: data,
                to: 'ALL',
                from: getNameByID(socket.id)
            });
        }
    })
    socket.on('disconnect', data => {
        let username;
        for (let index = 0; index < users.length; index++) {
            const element = users[index];
            if (element.id == socket.id) {
                username = element.name;
                users.splice(index, 1);
            }
        }
        io.emit('SERVER_SEND_DISCONNECT', {
            message: "anh " + username + " vua roi phong",
            member: users
        })
    })
});
module.exports = io;