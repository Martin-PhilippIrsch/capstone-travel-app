// start the server
const fetch = require("node-fetch");

// Setup empty JS object to act as endpoint for all routes
projectData = {};
const path = require('path')

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
app.use(express.static('dist'));



// webpack middleware development
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
// development!
const config = require('../../webpack.dev');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
}));

// environment variables
const dotenv = require('dotenv');
dotenv.config();

// get the environment variables

// Setup Server
var PORT = 8081;
const server = app.listen(PORT, listening);

function listening() {
    console.log(`running on localhost: ${PORT}`);
};

// main site
app.get('/', function(req, res) {
    res.sendFile('dist/index.html')
})

// API variables
/* Global Variables */
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?'
    // zip={zip code},{country code}
const apiKeyWeather = process.env.API_KEY_WEATHER;

console.log(`Your API key is ${process.env.API_KEY_WEATHER}`);


// returning Weather Data
const getWeatherData = async(zip) => {

    const res = await fetch(`${baseURL}zip=${zip},us${apiKeyWeather}`)

    try {
        const data = await res.json();
        console.log(`Weather data received! ${data.main.temp}`)

        // // new entry
        // newEntry = {
        //     temp: data.main.temp,
        // }
        // weatherData[0] = newEntry;

        // console.log(weatherData);
        return data

    } catch (error) {
        console.log("error", error);
    };
};
// POST Routes
app.post('/reqweatherdata', async(req, res, next) => {
    try {
        console.log('POST request to receive weather data');

        // get the Zip code
        const zipCode = req.body.zip;
        // TODO: check if zip code is valid
        console.log(zipCode)

        // await is important here
        const data = await getWeatherData(zipCode);
        res.send(data)

    } catch (e) {
        return next(e)
    }
});

// *************************************
// Geoinformation Requests
// POST Route
app.post('/geoinfo', async(req, res, next) => {
    try {
        // get the name of city code
        const city = req.body.city;
        console.log(`POST request to receive geoinformation data for ${city}`);

        // TODO: check if city input is valid

        // await is important here
        const data = await getGeoinformation(city);
        res.send(data)

    } catch (e) {
        return next(e)
    }
});

// function to fetch the geoinformation data from api
const getGeoinformation = async(city) => {
    const geoAPIKey = process.env.geoAPIKey;
    // const cityTest = 'London'
    const geoEndpoint = `http://api.geonames.org/searchJSON?formatted=true&q=${city}&username=${geoAPIKey}`;

    const res = await fetch(geoEndpoint)

    try {
        const data = await res.json();
        console.log(`Geoinformation data received!`)
        return data.geonames[0]

    } catch (error) {
        console.log("error", error);
    };
};


// GET route returning projectData
app.get('/getdata', function(req, res) {
    console.log('GET data request');
    res.send(projectData);
    console.log(projectData);
});

// POST addEntry
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