$(document).ready(function () {
    let loggedIn = false;
    console.log('ready');
    
    console.log(loggedIn);
    const socket = io();
    
    let clientName = prompt('Welcome! Please enter your name');
    


    let $messageInput = $('#message_input');
    let $message_content = $('#message_content');
    let $username = $('#username');
    let $btn = $('#msgSubmit');
    let $board = $('#message_board');
    let $form = $('#message_form');
    let $clientCount = $('#clientCount');

    socket.emit('newClient', {name:clientName, loggedIn:loggedIn});

    socket.on('loggedin', function(isLoggedIn){
        loggedIn = isLoggedIn;
    });
   
    socket.on('welcome', (clientCount) => {
        let welcomeMsg = `Welcome to the group chat ${socket.username}!`;
        $board.append(`<section id="new_user">${socket.username} Joined the chat room!</section>`);
    });
   
    $btn.click(function(e){
        e.preventDefault();
        console.log('clicked');
        
        socket.emit('new_message', {msg:$messageInput.val(), user:socket.username});
        $messageInput.val("");
        return false;
    });

    socket.on('processed_message', function(msgData){
        let msg = `
        <section id="message_content">${msgData.msg}</section>
        <section id="users_name">${msgData.username}</section>
        `;
        $board.append(msg);
        console.log(msgData);
        
        // $board.append().html(msg);
    });

    socket.on('newClient to all', function(data){
        $board.append(data.username);
        $clientCount.text(data.clientCount);
    });

    socket.on('user disconnected', function(clientCount){
        console.log(clientCount);
        $clientCount.text(clientCount);
    });

});