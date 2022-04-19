const express = require('express');
const orderRoute = express.Router();
const {
httpCreateOrder,
httpGetALLOrders,
httpGetCurrentUserOrders,
httpSingleOrder,
} = require('./order.controller');

const catchAsync = require('../../authController/catchAsync');
const authenticate = require('../../authController/authenticate');
const authorized = require('../../authController/authorized');


orderRoute.use(catchAsync(authenticate));
orderRoute.post('/'  , catchAsync( httpCreateOrder));
orderRoute.get('/my/orders' , catchAsync(httpGetCurrentUserOrders));
orderRoute.get('/order/:orderid' ,catchAsync( httpSingleOrder));
 
orderRoute.use(authorized('admin'));
orderRoute.get('/' , catchAsync( httpGetALLOrders));

module.exports= orderRoute;