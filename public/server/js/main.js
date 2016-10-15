const socket = io.connect('http://localhost:9823');

socket.on('chat message', function(data) {
    console.log(data);
});

socket.emit('chat message', 'Hola Mundo');
