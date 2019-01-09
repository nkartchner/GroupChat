let clientCount = 0;
let clients = {};
let messages = {};
let master = {
    clients: {},
    messages: {},
    clientCount: 0
};



const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const server = require('http').Server(app);
server.listen(1337);

const io = require('socket.io')(server);

const session = require('express-session')({
    secret: 'keyboardkittehMEEEEEEEEEEEOOOOWWWWWWWWWWWWWWWWW',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
});

const sharedsession = require("express-socket.io-session");

const path = require("path");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "./public")));

app.set('views', path.join(__dirname, './views'));

app.set('view engine', 'ejs');


io.on('connection', function (socket) {
    let loggedIn = false;
    
    socket.on('newClient', function (newClientObj) {
        if(newClientObj.loggedIn) return;
        if(socket.username == newClientObj.name) return;
        socket.username = newClientObj.name;
        ++clientCount;
        loggedIn = true;
        socket.emit('loggedin', loggedIn)
        io.emit('newClient to all', {username:socket.username, clientCount:clientCount});
    });

    socket.on('new_message', function(data){
        console.log(data);
        io.emit('processed_message', data);
    });
    
    socket.on('dissconnect', function(){
        clientCount--;
        io.emit('user disconnected', clientCount);
    });

});


app.get('/', function (request, response) {
    response.render('index');
});


app.listen(8000, function () {
    console.log(`Listening on port 8000`);
});