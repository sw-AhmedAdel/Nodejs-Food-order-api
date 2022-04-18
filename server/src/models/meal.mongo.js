const mongoose = require('mongoose');
const menuSchema = new mongoose.Schema({

  name:{
    type: String,
    required:true,
    unique:true,
  },
  restaurantName : {
    type:String,
    required:true,
  }
  ,
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true,
    
  }
  ,
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Restaurant',
    required:true,
  }
  ,
  image:{
    type: String,
    required:true,
  },
  desc: {
    type: String,
    required:true,
  },
  ratingsAverage : {
    type:Number,
    min:[1 , 'Rating must be above 1'],
    max:[5 ,'Rating must be bellow or equal 5.0'],
    set: val => Math.round(val * 10) / 10 // 4.7
  },
  ratingsQuantity : {
    type:Number,
    default:0
  },
  isSpicy: {
    type: Boolean,
    default: false,
  },
  smallSize: {
    type: Number,
  },
  mediumSize: {
    type: Number,
    required:true,
  },
  bigSize: {
    type: Number,
    required:true,
  },
  category:{
    type: String,
    required:true,
  }
}, {
  timestamps: true,
  toJSON:{virtuals: true},
  toObject:{virtuals: true}
})

const Meal = mongoose.model('Meal', menuSchema);
module.exports = Meal;