var socket = require('socket.io-client')('http://localhost:3000');

function hasUserMedia() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.msGetUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    return !!navigator.getUserMedia;
}

function hasRTCPeerConnection() {
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.msRTCPeerConnection;
    return !!window.RTCPeerConnection;
}

var yourVideo = document.getElementById("yours");
var theirVideo = document.getElementById("theirs");

var theirConnection;

if (hasUserMedia() && hasRTCPeerConnection()) {
    startPeerConnection();
} else {
    alert("err");
}

socket.on('source offer', offer => {
    theirConnection.setRemoteDescription(offer);
    theirConnection.createAnswer().then(offer => {
        theirConnection.setLocalDescription(offer);
        theirConnection.createAnswer().then(answer => {
            theirConnection.setLocalDescription(answer);
            socket.emit('receiver answer', answer);
        })
    })
})

socket.on('source candidate', candidate => {
    console.log(candidate);
    if(candidate){
        theirConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
})



function startPeerConnection() {
    var config = {
        'iceServers': [{ 'url': 'stun:stun.services.mozilla.com' }, { 'url': 'stun:stunserver.org' }, { 'url': 'stun:stun.l.google.com:19302' }]
    };
    theirConnection = new RTCPeerConnection(config);

    theirConnection.onicecandidate = function(e) {
        if (e.candidate) {
            socket.emit('receiver candidate', e.candidate);
        }
    }
    theirConnection.onaddstream = function(e) {
        theirVideo.src = window.URL.createObjectURL(e.stream);
    }
}
