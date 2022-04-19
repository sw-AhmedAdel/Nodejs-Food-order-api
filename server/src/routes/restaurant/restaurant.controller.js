const appError = require('../../handelErros/class.handel.errors');
const {
  CreateRestaurant,
  GetSingleRestaurant,
  GetAllRestaurant,
  UpdateRestaurant,
  DeleteRestaurant,
  GetRandomResturants
} = require('../../models/restaurant.models');
const {GetAllMeal} = require('../../models/meal.modles')
const filterFeaturs = require('../../services/class.filter');
const Review = require('../../models/review.mongo');
const Meal = require('../../models/meal.mongo');
async function httpGetAllRestaurant(req ,res ,next) {
  const filter = {...req.body};
  const excluding =['sort','page','skip'];
  excluding.forEach((el) => delete filter[el]);
  const  getFilter = new filterFeaturs(filter , req.query);
  const {skip , limit} = getFilter.getPagination();
  const sort = getFilter.sortBy();
  const finalFilter = getFilter.filterFun();
  const restaurants = await GetAllRestaurant(finalFilter , limit , skip , sort);
  return res.status(200).json({
    status:'success',
    resulta:restaurants.length,
    data: restaurants
  })
}

async function httpGetSingleRestaurant (req ,res ,next) {
  const {id} = req.params;
  const restaurant = await GetSingleRestaurant({
    _id: id
  })
  if(!restaurant) {
    return next(new appError ('restaurant is not extis'));
  }
  return res.status(200).json({
    status:'success',
    restaurant
  })
}



async function httpCreateRestaurant (req ,res ,next) {
  const restaurant = await CreateRestaurant(req);
  return res.status(201).json({
    status:'success',
    restaurant
  })
}


async function httpUpdateRestaurant (req ,res ,next) {
  const {id} = req.params;
  const is_exsits = await GetSingleRestaurant({_id : id});
  if(!is_exsits) {
    return next(new appError ('restaurant is not extis')); 
  }
  const restaurant = await UpdateRestaurant(req.body , id);
  return res.status(200).json({
    status:'success',
    restaurant
  })
}


async function httpDeleteRestaurant (req ,res ,next) {
 
  const {restaurantid} = req.params;
  const restaurant = await GetSingleRestaurant({_id : restaurantid});
  if(!restaurant) {
    return next(new appError ('restaurant is not extis')); 
  }
 
    // before delete the restaurant
  // 1) get the all meals thet related to the restaurant
  // 2) delete all reviews that related to the meals
  // 3 remove the meals
  // 4) remove the restaurant
  
  const meals = await Meal.find({restaurant: restaurantid})  
  for(const meal of meals) {
    await Review.deleteMany({meal : meal._id})
  }
  await Meal.deleteMany({restaurant : restaurantid})
   await restaurant.remove();
    return res.status(200).json({
    status:'success',
  })
}

async function httpGetResturantMeals(req ,res ,next) {
  const {resid} = req.params;
  const restaurant = await GetSingleRestaurant({_id : resid});
  if(!restaurant) {
    return next(new appError ('restaurant is not extis')); 
  }
  const meals = await GetAllMeal({restaurant: resid})
  return res.status(200).json({
    status:'success',
    results:meals.length,
    meals,
  })
}

async function httpGetRandomResturants(req ,res ,next) {
  const restaurants = await GetRandomResturants();
  return res.status(200).json({
    status:'success',
    results: restaurants.length,
    restaurants
  })
}

module.exports = {
  httpCreateRestaurant,
  httpDeleteRestaurant,
  httpGetAllRestaurant,
  httpGetSingleRestaurant,
  httpUpdateRestaurant,
  httpGetResturantMeals,
  httpGetRandomResturants
}