//import required modules
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const passport = require('passport');
const path = require('path');
const mongoose = require('mongoose');
const React = require('react');
const babel= require('@babel/register');

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

/*
*****************************************
***BEGIN GOOGLE OAUTH PASSPORT CODE :)***
*****************************************
*/

// Importing Google OAuth2 strategy for passport
const GoogleStrategy = require('passport-google-oauth2').Strategy;

// Google OAuth2 credentials
const GOOGLE_CLIENT_ID = '1045442076562-7vtmju1qqq6aahdjrqpnesusknidfirr.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const CALLBACK_URL = 'http://localhost:3000/auth/google/callback';

// Initializing passport and session middleware
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth authentication route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route after Google OAuth authentication
app.get('/auth/google/callback',
    passport.authenticate('google', {
        // change landing page after (un)successful logins
        failureRedirect: '/register',
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
}, 
function(request, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // Check if googleID exists in the database
        Member.findOne({ googleID: req.user.id }).then(function (logins) {
            if (logins == null) {
                // If it doesn't exist, redirect to contact us page with notice
                res.redirect('/register');
            } else {
                // If it exists, proceed to the next middleware
                return next();
            }
        });
    } else {
        // Redirect if not logged in
        res.redirect('main');
    }
}
/*
*****************************************
*** END GOOGLE OAUTH PASSPORT CODE :) ***
*****************************************
*/

//Set up application port
const PORT = 3000;
app.listen(PORT, ()=> {
    console.log("Server has started on port " + PORT);
});

app.get('/', (req, res) => {
    res.render('main'/*, variables*/)
});


app.get('/success', ensureAuthenticated, function(req, res) {
    res.render('success'/*, variables*/)
});

app.get('/login', (req, res) => {
    res.render('login'/*, variables*/)
});

app.get('/dietTracker', (req, res) => {
    res.render('dietTracker', { title: 'Diet Tracker' });
});

app.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.user.id);
        // Check if googleID exists in the database
        Member.findOne({ googleID: req.user.id }).then(function (logins) {
            if (logins == null) {
                if (req.user.gender == undefined){
                    const newMember = new Member({
                        googleID: req.user.id,
                        gender: String(0),
                        diettype: String(0),
                        firstName: req.user.displayName,
                        lastName: req.user.displayName,
                        dietitian: String(0),
                        usertype: "member",
                        subscribedPlans: []
                    });
                    console.log(newMember);
                    newMember.save() 
                    .then(() => {
                        console.log("New Member saved successfully");
                        res.redirect('/');
                    })
                    .catch((err) => {
                        console.log("Error creating new member: ", err);
                        res.status(500).send('Error registering new member');
                    })
                } else {
                    const newMember = new Member({
                        googleID: req.user.id,
                        gender: req.user.gender,
                        diettype: String(0),
                        firstName: req.user.displayName,
                        lastName: req.user.displayName,
                        dietitian: String(0),
                        usertype: String(0),
                        subscribedPlans: []
                    });
                    console.log(newMember);
                    newMember.save() 
                    .then(() => {
                        console.log("New Member saved successfully");
                        res.redirect('/');
                    })
                    .catch((err) => {
                        console.log("Error creating new member: ", err);
                        res.status(500).send('Error registering new member');
                    })
                }
            } else {
                // If it exists, proceed to the next middleware
                return next();
            }
        });
    } else {
        // Redirect if not logged in
        res.redirect('/failure');
    }
});
