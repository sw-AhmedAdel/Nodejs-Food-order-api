const express = require('express');
const api = express.Router();
const userRoute = require('./user/user.route');
const restaurantRoute= require('./restaurant/restaurant.route');
const mealRoute =require('./meal/meal.route');
const reviewRoute = require('./review/review,.route');

api.use('/reviews' , reviewRoute);
api.use('/meals' , mealRoute)
api.use('/restaurants', restaurantRoute)
api.use('/users', userRoute);

module.exports = api;