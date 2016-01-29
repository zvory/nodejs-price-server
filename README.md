###Nodejs Price Server
Live Visualization (assuming server is up) [can be found here.](http://zvoryg.in/viz/)

__server.js__ Updates a set of prices every 400ms. The simulation is relatively sophisticated, it is based on real world economics. On update, it broadcasts using sockets the new price. Includes logging funcionality.

__index.html__ Contains the live visualization. Real-time updating charts of prices, including 30-day Moving Average. Uses [smoothie.js](http://smoothiecharts.org/) for visualization.

__trader.js__ The begginings of a bot which will model institutional investors.


#####Roadmap
Agent based simulation:
 - super basic bots to model the markets
   - some way to model order book i.e. "spread"
   - some way to handle trades



