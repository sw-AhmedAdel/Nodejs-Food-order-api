
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
  rating: {
    type:Number,
    default:0
  }
 

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

const Restaurant = mongoose.model('Restaurant' , restaurantSchema);
module.exports = Restaurant;
