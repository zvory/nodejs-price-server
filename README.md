###Nodejs Price Server
WebM recording of visualization here: [zvoryg.in/graph.webm](http://zvoryg.in/graph.webm)

__server.js__ Updates a price variable based on time. On update, it broadcasts using sockets the new price.

__dash.html__ Contains the cool live visualization. Real-time updating chart of price so far, including 30-day Moving Average. Uses smoothie.js for visualization.

__client.js__ Gets prices from server using TCP, not interesting.

__smoothie.js__ JS Charting library from [http://smoothiecharts.org/](http://smoothiecharts.org/)


