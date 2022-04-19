const appError = require('../../handelErros/class.handel.errors');
const {
  CreateReview,
  GetSingleReview,
  GetAllReview,
  UpdateReview,
  DeleteReview,
} = require('../../models/review.models');
const {GetSingleMeal} = require('../../models/meal.modles');
const {checkPermessions} = require('../../services/query');
const filterFeaturs = require('../../services/class.filter');

async function httpGetAllReview (req ,res ,next) {
  const filter = {...req.body};
  const excluding =['sort','page','skip'];
  excluding.forEach((el) => delete filter[el]);
  const  getFilter = new filterFeaturs(filter , req.query);
  const {skip , limit} = getFilter.getPagination();
  const sort = getFilter.sortBy();
  const finalFilter = getFilter.filterFun();
  const Reviews = await GetAllReview(finalFilter , limit , skip , sort);
  return res.status(200).json({
    status:'success',
    resulta:Reviews.length,
    data: Reviews
  })
}

async function httpGetSingleReview (req ,res ,next) {
  const {id} = req.params;
  const Review = await GetSingleReview({
    _id: id
  })
  if(!Review) {
    return next(new appError ('Review is not extis'));
  }
  return res.status(200).json({
    status:'success',
    Review
  })
}



async function httpCreateReview (req ,res ,next) {
  const {mealid} = req.params;
  const meal = await GetSingleMeal({
    _id : mealid
  })
  if(!meal) {
    return next (new appError('Meal is not exits'));
  }
  const Review = await CreateReview(req , mealid);
  return res.status(201).json({
    status:'success',
    Review
  })
}


async function httpUpdateReview (req ,res ,next) {
  const {reviewid} = req.params;
  let userReview= await GetSingleReview({
    _id: reviewid,
  });
  if(!userReview) {
    return next(new appError ('Review is not extis')); 
  }
    userReview= await GetSingleReview({
    _id: reviewid,
    user:req.user._id
  });
  if(!userReview) {
    return next(new appError ('You are not authorized to do this action')); 
  }
 
  const Review = await UpdateReview(req.body , reviewid);
  return res.status(200).json({
    status:'success',
    Review
  })
}


async function httpDeleteReview (req ,res ,next) {
 
  const {reviewid} = req.params;
  const userReview= await GetSingleReview({
    _id: reviewid,
  });
  if(!userReview) {
    return next(new appError ('Review is not extis')); 
  }

 
  if(!checkPermessions(req.user , userReview.user)) {
    return next(new appError('You are not authorized to do this action'));
  }
    await DeleteReview(reviewid);
    return res.status(200).json({
    status:'success',
  })
}


module.exports = {
  httpCreateReview,
  httpDeleteReview,
  httpGetAllReview,
  httpGetSingleReview,
  httpUpdateReview
}