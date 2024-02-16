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
    recipeID: {Type: String},
    authorID: {Type: String},
    comment: {Type: String},
    timestamp: {Type: Date}
});
var Comment = mongoose.model("comment", commentSchema);

//communityMembers / all types of users
var memberSchema = new mongoose.Schema({
    googleID: {Type: String},
    gender: {Type: String},
    dietType: {Type: String},
    firstName: {Type: String},
    lastName: {Type: String},
    dietitian: {Type: String},
    userType: {Type: String},
    subscribedPlans: {Type: Array}
});
var Member = mongoose.model("member", memberSchema);

//contactForm
var contactFormSchema = new mongoose.Schema({
    name: {Type: String},
    email: {Type: String},
    message: {Type: String}
});
var contactForm = mongoose.model("contactForm", contactFormSchema);

//created recipies
var createdRecipeSchema = new mongoose.Schema({
    googleID: {Type: String},
    recipeID: {Type: String},
    timestamp: {Type: Date}
});
var createdRecipes = mongoose.model("createdRecipes", createdRecipeSchema);

// dietPlans
var dietSchema = new mongoose.Schema({
    
});
var DietPlan = mongoose.model("diet", dietSchema);


//dietTracker Data
var dietTrackerSchema = new mongoose.Schema({
    timeOfDay: {Type: String},
    typeOfMeal: {Type: String},
    recipe: {Type: String},
    user: {Type: String}
});
var DietTracker = mongoose.model("dietTracker", dietTrackerSchema);

// foodJokes
var jokeSchema = new mongoose.Schema({
    joke: {Type: String},
});
var Joke = mongoose.model("joke", jokeSchema);

// ingrediance
var ingredientSchema = new mongoose.Schema({
    name: {Type: String},
    unit: {Type: String},
    caloriesPerUnit: {Type: String}
});
var Ingredients = mongoose.model("ingredients", ingredientSchema);

//recipies
var recipeSchema = new mongoose.Schema({
    name: {Type: String},
    description: {Type: String},
    ingredients: {Type: Array},
    ingredientAmmounts: {Type:Array},
    instructions: {Type:Array},
    tags: {Type:Array},
    publicity: {Type:String}
});
var Recipes = mongoose.model("recipes", recipeSchema);

//saved recipies
var savedRecipeSchema = new mongoose.Schema({
    googleID: {Type: String},
    recipeID: {Type: String},
    timestamp: {Type: Date}
});
var SavedRecipes = mongoose.model("savedRecipes", savedRecipeSchema);


module.exports = { Comment, createdRecipes, contactForm, Member, DietPlan, 
    DietTracker, Joke, Ingredients, Recipes, SavedRecipes };