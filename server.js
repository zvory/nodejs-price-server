var io = require('socket.io').listen(9091);
var fs = require('fs');

//Our Details
var HOST = 'csclub.uwaterloo.ca';
var PORT = 9090;

var symbols = ['TLO', 'STC', 'MC', 'RTZ'];
var prices = [];

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
    prices = prices.map(function (entry) {
        return Math.abs(entry + Math.random() - 0.5);
    });
    
    prices.forEach(function (entry, index) {
        io.sockets.emit('price', {type:'price', symbol:symbols[index], price:prices[index]});
    });

}
setInterval(updatePrice, 200);


//**********************************************
//*****     INITIALIZATION 
//**********************************************
function initPrices () {
    for (var i = 0; i < 4; i++) {
        var sum = 0;
        // sum 10 terms between 0, 20 for each, for a ~normal distribution
        for (var j =0; j < 5; ++j) 
            sum += Math.random () * 40;
        prices.push (Math.floor(sum));
        console.log(Math.floor(sum));
    }
}

initPrices();
console.log('Server listening on ' + HOST +':'+ PORT);
