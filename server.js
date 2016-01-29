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
    fs.appendFile('log.txt', new Date() + ": new connection from: " + address + " \n", 
        function (err) {
            if (err) 
                return console.log(err);
            });

    //debug statement for trade messages
   socket.on('trade', function (msg) {
       console.log(msg);
   });
});

//**********************************************
//*****     BOOK CODE
//**********************************************
// We will have a Book object for each symbol being traded
// It will contain the buy and sell orders for each symbol
// It will also contain logic for the resolution of trades
// Orders are added, and when the server calls a function to resolve trades
var books = {};

// Data structure for an individual order 
// dir = "buy" || "sell"
// id is a unqiue is for this order
function Order (symbol, price, dir, id) {
    this.symbol=symbol;
    this.price=price;
    this.dir=dir;
    this.id=id;
}

function Book (symbol) {
    this.symbol = symbol;

    // flag for wether there is new data that has not been sent out
    // empty books should be send out, so initial state is true
    this.updated = true;

    // array of resolved trades, cleaned every time the set of trades is emitted
    var resolved = [];

    // represents the buy and sell orders, ordered by how agrresive the order is
    this.buy = new PriorityQueue({ comparator: function(a, b) { return a.price > b.price; }});
    this.sell = new PriorityQueue({ comparator: function(a, b) { return a.price < b.price; }});

    // resolves all possible trades 
    // sets updated flag to true, indicating there is data to be sent out
    this.resolveTrades = function () {
        while (this.buy.length && this.sell.length && this.buy.peek() >= this.sell.peek()){
            this.resolved.push(this.buy.dequeue());
            this.resolved.push(this.sell.dequeue());
        }
        this.updated = true;
    }
    //adds an order to its queue
    this.addOrder = function(order) {
        this.updated = true;
        if (order.dir === "buy")
            this.buy.queue(order);
        else
            this.sell.queue(order);
    }
}

//resolve trades in each book
//emits any trades that occured
//emits new state of the book
function emitUpdatedBooks () {
    symbols.forEach (function (symbol) {
        var book = books[symbol];
        book.resolveTrades();
        var trades = book.resolved;
        book.resolved = [];
        if (book.updated) {
            if (trades && trades.length > 0)
                io.sockets.emit('trades', trades);
            io.sockets.emit('book', books[symbol]);
            book.update = false;
        }
    });
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
    //modified random walk
    this.updatePrice = function () {
        
        // scales how big the change is based on how long since the stock was last updated
        var timeCoeff = (this.lastUpdate - new Date().getTime()) /100;
        
        // makes price fluctuations smaller as the stock is smaller
        var sizeCoeff = ((this.price < 25) ? (this.price/25) : 1) ;

        // random walk element, delta is in the range [-0.5, 0.5)
        var delta = Math.random() - 0.5;

        // multiplied delta by sizeCoeff and timeCoeff
        // softly ensures price doesnt dip below 0.02
        this.price += timeCoeff * sizeCoeff * delta +((this.price< 1) ? 0.02: 0) ;

        this.lastUpdate = new Date().getTime();
    };
}

function emitUpdatedPrices(){
    //for each symbol, update the corresponding price
    symbols.forEach(function (symbol) {
        var price = prices[symbol];
        price.updatePrice();
        io.sockets.emit('price', price);
    });
}

//**********************************************
//*****     MAIN LOGIC LOOP
//**********************************************
function main () {
    emitUpdatedBooks();
    emitUpdatedPrices();
}


//**********************************************
//*****     INITIALIZATION 
//**********************************************

// generate prices in a normal-ish distribution
function initPrices () {
    // 4 tickers, so we do this 4 times.
    for (var i = 0; i < 4; i++) {
        var sum = 0;
        // sum 2 terms between 0 and 100.
        // average is a stock price of 100, still has healthy variance though
        for (var j =0; j < 2; ++j) 
            sum += Math.random () * 100;

        // create new price object
        var price = new Price (sum, symbols[i]);

        prices[symbols[i]]= price;
    }
}
initPrices();

//create books for every symbol
symbols.forEach(function (entry) {
    books[entry] = new Book (entry);
});

//call the main logic thread every 400ms
setInterval(main, 400);

//indicates init is complete
console.log('Server listening on ' + HOST +':'+ PORT);
