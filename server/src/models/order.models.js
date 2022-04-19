const Order= require('./order.mongo');

async function CreateOrder(order) {
  const newOrder = await Order.create(order);
  return newOrder
}

async function GetALLOrders(filter){
  return await Order.find(filter).populate('user');
}

async function FindOurder (id) {
  return await Order.findOne({
    _id : id
  })
}
module.exports = {
  CreateOrder,
  GetALLOrders,
  FindOurder
}
