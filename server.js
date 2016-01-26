var io = require('socket.io').listen(9091);
var fs = require('fs');

//Our Details
var HOST = 'csclub.uwaterloo.ca';
var PORT = 9090;

var price = 100;

//**********************************************
//*****     SOCKETS TO DASHBOARD
//**********************************************
// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection

io.on('connection', function(socket){
    console.log(new Date() + ": new connection");

fs.appendFile('log.txt', new Date() + ": new connection \n", function (err) {
    if (err) return console.log(err);
});
});

//**********************************************
//*****     PRICE CODE
//**********************************************
function updatePrice(){
    //microPrice = microPrice + Math.ciel (Math.random() * 10) - 5 + (100-microPrice) *0.1;
    //macroPrice = macroPrice + Math.ciel (Math.random() * 2) - 1 + (100-macroPrice) *0.01;
    price += Math.random() - 0.5 + (100-price) * 0.001;
    io.sockets.emit('price', price);
}
setInterval(updatePrice, 50);


//**********************************************
//*****     INITIALIZATION 
//**********************************************
console.log('Server listening on ' + HOST +':'+ PORT);
