const appError = require('../../handelErros/class.handel.errors');
const {
  CreateMeal,
  GetSingleMeal,
  GetAllMeal,
  UpdateMeal,
  DeleteMeal
} = require('../../models/meal.modles');
const {GetAllReview} = require('../../models/review.models')
const filterFeaturs = require('../../services/class.filter');

const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();
const multerFilter = (req ,file , cb) =>{
  if(file.mimetype.startsWith('image')){
    cb(null , true)
  }else {
   return cb(new appError('Please uplaod an image'));
  }
}
const uplaod = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

const resizeImageMiddleWare = async (req ,res ,next) => {
   if(!req.file) {
     next();
   }
   req.body.image =`meals-${req.params.id}-${Date.now()}.jpeg`;
   await sharp(req.file.buffer)
   .resize({width :200 , height: 200})
   .toFormat('jpeg')
   .jpeg({quality:90})
   .toFile(`public/images/meals/${req.body.image}`);
   
   next();
}

const uploadImageMiddleware = uplaod.single('image');


async function httpGetAllMeal (req ,res ,next) {
  const filter = {...req.body};
  const excluding =['sort','page','skip'];
  excluding.forEach((el) => delete filter[el]);
  const  getFilter = new filterFeaturs(filter , req.query);
  const {skip , limit} = getFilter.getPagination();
  const sort = getFilter.sortBy();
  const finalFilter = getFilter.filterFun();
  const meals = await GetAllMeal(finalFilter , limit , skip , sort);
  return res.status(200).json({
    status:'success',
    resulta:meals.length,
    data: meals
  })
}

async function httpGetSingleMeal (req ,res ,next) {
  const {id} = req.params;
  const meal = await GetSingleMeal({
    _id: id
  })
  if(!meal) {
    return next(new appError ('meal is not extis'));
  }
  return res.status(200).json({
    status:'success',
    meal
  })
}



async function httpCreateMeal (req ,res ,next) {
  const meal = await CreateMeal(req);
  return res.status(201).json({
    status:'success',
    meal
  })
}


async function httpUpdateMeal (req ,res ,next) {
  const {id} = req.params;
  const is_exsits = await GetSingleMeal({_id : id});
  if(!is_exsits) {
    return next(new appError ('meal is not extis')); 
  }
  const meal = await UpdateMeal(req.body , id);
  return res.status(200).json({
    status:'success',
    meal
  })
}


async function httpDeleteMeal (req ,res ,next) {
 
  const {id} = req.params;
  const meal = await GetSingleMeal({_id : id});
  if(!meal) {
    return next(new appError ('meal is not extis')); 
  }
 
    await meal.remove();
    return res.status(200).json({
    status:'success',
  })
}

async function httpGetReviewsForMeal (req , res ,next) {
  const {mealid} = req.params;
  const meal = await GetSingleMeal({_id : mealid});
  if(!meal) {
    return next(new appError('Meal is not exits'));
  }
  const reviews = await GetAllReview({meal : meal._id});
  return res.status(200).json({
    status:'success',
    results:reviews.length,
    reviews,
  })
}

module.exports = {
  httpCreateMeal,
  httpDeleteMeal,
  httpGetAllMeal,
  httpGetSingleMeal,
  httpUpdateMeal,
  httpGetReviewsForMeal,
  uploadImageMiddleware,
  resizeImageMiddleWare
}