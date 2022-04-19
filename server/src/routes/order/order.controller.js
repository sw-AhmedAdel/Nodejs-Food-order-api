const Meal = require('../../models/meal.mongo');
const appError = require('../../handelErros/class.handel.errors')
const stripe = require('stripe')(process.env.STRIPTE_SECRET_KEY);
const {checkPermessions} =require('../../services/query');

require('dotenv').config();

const {
  CreateOrder,
  GetALLOrders,
  FindOurder
} = require('../../models/order.models');


async function httpCreateOrder( req, res ,next) {
 
 const {items: cartItems , tax , deliveryFee} = req.body;
 if(!cartItems || cartItems.length < 0) {
  return next(new appError('No cart Items provied'))
 }
 if(!tax || !deliveryFee) {
  return next(new appError('Please provide tax and delivery Fee'))
 }
 
 let subTotal=0;
 let orderItems=[];
 let price;
 for(const item of cartItems) {
   // check if meal is exits in the  mongo
   if(item.smallSize) price=item.smallSize;
   if(item.mediumSize) price=item.mediumSize;
   if(item.bigSize) price=item.bigSize;

   const meal = await Meal.findOne({_id : item.meal});
   if(!meal) {
    return next(new appError('No meal was found'))
   }
   const {mealName , image , _id} = meal;
   const getSingleMeal= {
    quantity: item.quantity,
    name:mealName,
    image,
    price,
    meal:_id,
   }
   subTotal+= price * item.quantity;
   orderItems = [...orderItems , getSingleMeal];
  }
  total = subTotal + tax + deliveryFee;
  const order = {
    orderItems,
    tax,
    deliveryFee,
    user:req.user._id,
    total,
    subTotal,
  }

  await getCheckoutSession( req, res,order , req.user , next)
}

async function getCheckoutSession ( req, res,order , user  , next) {

  let line_items_order = [];  
  
  for(const item of order.orderItems) {
   const meal = await Meal.findOne({_id :item.meal })
   const obj = {
    name: `${item.name}`,
    description: meal.desc,
    amount: item.price * 100,
    currency: 'usd',
    quantity: item.quantity,
   }
   line_items_order=[...line_items_order , obj];
  }

  try{
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/meals`,
    customer_email: user.email,
   // client_reference_id: user._id,
    line_items:line_items_order
  });

  const newOrder= await CreateOrder(order);
  return  res.status(201).json({
    status: 'success',
    session:session,
    
  }); 
 } catch(err) {
  return next (new appError ('Could not make the payment, please try again later', 400))
 } 
}


async function httpGetALLOrders( req, res ,next) {
  const orders = await GetALLOrders()
  return res.status(200).json({
    status:'success',
    results:orders.length,
    data: orders
  })
}

async function httpSingleOrder( req, res ,next) {
  const {orderid} = req.params;
  const order = await FindOurder(orderid);
  if(!order) {
    return next (new appError('Order was not found'));
  }

  if(!checkPermessions(req.user , order.user)) {
    return next (new appError('You do not have permissions to do this action'));
  }

  return res.status(200).json({
    status:'success',
    data : order
  })
}


async function httpGetCurrentUserOrders( req, res ,next) {
  const filter = {
    user : req.user._id
  }
  const orders = await GetALLOrders(filter);
  return res.status(200).json({
    status:'success',
    results: orders.length ,
    data: orders
  })
}

module.exports = {
httpCreateOrder,
httpGetALLOrders,
httpGetCurrentUserOrders,
httpSingleOrder,
 }