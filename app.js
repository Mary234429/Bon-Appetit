//import required modules
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const passport = require('passport');
const path = require('path');
const mongoose = require('mongoose');

//serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

//Import Database Models
const { } = require('./model');

//Database Connection
const {getDb, connectToDb } = require('./db');
const { Server } = require('net');

//Configure views and view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');

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