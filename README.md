###Nodejs Price Server
Live Visualization (assuming server is up) [can be found here.](http://zvoryg.in/viz/)

__server.js__ Updates a set of prices every 200ms. On update, it broadcasts using sockets the new price. Includes logging funcionality.

__index.html__ Contains the live visualization. Real-time updating chart of price so far, including 30-day Moving Average. Uses smoothie.js for visualization.

__smoothie.js__ JS Charting library from [http://smoothiecharts.org/](http://smoothiecharts.org/)
