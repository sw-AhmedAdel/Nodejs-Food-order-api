const mongoose = require('mongoose');
const singleOrderItemSchema = mongoose.Schema({
  name : {type: String , required: true},
  image : {type: String , required: true},
  price : {type: Number , required: true},
  quantity : {type: Number , required: true},
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref:'Meal'
  }
})

const orderShcema = new mongoose.Schema({
  tax : {
    type : Number ,
    required: true,
  },

  deliveryFee : {
    type : Number ,
    required: true,
  },
  subTotal : {
    type : Number ,
    required: true,
  },
  total : {
    type : Number ,
    required: true,
  },
  orderItems: [ singleOrderItemSchema ]
  ,
  status: {
    type:String,
    default:'paid',
  }
  ,
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
  },
},{
  timestamps:true,
  toJSON:{virtuals: true},
  toObject:{virtuals: true}
})

const Order = mongoose.model('Order', orderShcema );
