function generateGeoAction(evt) {

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
        });

    makeCountdown();
};

// receive weather data, make post request
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

// update the GUI
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

export { generateGeoAction }