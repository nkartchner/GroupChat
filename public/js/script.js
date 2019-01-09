$(document).ready(function () {
    let loggedIn = false;
    console.log('ready');
    let clientName = prompt('Welcome! Please enter your name');
    while(clientName === "" || clientName === null){
        clientName = prompt('You must enter a name');
    }
    
    const socket = io();

    socket.username = clientName;

    let $messageInput = $('#message_input'),
        $btn = $('#msgSubmit'),
        $board = $('#message_board'),
        $clientCount = $('#clientCount'),
        $connected = $("#connected_users");


    $btn.click(function (e) {
        e.preventDefault();
        console.log('clicked');
        socket.emit('new_message', { msg: $messageInput.val(), user: socket.username });
        $messageInput.val("");
        return false;
    });

    socket.on('connect', function () {
        console.log(`connection Successfull`);
        console.log(socket.id);
        socket.emit('newClient', clientName);
    });


    socket.on('invalid_string', function (data) {
        console.log(data.msg);
        if (data.username) {
            console.log(data.msg);
        }
    });

    socket.on('processed_message', function (msgData) {
        let msg = `
        <section id="users_name">${msgData.user}:</section>
        <section id="message_content">${msgData.msg}</section>`;

        $board.append(msg);
    });

    socket.on('update_all', function (data) {
        $connected.empty();
        let i =0;
        for (const userid in data.connectedClients) {
            console.log(`in the loop going ${++i} time(s)`);   
            console.log(userid);
            console.log(data.connectedClients[userid]);
            $("#connected_users").append(`<h3 id="${userid}"> ${data.connectedClients[userid]} </h3>`);
        }

        $clientCount.text(data.clientCount);
    });


});