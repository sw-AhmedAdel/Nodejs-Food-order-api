const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const {loadAllRestaurant} = require('./models/restaurant.models');
const {loadAllMeal} = require('./models/meal.modles');
const Meal = require('./models/meal.mongo');
const restaurant = require('./models/restaurant.mongo');
const reviews = require('./models/review.mongo')
require('dotenv').config();
const PORT = process.env.PORT;
/*
user
 ok restaurant >> kentake, burgetnking m pizzahut m macdkoneks 
ok name , logo , desc : Fast Food, meat, Chicken, Sandwiches , rating
ok meals , name, price , size meduimprice, small, big, desc , isSpice, 

git ppopulate and virtals
review add review to meal and rating will be reflected on meal and the resturant

// order
menu
*/
const {startMongo} = require('./services/mongo');

async function startServer () {

  await startMongo();
   //await reviews.deleteMany()
  if(process.argv[2]==='i'){
    await loadAllRestaurant()
    await loadAllMeal();
  }
  
  server.listen(PORT , () => {
  console.log('running server');
  })
}

startServer();

