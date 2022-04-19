
const mongoose = require('mongoose');
const restaurantSchema = new mongoose.Schema({

  name: {
    type :String,
    required:true,
    unique:true,
  },
  user: {
    type : mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
  }
  ,
  logo: {
    type :String,
    required:true,
  },
  desc: {
    type :String,
    required:true,
  },
  ratingsAverage : {
    type:Number,
    set: val => Math.round(val * 10) / 10, // 4.7
    default:0
  },
  ratingsQuantity : {
    type:Number,
    default:0
  },

}, {
  timestamps: true,
  toJSON: {virtuals : true},
  toObject: {virtuals : true}
})

restaurantSchema.pre(/^find/ , function(next) {
  this.populate({
    path:'user',
    select:'name'
  })
  next();
}) 

restaurantSchema.virtual('meals', {
   ref:'Meal',
   foreignField:'restaurant',
   localField:'_id',
})

restaurantSchema.pre(/^findOne/ , function(next){
  this.populate({
    path:'meals',
    select:'name image desc mediumSize bigSize -restaurant smallSize ratingsAverage ratingsQuantity'
  })
  next();
})

 
const Restaurant = mongoose.model('Restaurant' , restaurantSchema);
module.exports = Restaurant;
