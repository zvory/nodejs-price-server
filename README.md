###Nodejs Price Server
Live Visualization (assuming server is up) [can be found here.](http://zvoryg.in/viz/)

__server.js__ Updates a set of prices every 400ms. The simulation is relatively sophisticated, it is based on real world economics. On update, it broadcasts using sockets the new price. Includes logging funcionality.

__index.html__ Contains the live visualization. Real-time updating charts of prices, including 30-day Moving Average. Uses [smoothie.js](http://smoothiecharts.org/) for visualization.

The rest of the files are unimportant, and are just prototypes of ideas I had while coding.

#####TODO
Note: this project is no longer under active development.  
 - Fix code quality and architecture
 - Performance improvements



