const appError = require('../../handelErros/class.handel.errors');
const {
  CreateRestaurant,
  GetSingleRestaurant,
  GetAllRestaurant,
  UpdateRestaurant,
  DeleteRestaurant
} = require('../../models/restaurant.models');

const filterFeaturs = require('../../services/class.filter');

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
  return res.status(201).json({
    status:'success',
    restaurant
  })
}


async function httpDeleteRestaurant (req ,res ,next) {
 
  const {id} = req.params;
  const is_exsits = await GetSingleRestaurant({_id : id});
  if(!is_exsits) {
    return next(new appError ('restaurant is not extis')); 
  }
 
    await DeleteRestaurant(id);
    return res.status(201).json({
    status:'success',
  })
}


module.exports = {
  httpCreateRestaurant,
  httpDeleteRestaurant,
  httpGetAllRestaurant,
  httpGetSingleRestaurant,
  httpUpdateRestaurant
}