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
  httpUpdateMeal,
  httpGetReviewsForMeal,
  uploadImageMiddleware,
  resizeImageMiddleWare
} = require('./meal.controller')

mealRoute.use(catchAsync(authenticate));
mealRoute.get('/' , catchAsync(httpGetAllMeal));
mealRoute.get('/get/:id' , catchAsync(httpGetSingleMeal));
mealRoute.get('/reviews/:mealid' , catchAsync(httpGetReviewsForMeal))

mealRoute.use(authorized('admin'));
mealRoute.post('/' , catchAsync(httpCreateMeal));
mealRoute.delete('/delete/:id' , catchAsync(httpDeleteMeal));
mealRoute.patch('/update/:id',uploadImageMiddleware ,catchAsync(resizeImageMiddleWare), catchAsync(httpUpdateMeal));

module.exports = mealRoute;
