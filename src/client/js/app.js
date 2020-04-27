/* Global Variables */
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?'
    // zip={zip code},{country code}
const apiKey = '&appid=b1e4acaf20b9ba652fd4325adbc2cac0';

// let exampleRequestUS = `${baseURL}zip=94040,us${apiKey}`;
// let exampleRequestDE = `${baseURL}zip=73733,de${apiKey}`;

function generateAction(evt) {
    const zip = document.getElementById('zip').value;
    const userResp = document.getElementById('feelings').value;
    getWeatherData(baseURL, zip, apiKey)
        // use data with then function
        .then(function(data) {
            // POST Data
            postData('/addEntry', { key: entryKey, date: newDate, temp: data.main.temp, user: userResp })
                // Update GUI?
            updateGUI();
        })
};

// update the GUI
const updateGUI = async() => {
    const request = await fetch('/getdata');
    try {
        const allData = await request.json();
        const degreeC = Math.round(parseFloat(allData[entryKey].temp) - 273.15);
        document.getElementById('date').innerHTML = allData[entryKey].date;
        document.getElementById('temp').innerHTML = `${degreeC} C`;
        document.getElementById('content').innerHTML = allData[entryKey].user;
        document.getElementById('entryHolder').style.visibility = 'visible';
    } catch (error) {
        console.log("error", error);
    }

}

// Create a new date instance dynamically with JS
let d = new Date();
// getMonth is zero indexed
let correctMonth = d.getMonth() + 1
let newDate = correctMonth + '.' + d.getDate() + '.' + d.getFullYear();
let entryKey = `${correctMonth}${d.getDate()}${d.getFullYear()}`;

// console.log(entryKey);
// console.log(newDate);

const getWeatherData = async(baseURL, zip, apiKey) => {

    const res = await fetch(`${baseURL}zip=${zip},us${apiKey}`)

    try {
        const data = await res.json();
        console.log("Weather data received!")
            // console.log(data);
        console.log(data.main.temp)
        return data;
    } catch (error) {
        console.log("error", error);
    };
};

const postData = async(url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newEntry = await response.json();
        return newEntry
    } catch (error) {
        console.log("error", error);
    }
}

export { generateAction }