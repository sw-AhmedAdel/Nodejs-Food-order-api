const express = require('express');
const reviewRoute = express.Router();

const catchAsync = require('../../authController/catchAsync');
const authenticate = require('../../authController/authenticate');
const authorized = require('../../authController/authorized');

const {
  httpCreateReview,
  httpDeleteReview,
  httpGetAllReview,
  httpGetSingleReview,
  httpUpdateReview
} = require('./review.controller')

reviewRoute.use(catchAsync(authenticate));
reviewRoute.get('/get/:id' , catchAsync(httpGetSingleReview));
reviewRoute.post('/add/:mealid' , authorized('user') ,catchAsync(httpCreateReview));
reviewRoute.patch('/update/:reviewid' , authorized('user')  , catchAsync(httpUpdateReview));
reviewRoute.delete('/delete/:reviewid' , catchAsync(httpDeleteReview));

reviewRoute.use(authorized('admin'));
reviewRoute.get('/' , catchAsync(httpGetAllReview));

module.exports = reviewRoute;
