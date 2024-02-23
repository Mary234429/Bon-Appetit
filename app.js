//import required modules
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const passport = require("passport");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const React = require("react");
const babel = require("@babel/register");

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

//serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

//Import Database Models
const {
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
} = require("./model.js");

//Database Connection
const { getDb, connectToDb } = require("./db");
const { Server } = require("net");

//Configure views and view engine
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Setting up express-session
app.use(
  require("express-session")({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
  })
);

//Listen to the server
server.listen(process.env.PORT);

/*
 *****************************************
 ***BEGIN GOOGLE OAUTH PASSPORT CODE :)***
 *****************************************
 */

// Importing Google OAuth2 strategy for passport
const GoogleStrategy = require("passport-google-oauth2").Strategy;

// Google OAuth2 credentials
const GOOGLE_CLIENT_ID =
  "1045442076562-7vtmju1qqq6aahdjrqpnesusknidfirr.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const CALLBACK_URL = "http://localhost:3000/auth/google/callback";

// Initializing passport and session middleware
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth authentication route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route after Google OAuth authentication
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    // change landing page after (un)successful logins
    failureRedirect: "/register",
    // if you are not Max and changing the redirect below ask him to change it in the google api dashbaord :)
    // for Max: https://console.cloud.google.com/apis/credentials?project=sacred-armor-399615
    successRedirect: "/dashboard",
  })
);

// Passport serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Google OAuth2 strategy for passport
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      passreqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  )
);

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
                // var loggedInMember = logins;
                // console.log(loggedInMember);
                return next();
            }
        });
    } else {
        // Redirect if not logged in
        res.redirect('login');
    }
}

// Logging out and redirecting to the home page
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

/*
 *****************************************
 *** END GOOGLE OAUTH PASSPORT CODE :) ***
 *****************************************
 */
app.get("/recipes", (req, res) => {
  const recipes = [
    { id: 1, name: "Recipe 1", ingredients: ["Ingredient 1", "Ingredient 2"] },
    { id: 2, name: "Recipe 2", ingredients: ["Ingredient 3", "Ingredient 4"] },
    // Add more recipe objects as needed
  ];
  res.json(recipes);
});

//Set up application port
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server has started on port " + PORT);
});

app.get("/", (req, res) => {
  res.render("login" /*, variables*/);
});

app.get("/dashboard", ensureAuthenticated, function (req, res) {
  Recipes.find().then((recipes) => {
    let breakfastRecipes = [];
    const breakfastRegex = new RegExp("Breakfast");
    let lunchRecipes = [];
    const lunchRegex = new RegExp("Lunch");
    let dinnerRecipes = [];
    const dinnerRegex = new RegExp("Dinner");
    let snackRecipes = [];
    const snackRegex = new RegExp("Snack");
    console.log(recipes.at(0).mealType.at(0));
    for (let i = 0; i < recipes.length; i++) {
      for (let j = 0; j < recipes.at(i).mealType.length; j++) {
        if (breakfastRegex.test(recipes.at(i).mealType.at(j))) {
          breakfastRecipes.push(recipes.at(i));
        } else if (lunchRegex.test(recipes.at(i).mealType.at(j))) {
          lunchRecipes.push(recipes.at(i));
        } else if (dinnerRegex.test(recipes.at(i).mealType.at(j))) {
          dinnerRecipes.push(recipes.at(i));
        } else if (snackRegex.test(recipes.at(i).mealType.at(j))) {
          snackRecipes.push(recipes.at(i));
        }
      }
    }
    console.log(breakfastRecipes);
    console.log(lunchRecipes);
    console.log(dinnerRecipes);
    res.render(
      "dashboard",
      breakfastRecipes,
      lunchRecipes,
      dinnerRecipes,
      snackRecipes /*, variables*/
    );
  });
});

app.get("/login", (req, res) => {
  res.render("login" /*, variables*/);
});

app.get('/dietTracker',ensureAuthenticated, function(req, res) {
    const stylesPath = path.join(__dirname, "/styles.css"); //Provide your dynamic path here
    res.render('dietTracker', { title: 'Diet Tracker', stylesPath });

});

app.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.user.id);
        // Check if googleID exists in the database
        Member.findOne({ googleID: req.user.id }).then(function (logins) {
            if (logins == null) {
                let nameArray = req.user.displayName.split(" ");
                if (req.user.gender == undefined){
                    const newMember = new Member({
                        googleID: req.user.id,
                        gender: String(0),
                        diettype: String(0),
                        firstName: nameArray[0],
                        lastName: nameArray[1],
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
                        firstName: nameArray[0],
                        lastName: nameArray[1],
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
app.get("/recipeCreate", ensureAuthenticated, function (req, res) {
  res.render("recipeCreate", { title: "Recipe Creator" });
});

app.post("/recipeCreate", ensureAuthenticated, function (req, res) {
  //retrieve variables from request
  let recipeName = req.body.recipeName;
  let recipeDescription = req.body.description;
  let ingredients = req.body.ingredients;
  let ingredientAmounts = req.body.ingredientAmounts;
  let instructions = req.body.instructions;
  let tags = req.body.recipeTags;
  let mealType = req.body.mealType;
  let privacy = req.body.privacyLevel;

  //Create a recipe object from submitted data
  const recipe = new Recipes({
    name: recipeName,
    description: recipeDescription,
    ingredients: ingredients,
    ingredientAmounts: ingredientAmounts,
    instructions: instructions,
    tags: tags,
    mealType: mealType,
    publicity: privacy,
  });
  console.log(recipe);
  //Save the recipe to the database
  recipe.save();
  //save who created the recipe & timestamp to the database
  let timestamp = new Date();
  let userID = req.user.id;
  const createdRecipe = new CreatedRecipes({
    recipeID: recipe.id,
    googleID: userID,
    timestamp: timestamp,
  });
  createdRecipe.save();
  res.redirect("/recipeCreate");
});

app.get("/dietPlanCreate", ensureAuthenticated, function (req, res) {
  res.render("dietPlan", { title: "Diet Plan Creator" });
});

//Contact Form
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Page" });
});

app.post("/contactSubmit", async (req, res) => {
  console.log("Received request at /contactSubmit with data:", req.body);
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;

  const contactForm = new Form({
    name: name,
    email: email,
    message: message,
  });
  contactForm.save();
  res.redirect("/contact");
});

app.post("/dietPlanCreate", ensureAuthenticated, function (req, res) {
  //retrieve variables from request
  let name = req.body.dietPlanName;
  let description = req.body.description;
  let recipes = req.body.recipes;
  let recipeAmounts = req.body.recipeAmounts;
  let tags = req.body.dietPlanTags;
  let privacyLevel = req.body.privacyLevel;
  let author = "Me";

  const dietPlan = new DietPlan({
    name: name,
    description: description,
    recipes: recipes,
    recipesPerWeek: recipeAmounts,
    tags: tags,
    publicity: privacyLevel,
    author: author,
  });
  dietPlan.save();
  res.redirect("/dietPlanCreate");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Us Page" });
});

app.get('/profile', (req, res) => {
    Member.findOne({googleID: req.user.id}).then(function(loggedInMember) {
        res.render('profile', {
            title: 'Member Information',
            firstName: loggedInMember.firstName,
            lastName: loggedInMember.lastName,
            gender: loggedInMember.gender,
            dietType: loggedInMember.dietType,
            dietitian: loggedInMember.dietitian,
        });
    })   
});

app.get("/members/:id", async (req, res) => {
  console.log("Received request at /members with ID:", req.params.id);
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      console.log("No member found with ID:", req.params.id);
      return res.status(404).send("Member not found");
    }
    console.log("Member data found:", member);
    res.json(member);
  } catch (error) {
    console.error("Error fetching member data:", error);
    res.status(500).send("Server error");
  }
});
