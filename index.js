var socket = require('socket.io');
var express = require('express');
var app = express();

app.use('/js', express.static('./client/build'));
app.use('/css', express.static('./client/build'));

app.get('/source', function(req, res) {
    res.sendFile(__dirname + '/client/source.html');
});

var server = app.listen(3000);

var io = require('socket.io')(server);
io.on('connection', client => {
    console.log('connection');
    client.on('offer', offer => {
        console.log(offer)
    })
});
