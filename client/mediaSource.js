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

var yourConnection;

if (hasUserMedia()) {
    navigator.getUserMedia({ video: true, audio: false },
        stream => {
            yourVideo.src = window.URL.createObjectURL(stream);
            console.log(stream);
            if (hasRTCPeerConnection()) {
                startPeerConnection(stream);
            } else {
                alert("hasRTCPeerConnection err");
            }
        },
        err => {
            console.log(err);
        })
}

socket.on('connect', function() {});
socket.on('event', function(data) {});
socket.on('disconnect', function() {});

function startPeerConnection(stream) {
    var config = {
        'iceServers': [{ 'url': 'stun:stun.services.mozilla.com' }, { 'url': 'stun:stunserver.org' }, { 'url': 'stun:stun.l.google.com:19302' }]
    };
    yourConnection = new RTCPeerConnection(config);
    yourConnection.onicecandidate = function(e) {
        // if (e.candidate) {
        //     theirConnection.addIceCandidate(new RTCIceCandidate(e.candidate));
        // }
        console.log(e);
    }
    yourConnection.addStream(stream);
    yourConnection.createOffer().then(offer => {
        console.log(offer);
        yourConnection.setLocalDescription(offer);
        socket.emit('offer',offer);
    });
}
