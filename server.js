// start the server
// npx nodemon server.js

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require('body-parser')
    //Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 3000;
const server = app.listen(port, listening);

function listening() {
    console.log(`running on localhost: ${port}`);
};

// GET route returning projectData
app.get('/getdata', function(req, res) {
    console.log('GET data request');
    res.send(projectData);
    console.log(projectData);
});

app.post('/addEntry', addEntry);

function addEntry(req, res) {
    console.log('POST request');
    const date = req.body.date;
    //create new entry
    newEntry = {
        date: req.body.date,
        temp: req.body.temp,
        user: req.body.user
    }

    // add to project data
    projectData[req.body.key] = newEntry;
    // send the response
    // console.log(projectData);
    // res.send(projectData);
}