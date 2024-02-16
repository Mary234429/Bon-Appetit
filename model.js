//import required modules 
const { Binary, ObjectId } = require("mongodb");
var mongoose = require("mongoose");

//template schema/data model
/*
var templateSchema = new mongoose.Schema({
    dataName: {type: datatype},
    data2Name: {type:datatype}
});
var Template = mongoose.model("template", announcementSchema);
*/

// comments for recipes
var commentSchema = new mongoose.Schema({
    recipeID: {type: String},
    authorID: {type: String},
    comment: {type: String},
    timestamp: {type: Date}
});
var Comment = mongoose.model("comment", commentSchema);

//communityMembers / all types of users
var memberSchema = new mongoose.Schema({
    googleID: {type: String},
    gender: {type: String},
    diettype: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    dietitian: {type: String},
    usertype: {type: String},
    subscribedPlans: {type: Array}
});
var Member = mongoose.model("communitymember", memberSchema);

//contactForm
var contactFormSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String},
    message: {type: String}
});
var contactForm = mongoose.model("contactform", contactFormSchema);

//created recipies
var createdRecipeSchema = new mongoose.Schema({
    googleID: {type: String},
    recipeID: {type: String},
    timestamp: {type: Date}
});
var createdRecipes = mongoose.model("createdrecipe", createdRecipeSchema);

// dietPlans
var dietSchema = new mongoose.Schema({
    
});
var DietPlan = mongoose.model("diet", dietSchema);


//dietTracker Data
var dietTrackerSchema = new mongoose.Schema({
    timeOfDay: {type: String},
    typeOfMeal: {type: String},
    recipe: {type: String},
    user: {type: String}
});
var DietTracker = mongoose.model("diettracker", dietTrackerSchema);

// foodJokes
var jokeSchema = new mongoose.Schema({
    joke: {type: String},
});
var Joke = mongoose.model("foodjoke", jokeSchema);

// ingrediance
var ingredientSchema = new mongoose.Schema({
    name: {type: String},
    unit: {type: String},
    caloriesPerUnit: {type: String}
});
var Ingredients = mongoose.model("ingredient", ingredientSchema);

//recipies
var recipeSchema = new mongoose.Schema({
    name: {type: String},
    description: {type: String},
    ingredients: {type: Array},
    ingredientAmmounts: {type:Array},
    instructions: {type:Array},
    tags: {type:Array},
    publicity: {type:String}
});
var Recipes = mongoose.model("recipe", recipeSchema);

//saved recipies
var savedRecipeSchema = new mongoose.Schema({
    googleID: {type: String},
    recipeID: {type: String},
    timestamp: {type: Date}
});
var SavedRecipes = mongoose.model("savedrecipe", savedRecipeSchema);


module.exports = { Comment, createdRecipes, contactForm, Member, DietPlan, 
    DietTracker, Joke, Ingredients, Recipes, SavedRecipes };