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

});
var Comment = mongoose.model("comment", commentSchema);

//communityMembers / all types of users
var memberSchema = new mongoose.Schema({
    googleID: {type: String},
    gender: {type: String},
    dietType: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    dietitian: {type: String},
    userType: {type: String},
    subscribedPlans: {Type: Array}
});
var Member = mongoose.model("member", memberSchema);

// dietPlans
var dietSchema = new mongoose.Schema({
    name: {type: String},
    description: {type: String},
    recipes: {type: Array},
    recipesPerWeek: {type: Array},
    tags: {type: Array},
    publicity: {type: String},
    author: {type: String}
});
var DietPlan = mongoose.model("dietplan", dietSchema);

//dietTracker Data
var dietTrackerSchema = new mongoose.Schema({
    timeOfDay: {type: String},
    typeOfMeal: {type: String},
    recipe: {type: String},
    user: {type: String}
});
var DietTracker = mongoose.model("dietTracker", dietTrackerSchema);

// foodJokes
var jokeSchema = new mongoose.Schema({

});
var Joke = mongoose.model("joke", jokeSchema);

// ingrediance
var ingredientSchema = new mongoose.Schema({
    name: {type: String},
    unit: {type: String},
    caloriesPerUnit: {type: String}
});
var Ingredients = mongoose.model("ingredients", ingredientSchema);

//recipes
var recipeSchema = new mongoose.Schema({
    name: {type: String},
    description: {type: String},
    ingredients: {type: Array},
    ingredientAmounts: {type:Array},
    instructions: {type:Array},
    tags: {type:Array},
    publicity: {type:String}
});
var Recipes = mongoose.model("recipes", recipeSchema);


module.exports = { Comment, Member, DietPlan, DietTracker, Joke, Ingredients, Recipes };