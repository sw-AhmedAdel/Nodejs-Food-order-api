const mongoose = require('mongoose');
const Restaurant = require('./restaurant.mongo');
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
    set: val => Math.round(val * 10) / 10, // 4.7,
    default:0
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



menuSchema.statics.calAvgResturantRatings = async function(restaurant_id) {

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

menuSchema.pre(/^findOne/ , function(next){
  next();
})

// here delete all reviews that related to the meal
menuSchema.pre('remove', async function(next) {
  const meal = this;
  await this.model('Review').deleteMany({meal : meal._id})
  next();
})

//here after deleting the meal i want to recalculate the avgRatings of the left meals to recalculate
//the avgRatings on the resturant
menuSchema.post('remove', async function() {
  const meal = this;
  await this.constructor.calAvgResturantRatings(meal.restaurant)
  
})


const Meal = mongoose.model('Meal', menuSchema);
module.exports = Meal;