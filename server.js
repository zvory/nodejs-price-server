var io = require('socket.io').listen(9091);
var fs = require('fs');
var bitcoinity = require("bitcoinity");

//Our Details
var HOST = 'csclub.uwaterloo.ca';
var PORT = 9090;

var symbols = ['TLO', 'STC', 'MC', 'RTZ'];

//**********************************************
//*****     SOCKETS TO DASHBOARD
//**********************************************
// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection

io.on('connection', function(socket){
    var address = socket.handshake.address;

    //stdout logging
    console.log(new Date() + ": new connection from: " + address);

    //file logging
    fs.appendFile('log.txt', new Date() + ": new connection from: " + address + " \n", function (err) { if (err) return console.log(err); });
});

//**********************************************
//*****     PRICE CODE
//**********************************************
var prices = {};

function Price (fairValue, price, symbol) {
    this.symbol = symbol;
    this.price = price;
    this.fairValue = fairValue;
    this.lastUpdate = new Date().getTime();

    this.updateFairValue = function (fairValue) {
        this.fairValue = fairValue;
    };
    this.updatePrice = function () {
        var coeff = (this.lastUpdate - new Date().getTime()) / 100;
        var delta = Math.random() - 0.5 + (this.price - fairValue) * 0.01;
        this.price += coeff * delta;
        this.lastUpdate = new Date().getTime();
    };
}



function emitUpdatedPrices(){
    symbols.forEach(function (symbol) {
        var price = prices[symbol];
        price.updatePrice();
        io.sockets.emit('price', {type:'price', symbol:symbol, price:price.price});
    });
}


//**********************************************
//*****     INITIALIZATION 
//**********************************************
function initPrices () {
    for (var i = 0; i < 4; i++) {
        var sum = 0;
        // sum 10 terms between 0, 20 for each, for a ~normal distribution
        for (var j =0; j < 5; ++j) 
            sum += Math.random () * 40;

        var price = new Price (sum, sum, symbols[i]);
        prices[symbols[i]]= price;
    }
}

initPrices();
setInterval(emitUpdatedPrices, 200);
console.log('Server listening on ' + HOST +':'+ PORT);
