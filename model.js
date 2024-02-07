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

//communityMembers
var memberSchema = new mongoose.Schema({
    googleID: {type: String},
    gender: {type: String},
    dietType: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    dietplan: {type: ObjectId},
    dietitian: {type: ObjectId},
});
var Member = mongoose.model("member", memberSchema);