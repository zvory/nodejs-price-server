var io = require('socket.io').listen(9091);
var fs = require('fs');
var bitcoinity = require("bitcoinity");
var PriorityQueue = require('js-priority-queue');

//Our Details
var HOST = 'csclub.uwaterloo.ca';
var PORT = 9090;

var symbols = ['TLO', 'STC', 'MC', 'QXC'];

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
//*****     BOOK CODE
//**********************************************
// We will have a Book object for each symbol being traded
// It will contain the buy and sell orders for each symbol
// It will also contain logic for the resolution of trades
// Orders are added, and when the server calls a function to resolve trades
var books = {};

function Order (symbol, price, dir, id, client) {
    this.symbol=symbol;
    this.price=price;
    this.dir=dir;
    this.id=id;
    this.client=client;
}


function Book (symbol) {
    this.symbol = symbol;

    this.buy = new PriorityQueue({ comparator: function(a, b) { return a.price > b.price; }});
    this.sell = new PriorityQueue({ comparator: function(a, b) { return a.price < b.price; }});

    function resolveTrades() {
        var resolved = [];
        while (this.buy.peek() >= this.sell.peek()){
            resolved.push(this.buy.dequeue());
            resolved.push(this.sell.dequeue());
        }
    }
    function addOrder(order) {
        if (order.dir === "buy")
            this.buy.queue(order);
        else
            this.sell.queue(order);
    }
}


//**********************************************
//*****     PRICE CODE
//**********************************************
var prices = {};

//Models the fair value of a security/stock
function Price (price, symbol) {
    this.symbol = symbol;
    this.price = price;
    this.lastUpdate = new Date().getTime();
    this.updatePrice = function () {
        var timeCoeff = (this.lastUpdate - new Date().getTime()) /100;
        var sizeCoeff = ((this.price < 25) ? (this.price/25) : 1) ;
        var delta = Math.random() - 0.5;
        this.price += timeCoeff * sizeCoeff * delta +((this.price< 10) ? 0.02: 0) ;
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
//*****     MAIN LOGIC LOOP
//**********************************************
function main () {



    emitUpdatedPrices();
}


//**********************************************
//*****     INITIALIZATION 
//**********************************************
function initPrices () {
    for (var i = 0; i < 4; i++) {
        var sum = 0;
        // sum 10 terms between 0, 20 for each, for a ~normal distribution
        for (var j =0; j < 2; ++j) 
            sum += Math.random () * 100;

        var price = new Price (sum, symbols[i]);
        prices[symbols[i]]= price;
    }
}

initPrices();
setInterval(main, 400);
console.log('Server listening on ' + HOST +':'+ PORT);
