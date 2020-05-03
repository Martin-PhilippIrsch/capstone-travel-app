function generateFullAction(evt) {

    // console.log("Time to say Goodbye!")
    const nameCity = document.getElementById('cityname').value;
    // const userResp = document.getElementById('feelings').value;

    // // test if value is empty

    reqGeoinformation('/geoinfo', { city: nameCity })
        // use data with then function
        .then(function(data) {
            // TODO: PostDATA to Server for Logging
            // postData('/addEntry', { key: entryKey, date: newDate, temp: data.main.temp, user: userResp })
            //Update GUI
            updateGeoGUI(data);
            reqWeatherInformation('/weatherinfo', { city: data.name, lat: data.lat, long: data.lng })
                .then(function(data) {
                    updateWeatherGUI(data);
                    const entries = document.getElementsByClassName('entry');
                    for (let i = 0; i < entries.length; i++) {
                        entries[i].style.visibility = 'visible';
                    }
                });
            console.log(data.name, data.countryName)
            reqImage('/pixainfo', { city: data.name, country: data.countryName })
                .then(function(data) {
                    updateImageGUI(data);
                });
        });

    makeCountdown();


};

// receive weather data, make post request
const reqImage = async(url = '', data = {}) => {
    // make post request here 
    const request = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const allData = await request.json();
    console.log(`Pixabay received!`)
    return allData;
}

// receive weather data, make post request
const reqWeatherInformation = async(url = '', data = {}) => {
    // make post request here 
    const request = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const allData = await request.json();
    console.log(`Weatherbit data received!`)
    return allData;
}

// update the Weather GUI
const updateWeatherGUI = async(data) => {

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    try {
        document.getElementById('weather-0-frcst').innerHTML = `
                    <div>Today</div>
                    <figure>
                        <img src="https://www.weatherbit.io/static/img/icons/${data.frcst.data[0].weather.icon}.png" alt="Weather">
                        <figcaption>${data.frcst.data[0].weather.description}</figcaption>
                    </figure>
                    <div>High ${data.frcst.data[0].high_temp}C, Low ${data.frcst.data[0].low_temp}C</div>
                    `;


        for (let i = 1; i < 6; i++) {
            let d = new Date(data.frcst.data[i].valid_date);
            let dayName = days[d.getDay()];

            document.getElementById(`weather-${i}-frcst`).innerHTML = `
                    <div>${dayName}, ${data.frcst.data[i].valid_date}</div>
                    <figure>
                        <img src="https://www.weatherbit.io/static/img/icons/${data.frcst.data[i].weather.icon}.png" alt="Weather">
                        <figcaption>${data.frcst.data[i].weather.description}</figcaption>
                    </figure>
                    <div>High ${data.frcst.data[i].high_temp}C, Low ${data.frcst.data[i].low_temp}C</div>
                    `;
        }

        document.getElementById('entryHolderWeather').style.visibility = 'visible';
    } catch (error) {
        console.log("error", error);
    }

}

// receive geo data, make post request
const reqGeoinformation = async(url = '', data = {}) => {
    // make post request here 
    const request = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const allData = await request.json();
    console.log(`Geoinfo data received!`)
    return allData;
}

// update the Geo GUI
const updateGeoGUI = async(data) => {
    // const request = await fetch('/getdata');
    try {
        document.getElementById('geo-city').innerHTML = `City of ${data.toponymName} in ${data.adminName1}`;
        document.getElementById('geo-country').innerHTML = `Country: ${data.countryName}`;
        document.getElementById('geo-population').innerHTML = `Population: ${data.population}`;
        document.getElementById('geo-latitude').innerHTML = `Latitude: ${data.lat}`;
        document.getElementById('geo-longitude').innerHTML = `Longitude: ${data.lng}`;
        document.getElementById('entryHolderGeo').style.visibility = 'visible';
    } catch (error) {
        console.log("error", error);
    }

}

function makeCountdown() {

    const travelDate = document.getElementById('traveldate').value

    var t = Date.parse(travelDate) - Date.parse(new Date()); // parse to milliseconds
    const numDays = Math.floor(t / (1000 * 60 * 60 * 24)); // convert from millisecond to days
    document.getElementById('countdown-days').innerHTML = `${numDays} days left...`;

    // calculate triplength
    const endDate = document.getElementById('enddate').value

    const l = Date.parse(endDate) - Date.parse(travelDate);
    const triplength = Math.floor(l / (1000 * 60 * 60 * 24)); // convert to days again

    document.getElementById('triplength-days').innerHTML = `Your trip will be for ${triplength} days from ${travelDate} until ${endDate}!`;

    // TODO: PostDATA to Server for Logging
    // post...
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const updateImageGUI = async(data) => {
    // const request = await fetch('/getdata');
    try {
        // console.log(data.city.hits[imageID1].webformatURL);
        // console.log(data.country.hits[imageID1].webformatURL);
        let numberList = Array.from(Array(5), (x, i) => i);
        const imageIDs = shuffle(numberList)
        for (let i = 0; i < 3; i++) {
            const imageID = imageIDs[i];
            document.getElementById(`pixa-${i}`).src = `${data.city.hits[imageID].webformatURL}`;
            document.getElementById(`pixa-country-${i}`).src = `${data.country.hits[imageID].webformatURL}`;
        };
        document.getElementById('entryHolderPixa').style.visibility = 'visible';

        document.getElementById('entryHolderPixaCountry').style.visibility = 'visible';
    } catch (error) {
        console.log("error", error);
    }

}

export { generateFullAction }