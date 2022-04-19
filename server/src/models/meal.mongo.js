const mongoose = require('mongoose');
const Restaurant = require('./restaurant.mongo');
const mealSchema = new mongoose.Schema({

  mealName:{
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
    set: val => Math.round(val * 10) / 10, // 4.7,
     default:0
  },
  ratingsQuantity : {
    type:Number,
    default:0
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
  },
 
}, {
  timestamps: true,
  toJSON:{virtuals: true},
  toObject:{virtuals: true}
})


mealSchema.index({mealName:1});
mealSchema.index({category:1})

mealSchema.statics.calAvgResturantRatings = async function(restaurant_id) {

  const stats = await Meal.aggregate([
    {
      $match: { restaurant: restaurant_id }
    },
    {
      $group:{
        _id:null,
        numAvg:{$avg:'$ratingsAverage'},
        numRatings:{$sum:'$ratingsQuantity'}
      }
    }
  ])

  await Restaurant.findByIdAndUpdate(restaurant_id , {
  ratingsAverage : stats[0]?.numAvg || 0,
  ratingsQuantity :  stats[0]?.numRatings || 0
 })
}

mealSchema.pre(/^findOne/ , function(next){
  next();
})

// here delete all reviews that related to the meal
mealSchema.pre('remove', async function(next) {
  const meal = this;
  await this.model('Review').deleteMany({meal : meal._id})
  next();
})

//here after deleting the meal i want to recalculate the avgRatings of the left meals to recalculate
//the avgRatings on the resturant
mealSchema.post('remove', async function() {
  const meal = this;
  await this.constructor.calAvgResturantRatings(meal.restaurant)
  
})


const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;