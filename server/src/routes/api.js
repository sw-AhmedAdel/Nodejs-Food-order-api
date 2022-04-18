const express = require('express');
const api = express.Router();
const userRoute = require('./user/user.route');
const restaurantRoute= require('./restaurant/restaurant.route');
 
api.use('/restaurants', restaurantRoute)
api.use('/users', userRoute);

module.exports = api;