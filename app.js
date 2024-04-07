//import required modules
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const passport = require("passport");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
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
        res.redirect("/register");
      } else {
        // If it exists, proceed to the next middleware
        return next();
      }
    });
  } else {
    // Redirect if not logged in
    res.redirect("/login");
  }
}

// Logging out and redirecting to the home page
app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

/*
 *****************************************
 *** END GOOGLE OAUTH PASSPORT CODE :) ***
 *****************************************
 */
app.get("/addFood", (req, res) => {
    Recipes.find().then(function (ingredients) {
        res.render("addFood", { ingredients });
    });
});

//Set up application port
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server has started on port " + PORT);
});

app.get("/", (req, res) => {
  res.render("login" /*, {variables}*/);
});

app.get("/dashboard", ensureAuthenticated, async function (req, res) {
  try{
  const privateRecipes = await CreatedRecipes.find({googleID: req.user.id})
    let recipeIDs = [];
    for(let i = 0; i < privateRecipes.length; i++){
      recipeIDs.push(privateRecipes.at(i).recipeID);
    }
  const ingredients = await Ingredients.find();
  const recipes = await Recipes.find({ $or: [{ _id: {$in: recipeIDs} }, {publicity: /Public/}]});
    let breakfastRecipes = [];
    let lunchRecipes = [];
    let dinnerRecipes = [];
    let snackRecipes = [];

    for (let i = 0; i < recipes.length; i++) {
      for (let j = 0; j < recipes[i].mealType.length; j++) {
        const recipe = recipes[i];
        const recipeMealType = recipe.mealType[j];
        if (/Breakfast/.test(recipeMealType)) {
          breakfastRecipes.push(recipe);
        } else if (/Lunch/.test(recipeMealType)) {
          lunchRecipes.push(recipe);
        } else if (/Dinner/.test(recipeMealType)) {
          dinnerRecipes.push(recipe);
        } else if (/Snack/.test(recipeMealType)) {
          snackRecipes.push(recipe);
        }
      }
    }
    const members = await Member.find();
    const createdRecipes = await CreatedRecipes.find();
    // Map to store member names for each recipe
    const recipeMemberMap = {}; 
    for (const createdRecipe of createdRecipes) {
      const { recipeID, googleID } = createdRecipe;
      const member = members.find(member => member.googleID === googleID);
      if (member) {
        recipeMemberMap[recipeID] = {
          firstName: member.firstName,
          lastName: member.lastName,
          profilePicture: member.profilePicture, 
        };      
      }
    }

    const joke = await getJoke();

    res.render("dashboard", {
      member: members,
      CRecipes: createdRecipes,
      ingredients,
      breakfastRecipes,
      lunchRecipes,
      dinnerRecipes,
      snackRecipes,
      joke,
      recipeMemberMap, // Pass the map of recipe IDs to member names to the template
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

async function getJoke() {
  try {
    const jokes = await Joke.find().exec();
    var today = new Date();
    var day = today.getDate();
    const joke = jokes[day - 1];
    return joke;
  } catch (error) {
    console.error("Error retrieving joke:", error);
    throw new Error("Error retrieving joke");
  }
}

app.get("/login", (req, res) => {
  res.render("login" /*, {variables}*/);
});

app.get("/dietTracker", ensureAuthenticated, function (req, res) {
    let currentDate;
    if (req.query.datepicker) {
        // If datepicker is provided in the query parameters
        currentDate = new Date(req.query.datepicker);
        currentDate.setDate(currentDate.getDate() + 1);
    } else {
        // If datepicker is not provided, use the current date
        currentDate = new Date();
    }
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formatedDate = `${year}-${month}-${day}`;
    DietTracker.find().then((tracker) => {
        let breakfastTracked = [];
        let lunchTracked = [];
        let dinnerTracked = [];
        let snackTracked = [];
        console.log(tracker.at(0).timeOfDay)
        console.log(formatedDate)
        for (let i = 0; i < tracker.length; i++) {
            if (tracker.at(i).timeOfDay == formatedDate) {
                if (tracker.at(i).typeOfMeal == "Breakfast") {
                    breakfastTracked.push(tracker.at(i));
                }
                if (tracker.at(i).typeOfMeal == "Lunch") {
                    lunchTracked.push(tracker.at(i));
                }
                if (tracker.at(i).typeOfMeal == "Dinner") {
                    dinnerTracked.push(tracker.at(i));
                }
                if (tracker.at(i).typeOfMeal == "Snack") {
                    snackTracked.push(tracker.at(i));
                }
            }
        }


        /*for (let i = 0; i < tracker.length; i++) {
            for (let j = 0; j < tracker.at(i).mealType.length; j++) {
                if (breakfastRegex.test(tracker.at(i).mealType.at(j))) {
                    breakfastTracked.push(tracker.at(i));
                } else if (lunchRegex.test(tracker.at(i).mealType.at(j))) {
                    lunchTracked.push(tracker.at(i));
                } else if (dinnerRegex.test(tracker.at(i).mealType.at(j))) {
                    dinnerTracked.push(tracker.at(i));
                } else if (snackRegex.test(tracker.at(i).mealType.at(j))) {
                    snackTracked.push(tracker.at(i));
                }
            }
        }*/
        res.render("dietTracker", { title: "Diet Tracker", formatedDate, breakfastTracked, lunchTracked, dinnerTracked, snackTracked });
    });
});

app.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user.id);
    // Check if googleID exists in the database
    Member.findOne({ googleID: req.user.id }).then(function (logins) {
      if (logins == null) {
        let nameArray = req.user.displayName.split(" ");
        if (req.user.gender == undefined) {
          const newMember = new Member({
            googleID: req.user.id,
            gender: String(0),
            diettype: String(0),
            firstName: nameArray[0],
            lastName: nameArray[1],
            dietitian: String(0),
            usertype: "member",
            subscribedPlans: [],
            birthday: req.user.birthday || 0,
            cuisines: [],
            email: req.user.emails[0].value,
            aboutMe: "About Me",
            profilePicture: req.user.picture,
          });
          //console.log(newMember);
          newMember
            .save()
            .then(() => {
              console.log("New Member saved successfully");
              res.redirect("/");
            })
            .catch((err) => {
              console.log("Error creating new member: ", err);
              res.status(500).send("Error registering new member");
            });
        } else {
          const newMember = new Member({
            googleID: req.user.id,
            gender: req.user.gender,
            diettype: String(0),
            firstName: nameArray[0],
            lastName: nameArray[1],
            dietitian: String(0),
            usertype: String(0),
            subscribedPlans: [],
            age: calculateAge(),
            cuisines: [],
            email: req.user.emails[0].value,
            aboutMe: "About Me",
            profilePicture: imageBuffer,
          });
          //console.log(newMember);
          newMember
            .save()
            .then(() => {
              console.log("New Member saved successfully");
              res.redirect("/");
            })
            .catch((err) => {
              console.log("Error creating new member: ", err);
              res.status(500).send("Error registering new member");
            });
        }
      } else {
        // If it exists, proceed to the next middleware
        return next();
      }
    });
  } else {
    // Redirect if not logged in
    res.redirect("/");
  }
});
app.get("/recipeCreate", ensureAuthenticated, function (req, res) {
  Ingredients.find().then(function (ingredients) {
    res.render("recipeCreate", { ingredients });
  });
});

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/recipeCreate", ensureAuthenticated, upload.single("thumbnail"), async function (req, res) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  //retrieve variables from request
  let recipeName = req.body.recipeName;
  let recipeDescription = req.body.description;
  let tools = req.body.recipeTools;
  let ingredients = req.body.ingredients;
  //console.log(ingredients);
  let ingredientAmounts = req.body.ingredientAmounts;
  let instructions = req.body.instructions;
  let tags = req.body.recipeTags;
  let mealType = req.body.mealType;
  let privacy = req.body.privacyLevel;
  let imageBuffer="";
  const { originalname, mimetype, buffer } = req.file;

  imageBuffer = buffer;
  console.log("Uploaded image size:", imageBuffer.length, "bytes");
  
  //Create a recipe object from submitted data
  const recipe = new Recipes({
    name: recipeName,
    description: recipeDescription,
    toolsNeeded: tools,
    ingredients: ingredients,
    ingredientAmounts: ingredientAmounts,
    instructions: instructions,
    tags: tags,
    mealType: mealType,
    publicity: privacy,
    thumbnail: imageBuffer,
  });
  //Save the recipe to the database
  recipe.save();
  console.log("Recipe created successfully!");

  //save who created the recipe & timestamp to the database
  let timestamp = new Date();
  let userID = req.user.id;
  const createdRecipe = new CreatedRecipes({
    recipeID: recipe.id,
    googleID: userID,
    timestamp: timestamp,
  });
  await createdRecipe.save();
  res.redirect("/dashboard");
});

app.post("/addIngredient", ensureAuthenticated, function (req, res) {
  const ingredient = new Ingredients({
    name: req.body.ingredientName,
    unit: req.body.ingredientUnit,
    caloriesPerUnit: req.body.caloriesPerUnit,
  });
  ingredient.save();
  res.end(
    '{"_id":"' + ingredient._id + '",' + 
      '"name":"' +
      req.body.ingredientName +
      '","unit":"' +
      req.body.ingredientUnit +
      '","caloriesPerUnit":' +
      req.body.caloriesPerUnit +
      "}"
  );
});

app.get('/recipe/edit/:recipeID', ensureAuthenticated, async function(req, res){
  let edit = true;
  let recipe = await Recipes.findOne({_id: req.params.recipeID});
  let ingredients = await Ingredients.find();
  res.render("recipeEdit.ejs", {
    edit: edit,
    recipe: recipe,
    ingredients: ingredients
  });
});

app.post('/recipe/edit/:recipeID', ensureAuthenticated, upload.single("thumbnail"), async function(req, res){
  
  //retrieve variables from request
  let recipeName = req.body.recipeName;
  let recipeDescription = req.body.description;
  let tools = req.body.recipeTools;
  let ingredients = req.body.ingredients;
  let ingredientAmounts = req.body.ingredientAmounts;
  let instructions = req.body.instructions;
  let tags = req.body.recipeTags;
  let mealType = req.body.mealType;
  let privacy = req.body.privacyLevel;
  
  if(!req.file){
    Recipes.findByIdAndUpdate(req.params.recipeID, {$set: {
      name: recipeName,
      description: recipeDescription,
      toolsNeeded: tools,
      ingredients: ingredients,
      ingredientAmounts: ingredientAmounts,
      instructions: instructions,
      tags: tags,
      mealType: mealType,
      publicity: privacy,
    }});
  }else{
    const { originalname, mimetype, buffer } = req.file;

    let imageBuffer = buffer;
    //Create a recipe object from submitted data
    Recipes.findByIdAndUpdate(req.params.recipeID, {$set: {
      name: recipeName,
      description: recipeDescription,
      toolsNeeded: tools,
      ingredients: ingredients,
      ingredientAmounts: ingredientAmounts,
      instructions: instructions,
      tags: tags,
      mealType: mealType,
      publicity: privacy,
      thumbnail: imageBuffer,
    }});
  }
  //save who created the recipe & timestamp to the database
  let timestamp = new Date();
  let userID = req.user.id;
  Recipes.findOneAndUpdate({$and:{googleID: userID, recipeID: req.params.recipeID}, $set:{timestamp: timestamp}});
  res.redirect("/dashboard");
});

app.get('/recipe/customize/:recipeID', ensureAuthenticated, async function(req,res){
  let edit = false;
  let recipe = await Recipes.findOne({_id: req.params.recipeID});
  let ingredients = await Ingredients.find();
  res.render("recipeEdit.ejs", {
    edit: edit,
    recipe: recipe,
    ingredients: ingredients
  });
});

app.get('/recipe/:recipeId', ensureAuthenticated, function (req, res) {
  const recipeID = req.params.recipeId;
    Recipes.findOne({_id: recipeID}).then(function(theRecipe){
      Ingredients.find({_id: {$in: theRecipe.ingredients}}).then(function(ingredients){
        CreatedRecipes.find({recipeID: recipeID}).then(function(createdRecipe){
          Member.find().then(function(members){
            Comment.find({recipeID: recipeID}).then(function(createdComments){
              const commentMemberMap = {}; // Map to store member names for each comment
  
              for (const createdComment of createdComments) {
                const {_id, authorID } = createdComment;
                const member = members.find(member => member.googleID === authorID);
                if (member) {
                  commentMemberMap[createdComment._id] = {
                    firstName: member.firstName,
                    lastName: member.lastName,
                    profilePicture: member.profilePicture, 
                  };      
                }
              }
              res.render("recipe.ejs", {
                recipe: theRecipe,
                ingredients: ingredients,
                map: commentMemberMap,
                comments: createdComments,
                picture: req.user.picture,
                author: req.user.id,
                createdRecipe: createdRecipe,
                members: members,
              });
            })
          })
        })
      })
    })
  })


    

app.get("/image/:recipeId", async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    // Find the recipe by ID in the database
    const recipe = await Recipes.findById(recipeId);
    if (!recipe || !recipe.image) {
      return res.status(404).send("Image not found.");
    }
    const base64Image = recipe.image.toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;
    // Set the appropriate content type for the response
    res.send(`<img src="${dataUrl}" alt="Recipe Image">`);
    // Send the image data as a response
    res.send(recipe.image);
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/dietPlanCreate", ensureAuthenticated, function (req, res) {
  res.render("dietPlan", { title: "Diet Plan Creator" });
});

//Contact Form
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Page" });
});

app.post("/contactSubmit", ensureAuthenticated, async (req, res) => {
  //console.log("Received request at /contactSubmit with data:", req.body);
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
  // this is ok for going back to same page, but change if redirecting to another page
  dietPlan.save();
  res.redirect("/dietPlanCreate");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Us Page" });
});

app.get("/profile", ensureAuthenticated, async function (req, res) {
  // try statement getting all recent recipes created by logged in user
  try {
    const loggedInMember = await Member.findOne({ googleID: req.user.id });
    const createdRecipes = await CreatedRecipes.find({ googleID: req.user.id });
    const recipeIds = createdRecipes.map((recipe) => recipe.recipeID);
    const recentRecipes = await Recipes.find({ _id: { $in: recipeIds } })
      // order them
      .sort({ timestamp: -1 })
      .limit(3);
    //console.log(recentRecipes);
    let dietitianName = "Not Assigned";
    // If a dietitian is assigned, fetch their name
    if (loggedInMember.dietitian) {
      const dietitian = await Member.findOne({ googleID: loggedInMember.dietitian });
      if (dietitian) {
        dietitianName = `${dietitian.firstName} ${dietitian.lastName}`;
      }
    }
    // render page
    res.render("profile", {
      user: req.user,
      loggedInMember: loggedInMember,
      dietitianName: dietitianName,
      recipes: recentRecipes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// going to profile edit page
app.get("/profileEdit", ensureAuthenticated, function (req, res) {
  Member.findOne({ googleID: req.user.id }).then(function (loggedInMember) {
    res.render("profileEdit", {
      loggedInMember: loggedInMember,
      user: req.user,
    });
  });
});

app.post("/editProfile", ensureAuthenticated, function (req, res) {
  Member.findOne({ googleID: req.user.id }).then(function (loggedInMember) {
    // save edited profile data to dataabse
    loggedInMember.firstName = req.body.FN;
    loggedInMember.lastName = req.body.LN;
    loggedInMember.gender = req.body.GN;
    loggedInMember.diettype = req.body.diet;
    loggedInMember.dietitian = req.body.DT;
    loggedInMember.birthday = req.body.birthdate;
    loggedInMember.email = req.body.EMAIL;
    loggedInMember.cuisines = req.body.cuisine;
    loggedInMember.aboutMe = req.body.aboutMe;
    recentRecipes = req.body.recentRecipes;
    //redirect to profile page instead of rendering it, rendering breaks things
    loggedInMember.save().then(function () {
      res.redirect("profile");
    });
  });
});

/*
 **************************************
 *** BEGIN COMMENT HANDLING CODE :) ***
 **************************************
 */
app.get("/comments", ensureAuthenticated, async function (req, res) {
      const members = await Member.find();
      // im betting that this might load all comments ignoring recipeIDs
      const createdComments = await Comment.find();
        // uncomment when on recipe page
      // const createdComments = await Comment.findById(req.params.id);
      const commentMemberMap = {}; // Map to store member names for each comment

      for (const createdComment of createdComments) {
        const {_id, authorID } = createdComment;
        const member = members.find(member => member.googleID === authorID);
        if (member) {
          commentMemberMap[createdComment._id] = {
            firstName: member.firstName,
            lastName: member.lastName,
            profilePicture: member.profilePicture, 
          };      
        }
      }
      res.render("comments.ejs", {
        map: commentMemberMap,
        comments: createdComments,
        picture: req.user.picture,
        author: req.user.id,
  });
});

app.post("/commentSubmit/:recipeID", ensureAuthenticated, function (req, res) {
  let recipeid = req.body.recipeID;
  let authorid = req.body.authorID;
  let message = req.body.message;
  const timestamp = Date.now();
  const newComment = new Comment({
    recipeID: recipeid,
    authorID: authorid,
    message: message,
    timestamp: timestamp,
  });
  newComment
    .save()
    .then(() => {
      // If the comment was created successfully, redirect to the comments page or wherever
      res.redirect("/recipe/" + recipeid);
    })
    .catch((err) => {
      console.log("Error creating new comment: ", err);
      res.status(500).send("Error saving comment");
    });
});

app.post("/deleteComment/:recipeID", ensureAuthenticated, async function (req, res) {
  let recipeid = req.body.recipeID;
  try {
    const commentID = req.body.commentID;
    const deletedComment = await Comment.findByIdAndDelete(commentID);
    if (!deletedComment) {
      // If the comment was not found, respond with an error
      return res.status(404).send("Comment not found");
    }
    // If the comment was deleted successfully, redirect to the comments page or wherever
    res.redirect("/recipe/" + recipeid);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/deleteComment", ensureAuthenticated, async function (req, res) {
  try {
    const commentID = req.body.commentID;
    const deletedComment = await Comment.findByIdAndDelete(commentID);
    if (!deletedComment) {
      // If the comment was not found, respond with an error
      return res.status(404).send("Comment not found");
    }
    // If the comment was deleted successfully, redirect to the comments page or wherever
    res.redirect("/comments");
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).send("Internal Server Error");
  }
});
/*
 ************************************
 *** END COMMENT HANDLING CODE :) ***
 ************************************
 */

// app.get("/mydietitian", ensureAuthenticated, async function (req, res) {
//   try {
//     const loggedInMember = await Member.findOne({ googleID: req.user.id });
//     const dietitian = await Member.findOne({ dietitian: req.user.id })
//     const listOfDietitians = await Member.find({ usertype: "dietitian" }); // Fetch all dietitians
//     console.log(dietitian);
//     // render page
//     res.render("dietitian", {
//       user: req.user,
//       loggedInMember: loggedInMember,
//       dietitian: dietitian,
//       listOfDietitians: listOfDietitians
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.get("/mydietitian", ensureAuthenticated, async function (req, res) {
  try {
    const loggedInMember = await Member.findOne({ googleID: req.user.id });
    const dietitians = await Member.find({ usertype: "dietitian" });
    let currentActiveDietitianName = "None";

    if(loggedInMember.dietitian) {
      const currentActiveDietitian = await Member.findOne({ googleID: loggedInMember.dietitian });
      if(currentActiveDietitian) {
        currentActiveDietitianName = `${currentActiveDietitian.firstName} ${currentActiveDietitian.lastName}`;
      }
    }

    res.render("dietitian", {
      user: req.user,
      loggedInMember: loggedInMember,
      dietitians: dietitians,
      currentActiveDietitianName: currentActiveDietitianName
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


app.post('/assign-dietitian', ensureAuthenticated, async (req, res) => {
  console.log("-----POST-----")
  try {
    const userId = req.user.id; // Use the correct method to get the logged-in user's ID
    console.log("User ID: " + userId);
    const { dietitianId } = req.body;
    console.log("Dietitian ID: " + dietitianId);

    // Update the logged-in user's dietitian
    await Member.updateOne({ googleID: userId }, { $set: { dietitian: dietitianId } });

    // Fetch the assigned dietitian's name
    const assignedDietitian = await Member.findOne({ googleID: dietitianId });
    console.log(assignedDietitian);
    const dietitianName = `${assignedDietitian.firstName} ${assignedDietitian.lastName}`;

    res.json({ message: 'Dietitian assigned successfully', dietitianName: dietitianName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while assigning the dietitian' });
  }
});

