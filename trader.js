
var io = require('socket.io').listen(app);


// Send current time every 10 secs
setInterval(sendTime, 10000);

// Emit welcome message on connection
io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });

    socket.on('i am client', console.log);
});

app.listen(3000);
var HOST = 'csclub.uwaterloo.ca';
var PORT = 9091;

var id = new Date().getTime();

var symbols = ['TLO', 'STC', 'MC', 'QXC'];
var fairValues = {};
var books = {};

socket.on('connect', function () {
    socket.on('price', function (msg) {
        fairvalues[msg.symbol] = msg.price;
    });
    socket.on('trades', function (msg) {
        console.log(msg);
    });
    socket.on('book', function (msg) {
        console.log(book);
        books[msg.symbol] = msg;
    });
});

function makeTrades () {
    var index = Math.floor (Math.random() * 4);
    var book = books[symbols[index]];

   io.emit('', { time: new Date().toJSON() });

}

symbols.forEach(function (entry) {
    fairValues[entry] = -1;
});


