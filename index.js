var socket = require('socket.io');
var express = require('express');
var app = express();

app.use('/js', express.static('./client/build'));
app.use('/css', express.static('./client/build'));

app.get('/source', function(req, res) {
    res.sendFile(__dirname + '/client/source.html');
});
app.get('/receiver', function(req, res) {
    res.sendFile(__dirname + '/client/receiver.html');
});

var server = app.listen(3000);

var io = require('socket.io')(server);
io.on('connection', client => {
    console.log('connection');
    client.on('source offer', offer => {
        console.log('source offer', offer);
        client.broadcast.emit('source offer', offer);
    })
    client.on('source candidate', c => {
        console.log('source candidate', c);
        client.broadcast.emit('source candidate', c);
    })
    client.on('receiver answer', answer => {
        console.log('receiver answer', answer);
        client.broadcast.emit('receiver answer', answer);
    })
    client.on('receiver candidate', c => {
        console.log('receiver candidate', c);
        client.broadcast.emit('receiver candidate', c);
    })
});
