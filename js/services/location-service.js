const KEY = 'locDB'
var gLocations = [{
    id: makeId(),
    name: 'Puki Home',
    lat: 17,
    lng: 19,
    weather: '30C',
    createdAt: '32165465465',
    updatedAt: '65465465465',
}];

var gCurrPos = {
    lat: 32.0852999,
    lng: 34.78176759999999
}

export const locationService = {
    getLocations,
    createLoc,
    removeLoc,
    createLocations,
    getGeoPos,
    getWeather,
}


function getLocations() {
    return Promise.resolve(gLocations)
}

function createLoc(lat, lng, name) {
    var loc = {
        id: makeId(),
        lat,
        lng,
        name,
        createdAt: Date.now(),
    }
    gLocations.push(loc);
    saveInLocalStorage(KEY, gLocations)
}

function removeLoc(locId) {
    const locIdx = getLocIdxById(locId);
    if (locIdx >= 0) {
        if (confirm('Are you sure?')) gLocations.splice(locIdx, 1);
        saveInLocalStorage(KEY, gLocations);
    }
}

function getLocIdxById(locId) {
    const idx = gLocations.findIndex(function (location) {
        return location.id === locId;
    })
    return idx;
}

function createLocations() {
    const locations = getFromLocalStorage(KEY)
    if (!locations || !locations.length) {
        gLocations = [];
        saveInLocalStorage(KEY, gLocations);
        return;
    }
    gLocations = locations;
}

function getGeoPos(address) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBl87TiQS8GLNue1FDNN3tM3GN9QkCw3lc`)
        .then(res => res.data)
}

function getWeather(lat, lon) {
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f55cd804eeed6f4a96f9f0f6d9d31b33&units=metric`)
        .then(res => res.data)
}