const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const {loadAllRestaurant} = require('./models/restaurant.models');
require('dotenv').config();
const PORT = process.env.PORT;
/*
user
restaurant >> kentake, burgetnking m pizzahut m macdkoneks
name , logo , desc : Fast Food, meat, Chicken, Sandwiches , rating
menu , name, price , size meduimprice, small, big, desc , isSpice, 
order
review
*/
const {startMongo} = require('./services/mongo');

async function startServer () {

  await startMongo();
  if(process.argv[2]==='i'){
    await loadAllRestaurant()
  }
  server.listen(PORT , () => {
  console.log('running server');
  })
}

startServer();

