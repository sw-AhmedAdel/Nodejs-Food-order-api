
const mongoose= require('mongoose');
const reviewSchema = new mongoose.Schema({

  review:{
    type:String,
    required:true,
  },
  rating: {
    type:Number,
    required:true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  },
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Meal'
  }

}, {
  timestamps:true,
  toJSON:{virtuals : true},
  toObject:{virtuals:true},
})

const Review = mongoose.model('Review' , reviewSchema);
module.exports = Review;