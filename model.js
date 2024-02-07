//import required modules 
const { Binary, ObjectId } = require("mongodb");
var mongoose = require("mongoose");

//communityMembers
var memberSchema = new mongoose.Schema({
    googleID: {type: String},
    gender: {type: String},
    dietType: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    dietplan: {type: ObjectId},
    dietitian: {type: ObjectId},
})