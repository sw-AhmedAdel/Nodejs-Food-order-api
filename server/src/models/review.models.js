const Review = require('./review.mongo');



async function CreateReview (req , meal_id) {
  const newReview = new Review({
    ...req.body,
    user: req.user._id,
    meal:meal_id
  });
  await newReview.save();
  return newReview;
}

async function GetAllReview(filter , limit , skip , sort) {
  return await Review.find(filter)
  .limit(limit)
  .skip(skip)
  .sort(sort)
}

async function GetSingleReview(filter) {
  return await Review.findOne(filter);
}

async function UpdateReview(editReview , id) {
  const review = await Review.findByIdAndUpdate(id , editReview , {
    new:true,
    runValidators:true,
  })

  return review;
}

// when i delete Review i must delete the all Review and reviewing on it 
async function DeleteReview(id) {
  await Review.findByIdAndDelete(id);
}


module.exports = {
  CreateReview,
  GetSingleReview,
  GetAllReview,
  UpdateReview,
  DeleteReview,
}

