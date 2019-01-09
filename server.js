let clientCount = 0;

let connectedClients = {};

const express = require('express');

const app = express();

const server = require('http').Server(app);

const io = require('socket.io')(server);

const session = require('express-session')({
    secret: 'keyboardkittehMEEEEEEEEEEEOOOOWWWWWWWWWWWWWWWWW',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
});

const bodyParser = require('body-parser');

const path = require("path");

app.use(session);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "./public")));

app.set('views', path.join(__dirname, './views'));

app.set('view engine', 'ejs');

io.on('connection', function (socket) {

    console.log(socket.id);
    socket.on('newClient', function (newClient) {
        socket.username = newClient;
        ++clientCount;
        connectedClients[socket.id] = socket.username;
        console.log(`Made user. heres the updated connected clients`);
        
        console.log(connectedClients);
        io.emit('update_all', {clientCount:clientCount, connectedClients:connectedClients});
    });


    socket.on('new_message', function (data) {
        console.log(data);
        if(data.msg === ''){
            socket.emit('invalid_string', {msg:'Not a valid string. Please try again'});
            return;
        }
        io.emit('processed_message', data);
    });


    socket.on('disconnect', function (userData) {
        --clientCount;
        delete connectedClients[socket.id];
        console.log(`user dissconnected. here is the updated conneced clients`);
        console.log(connectedClients);
        io.emit('update_all', {clientCount:clientCount, connectedClients:connectedClients});
    });

});


app.get('/', function (request, response) {
    request.session.loggedIn = true;
    response.render('index');
});

server.listen(1337);

