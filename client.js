var net = require('net');


var prices =[];

var HOST = '127.0.0.1';
var PORT = 8000;

var client = new net.Socket();
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 

    setInterval (requestPrice.bind(null, client), 100);
    client.write('init connection');

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
    var newPrice = Number((/\bprice (\d+)/.exec(data)[1]));
    console.log('newPrice: ' + newPrice);
    
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});

function requestPrice (client){
    client.write("request: price");
}
