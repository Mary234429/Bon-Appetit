//import required modules
const { Binary, ObjectId } = require("mongodb");
let mongoose = require("mongoose");

//template schema/data model
/*
let templateSchema = new mongoose.Schema({
    dataName: {type: datatype},
    data2Name: {type:datatype}
});
let Template = mongoose.model("template", announcementSchema);
*/

// comments for recipes
let commentSchema = new mongoose.Schema({
  recipeID: { type: String },
  authorID: { type: String },
  comment: { type: String },
  timestamp: { type: Date },
});
let Comment = mongoose.model("comment", commentSchema);

//communityMembers / all types of users
let memberSchema = new mongoose.Schema({
  googleID: { type: String },
  gender: { type: String },
  diettype: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  dietitian: { type: String },
  usertype: { type: String },
  subscribedPlans: { type: Array },
  birthday: { type: Date },
  cuisines: { type: Array },
  email: { type: String },
  aboutMe: { type: String },
});
let Member = mongoose.model("communitymember", memberSchema);

//created recipes
let createdRecipeSchema = new mongoose.Schema({
  googleID: { type: String },
  recipeID: { type: String },
  timestamp: { type: Date },
});
let CreatedRecipes = mongoose.model("createdrecipe", createdRecipeSchema);

// dietPlans
let dietSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  recipes: { type: Array },
  recipesPerWeek: { type: Array },
  tags: { type: Array },
  publicity: { type: String },
  author: { type: String },
});
let DietPlan = mongoose.model("dietplan", dietSchema);

//dietTracker Data
let dietTrackerSchema = new mongoose.Schema({
  timeOfDay: { type: String },
  typeOfMeal: { type: String },
  recipe: { type: String },
  user: { type: String },
});
let DietTracker = mongoose.model("diettracker", dietTrackerSchema);

// foodJokes
let jokeSchema = new mongoose.Schema({
  joke: { type: String },
});
let Joke = mongoose.model("foodjoke", jokeSchema);

// ingredients
let ingredientSchema = new mongoose.Schema({
  name: { type: String },
  unit: { type: String },
  caloriesPerUnit: { type: String },
});
let Ingredients = mongoose.model("ingredient", ingredientSchema);

//recipes
let recipeSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  toolsNeeded: { type: Array },
  ingredients: { type: Array },
  ingredientAmounts: { type: Array },
  instructions: { type: Array },
  tags: { type: Array },
  mealType: { type: Array },
  publicity: { type: String },
});
let Recipes = mongoose.model("recipe", recipeSchema);

//saved recipes
let savedRecipeSchema = new mongoose.Schema({
  googleID: { type: String },
  recipeID: { type: String },
  timestamp: { type: Date },
});
let SavedRecipes = mongoose.model("savedrecipe", savedRecipeSchema);

// Contact Form
const formSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  message: { type: String },
});
const Form = mongoose.model("contactForm", formSchema);

module.exports = {
  Comment,
  Member,
  CreatedRecipes,
  DietPlan,
  DietTracker,
  Joke,
  Ingredients,
  Recipes,
  SavedRecipes,
  Form,
};
