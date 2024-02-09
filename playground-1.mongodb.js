/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

const { ObjectId } = require("mongodb");

// Select the database to use.
use('General');

// Insert a few documents into the communityMembers collection.
// db.getCollection('communityMembers').insertMany([
//   { 'googleID': '', 'userType': 'member', 'gender': 'female', 'dietType': 'vegan', 'firstname': 'Meryem',  'lastName': 'Ozedmir', 'dietplan': '65c3a22dc2edbfb48c1f5627',  'dietitian': '65c3a230c2edbfb48c1f5628'  },
// ]);
  


// // Run a find command to view items sold on April 4th, 2014.
// const numberOfWomen = db.getCollection('communityMembers').find({
//   gender: { $gte: 'female', $lt: 'female' }
// }).count();

// // Print a message to the output window.
// console.log(`${numberOfWomen} are registered users on the website`);

// Here we run an aggregation and open a cursor to the results.
// Use '.toArray()' to exhaust the cursor to return the whole result set.
// You can use '.hasNext()/.next()' to iterate through the cursor page by page.
// db.getCollection('sales').aggregate([
//   // Find all of the sales that occurred in 2014.
//   { $match: { date: { $gte: new Date('2014-01-01'), $lt: new Date('2015-01-01') } } },
//   // Group the total sales for each product.
//   { $group: { _id: '$item', totalSaleAmount: { $sum: { $multiply: [ '$price', '$quantity' ] } } } }
// ]);
