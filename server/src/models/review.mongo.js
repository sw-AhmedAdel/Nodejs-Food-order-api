
const mongoose= require('mongoose');
const Meal = require('./meal.mongo');
const Restaurant = require('./restaurant.mongo');

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



reviewSchema.statics.calcAvgRatingsOnMeal = async function (meal_id) {
 
  const statsReviews = await Review.aggregate([

    {
      $match: {
        meal : meal_id, 
      }
    }
    ,
    {
      $group: {
       _id:'$review', 
       numRatings: {$sum : 1},
       numAvg : {$avg:'$rating'},
      }
    }
  ])
  
  const meal = await Meal.findByIdAndUpdate(meal_id , {
    ratingsAverage :statsReviews[0]?.numAvg || 0,
    ratingsQuantity: statsReviews[0]?.numRatings || 0
   })
   
  const statsMeals = await Meal.aggregate([
    {
      $match: {restaurantName: meal.restaurantName}
    },
    {
      $group:{
        _id:null,
        numAvg:{$avg:'$ratingsAverage'},
        numRatings:{$sum:'$ratingsQuantity'}
      }
    }
  ])

 const restaurant = await Restaurant.findOneAndUpdate({name: meal.restaurantName })
 restaurant.ratingsAverage =statsMeals[0]?.numAvg || 0,
 restaurant.ratingsQuantity= statsMeals[0]?.numRatings || 0
 await restaurant.save();
  
}
reviewSchema.post('save' , async function() {
  const review = this;
  await review.constructor.calcAvgRatingsOnMeal(review.meal)
    
})

reviewSchema.post(/^findOneAnd/, async function(review) {
  await review.constructor.calcAvgRatingsOnMeal(review.meal);
});


reviewSchema.pre(/^find/ , function(next) {
  this.populate({
    path:'user',
    select:'name image'
  })
  next();
})

const Review = mongoose.model('Review' , reviewSchema);
module.exports = Review;