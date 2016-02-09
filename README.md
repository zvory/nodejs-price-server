###Nodejs Price Server
Live Visualization of realistically generated prices [can be found here](http://zvoryg.in/viz/) (assuming the server is up).

__server.js__ Updates a set of prices every 400ms. The simulation is relatively sophisticated, it is based on real world economics. All prices are initially generated in a normal distribution, and from there are modeled by a biased random walk. 

__index.html__ Contains the live visualization. Real-time updating charts of prices, including 30-day Moving Average. Uses [smoothie.js](http://smoothiecharts.org/) for visualization.

The rest of the files are unimportant, and are just prototypes of ideas I had while coding.

#####TODO
Note: this project is no longer under active development.  
 - Fix code quality and architecture
 - Performance improvements



