const express = require('express');
const restaurantRoute = express.Router();

const catchAsync = require('../../authController/catchAsync');
const authenticate = require('../../authController/authenticate');
const authorized = require('../../authController/authorized');

const {
  httpCreateRestaurant,
  httpDeleteRestaurant,
  httpGetAllRestaurant,
  httpGetSingleRestaurant,
  httpUpdateRestaurant,
  httpGetResturantMeals
} = require('./restaurant.controller')

restaurantRoute.use(catchAsync(authenticate));
restaurantRoute.get('/' , catchAsync(httpGetAllRestaurant));
restaurantRoute.get('/get/:id' , catchAsync(httpGetSingleRestaurant));
restaurantRoute.get('/meals/:resid', catchAsync(httpGetResturantMeals));

restaurantRoute.use(authorized('admin'));
restaurantRoute.post('/' , catchAsync(httpCreateRestaurant));
restaurantRoute.delete('/delete/:restaurantid' , catchAsync(httpDeleteRestaurant));
restaurantRoute.patch('/update/:id' , catchAsync(httpUpdateRestaurant));

module.exports = restaurantRoute;
