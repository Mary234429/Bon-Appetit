// Import required modules
var MongoClient = require('mongodb').MongoClient;
var mongoose = require("mongoose");

// Define a variable to hold the database connection
let dbConnection;

// Set the database password
const dbPassword = "RZ6m6q6mQHNmqcKY";

// Construct the MongoDB connection URI
const uri = "mongodb+srv://application:" + dbPassword + "@primarycluster.ghipbr2.mongodb.net/General?retryWrites=true&w=majority"

// Connect to MongoDB using mongoose
mongoose.connect(uri, {
    //useNewUrlParser: true
}).then(function() {
    // Log a message if the database connection is successful
    console.log("Database connection successful.");
}).catch(function(err) {
    // Log an error message if the database connection fails
    console.log(err);
});

// Export the mongoose object for external use
module.exports.mongoose = mongoose;

//upload
// Destructure Schema from mongoose
const { Schema } = mongoose;

// Connect to MongoDB with additional options
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});