var net = require('net');
var io = require('socket.io').listen(3000);

var HOST = '127.0.0.1';
var PORT = 8000;
var microPrice= 100;

var macroPrice = 100;
var lastThirtyMacroPrice = 100;

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        sock.write("price " + price);
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });
    
}).listen(PORT, HOST);

function updatePrice(){
    microPrice = microPrice + Math.floor (Math.random() * 10) - 5 + (100-microPrice) *0.1;
    macroPrice = macroPrice + Math.floor (Math.random() * 2) - 1 + (100-macroPrice) *0.01;
        io.sockets.emit('price', macroPrice + microPrice * 0.1);
}

setInterval(updatePrice, 50);
console.log('Server listening on ' + HOST +':'+ PORT);
