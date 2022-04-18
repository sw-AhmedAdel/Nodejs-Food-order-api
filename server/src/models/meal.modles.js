const Meal = require('./meal.mongo');
const fs= require('fs');
const path = require('path');

async function loadAllMeal() {
  const meals = JSON.parse(fs.readFileSync(path.join(__dirname,'..','..','data','meals.json')));
  await Meal.create(meals);
  console.log('loaded all Meals')
}

async function CreateMeal (req) {
  const newMeal = new Meal({
    ...req.body,
    user: req.user._id
  });
  await newMeal.save();
  return newMeal;
}

async function GetAllMeal(filter , limit , skip , sort) {
  return await Meal.find(filter)
  .limit(limit)
  .skip(skip)
  .sort(sort)
}

async function GetSingleMeal(filter) {
  return await Meal.findOne(filter);
}

async function UpdateMeal(editMeal , id) {
  const meal = await Meal.findByIdAndUpdate(id , editMeal , {
    new:true,
    runValidators:true,
  })

  return meal;
}

// when i delete Meal i must delete the all Meal and reviewing on it 
async function DeleteMeal(id) {
  await Meal.findByIdAndDelete(id);
}


module.exports = {
  CreateMeal,
  GetSingleMeal,
  GetAllMeal,
  UpdateMeal,
  DeleteMeal,
  loadAllMeal
}

