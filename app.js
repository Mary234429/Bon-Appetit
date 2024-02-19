//import required modules
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const React = require('react');
const babel= require('@babel/register');




// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

//serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

//Import Database Models
const { Comment, Member, DietPlan, DietTracker, Joke, Ingredients, Recipes } = require('./model');

//Database Connection
const {getDb, connectToDb } = require('./db');
const { Server } = require('net');

//Configure views and view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');

// Setting up express-session
app.use(require('express-session')({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
}));

//Babel middleware to transpile JSX
app.engine('jsx', require('express-react-views').createEngine());

//Listen to the server
server.listen(process.env.PORT);

//Set up application port
const PORT = 3000;
app.listen(PORT, ()=> {
    console.log("Server has started on port " + PORT);
});

app.get('/', (req, res) => {
    res.render('main'/*, variables*/)
});


app.get('/success', (req, res) => {
    res.render('success'/*, variables*/)
});

app.get('/login', (req, res) => {
    res.render('login'/*, variables*/)
});


/*
*****************************************
***BEGIN GOOGLE OAUTH PASSPORT CODE :)***
*****************************************
*/

// Importing Google OAuth2 strategy for passport
const GoogleStrategy = require('passport-google-oauth2').Strategy;

// Google OAuth2 credentials
const GOOGLE_CLIENT_ID = '561772897520-tnutq8fiveghj9a08n2fqm79n05du763.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
//const CALLBACK_URL = 'https://jellyfish-app-c56xb.ondigitalocean.app/auth/google/callback';
const CALLBACK_URL = 'http://localhost:3000/success';

// Initializing passport and session middleware
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth authentication route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route after Google OAuth authentication
app.get('/auth/google/callback',
    passport.authenticate('google', {
        // change landing page after (un)successful logins
        failureRedirect: '/login',
        // if you are not Max and changing the redirect below ask him to change it in the google api dashbaord :)
        // for Max: https://console.cloud.google.com/apis/credentials?project=sacred-armor-399615
        successRedirect: '/success'
    }));

// Passport serialization and deserialization
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Google OAuth2 strategy for passport
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    passreqToCallback: true
}, function (token, tokenSecret, profile, done) {
    process.nextTick(function () {
        return done(null, profile);
    });
}));
/*
*****************************************
*** END GOOGLE OAUTH PASSPORT CODE :) ***
*****************************************
*/

app.get('/dietTracker', (req, res) => {
    res.render('dietTracker', { title: 'Diet Tracker' });
});

app.get('/recipeCreate', (req, res) => {
    res.render('recipeCreate', {title: 'Recipe Creator'});
});

app.post('/recipeCreate', (req, res) =>{
    //console.log(res);
    //console.log("data received");
    //console.log(req.body);

    //retrieve variables from request
    var recipeName = req.body.recipeName;
    var recipeDescription = req.body.description;
    var ingredients = req.body.ingredients;
    var ingredientAmounts = req.body.ingredientAmounts;
    var instructions = req.body.instructions;
    var tags = req.body.recipeTags;
    var privacy = req.body.privacyLevel;
    
    //Create a recipe object from submitted data
    const recipe = new Recipes({
        name: recipeName,
        description: recipeDescription,
        ingredients: ingredients,
        ingredientAmounts: ingredientAmounts,
        instructions: instructions,
        tags: tags,
        publicity: privacy
    });
    console.log(recipe);
    //Save the recipe to the database
    recipe.save();
    res.redirect('/recipeCreate');
});

app.get('/dietPlanCreate', (req, res) =>{
    res.render('dietPlan', {title: 'Diet Plan Creator'});
});

app.post('/dietPlanCreate', (req, res) =>{
    //retrieve variables from request
    var name = req.body.dietPlanName;
    var description = req.body.description;
    var recipes = req.body.recipes;
    var recipeAmounts = req.body.recipeAmounts;
    var tags = req.body.dietPlanTags;
    var privacyLevel = req.body.privacyLevel;
    var author = "Me";

    const dietPlan = new DietPlan({
        name: name,
        description: description,
        recipes: recipes,
        recipesPerWeek: recipeAmounts,
        tags: tags,
        publicity: privacyLevel,
        author: author
    });
    dietPlan.save();
    res.redirect('/dietPlanCreate');
});