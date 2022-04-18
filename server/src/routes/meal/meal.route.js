const express = require('express');
const mealRoute = express.Router();

const catchAsync = require('../../authController/catchAsync');
const authenticate = require('../../authController/authenticate');
const authorized = require('../../authController/authorized');

const {
  httpCreateMeal,
  httpDeleteMeal,
  httpGetAllMeal,
  httpGetSingleMeal,
  httpUpdateMeal
} = require('./meal.controller')

mealRoute.use(catchAsync(authenticate));
mealRoute.get('/' , catchAsync(httpGetAllMeal));
mealRoute.get('/get/:id' , catchAsync(httpGetSingleMeal));

mealRoute.use(authorized('admin'));
mealRoute.post('/' , catchAsync(httpCreateMeal));
mealRoute.delete('/delete/:id' , catchAsync(httpDeleteMeal));
mealRoute.patch('/update/:id' , catchAsync(httpUpdateMeal));

module.exports = mealRoute;
