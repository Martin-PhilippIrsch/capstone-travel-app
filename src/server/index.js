// import { TRUE } from "node-sass";

// start the server
const fetch = require("node-fetch");

// Setup empty JS object to act as endpoint for all routes
let projectData = {};
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

// API global keys
const geoAPIKey = process.env.geoAPIKey;
const weatherbitKey = process.env.weatherbitKey;
const pixaKey = process.env.pixaKey;

// check if apikeys available
function apiKeysavailable(apikey) {
    if (apikey.length === 0) {
        return false;
    }
    return true;
}

if (!apiKeysavailable(geoAPIKey) || !apiKeysavailable(weatherbitKey) || !apiKeysavailable(pixaKey)) {
    alert("There seems to be a problem with the servers Api Keys. Currently, you will not be able to use our website!");
    process.exit();
}

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

// ***************************************
// ******** Weatherbit API ***************
// ***************************************

app.post('/weatherinfo', async(req, res, next) => {
    try {
        // get the name of city code
        const city = req.body.city;
        const lat = req.body.lat;
        const long = req.body.long;
        console.log(`POST request to receive weather information data for ${city}`);
        console.log(`lat: ${lat}, long: ${long}`);

        // await is important here
        const today = await getWeatherinformation(city, lat, long);

        const forecast = await getWeatherForecast(city, lat, long);
        res.send({ tdy: today, frcst: forecast });

    } catch (e) {
        return next(e)
    }
});

// function to fetch the geoinformation data from api
const getWeatherinformation = async(city, lat, long) => {
    const weatherEndpoint = `https://api.weatherbit.io/v2.0/current?&lat=${lat}&lon=${long}&key=${weatherbitKey}`;

    const res = await fetch(weatherEndpoint)

    try {
        const data = await res.json();
        console.log(`Weatherbit information data received! ${data}`);
        // current weather

        return data

    } catch (error) {
        console.log("error", error);
    };
};
// Get forecast for next days
const getWeatherForecast = async(city, lat, long) => {
    const weatherEndpoint = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${long}&key=${weatherbitKey}`;

    const res = await fetch(weatherEndpoint)

    try {
        const data = await res.json();
        console.log(`Weatherbit forecast data received! ${data}`)

        return data

    } catch (error) {
        console.log("error", error);
    };
};

// ***************************************
// ******** Pixabay API ***************
// ***************************************
// pixaKey

app.post('/pixainfo', async(req, res, next) => {
    try {
        // get the name of city code
        const city = req.body.city;
        const country = req.body.country;

        console.log(`POST request to receive pixabay image for ${city} in ${country}`);
        // await is important here
        const imageDataCity = await getPixaImage(city);
        const imageDataCountry = await getPixaImage(country);
        res.send({
            city: imageDataCity,
            country: imageDataCountry
        });

    } catch (e) {
        return next(e)
    }
});

const getPixaImage = async(location) => {
    const pixaEndpoint = `https://pixabay.com/api/?key=${pixaKey}&q=${location}&image_type=photo`;

    const res = await fetch(pixaEndpoint)

    try {
        const data = await res.json();
        console.log(`PixaBay Image data received! ${data}`)
        return data

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

// POST addEntry in project data
app.post('/postgeoinfo', addGeoInfo);

function addGeoInfo(req, res) {
    console.log('POST request');
    const geoData = req.body.geo;
    //create new entry
    newEntry = {
        country: geoData.countryName,
        state: geoData.adminName1,
        population: geoData.population,
        lat: geoData.lat,
        long: geoData.lng,
    }

    // add to project data
    projectData[geoData.name] = newEntry;
}

// POST extend city entry in project data
app.post('/postweatherinfo', addWeatherInfo);

function addWeatherInfo(req, res) {
    console.log('POST request');
    const city = req.body.city;
    const weatherData = req.body.weather;

    // add to project data

    weatherEntry = {
        description: weatherData.frcst.data[0].weather.description,
        high: weatherData.frcst.data[0].high_temp,
        low: weatherData.frcst.data[0].low_temp,
    }

    projectData[city].weather = weatherEntry;
}

// POST extend countdown in project data for city entry
app.post('/postcountdowninfo', addCountdownInfo);

function addCountdownInfo(req, res) {
    console.log('POST for countdown request');
    const city = req.body.city;
    const countdownData = req.body.countdown;

    // add to project data
    projectData[city].triplength = countdownData.tlength;
    projectData[city].countdays = countdownData.days;
}

// POST extend city entry in project data with image info
app.post('/postimageinfo', addImageInfo);

function addImageInfo(req, res) {
    console.log('POST for Image Pixabay request');
    const city = req.body.city;
    const data = req.body.img;

    // add to project data
    projectData[city].imgcity = data.city.hits[0].webformatURL;
    projectData[city].imgcountry = data.country.hits[0].webformatURL;
}

// export for testing
exports.apiKeysavailable = apiKeysavailable;