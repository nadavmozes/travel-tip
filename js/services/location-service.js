'use strict'
const KEY = 'locDB'
var gSavedLoc;
const gLocations = [{
    id: makeId(),
    name: 'Puki Home',
    lat: 17,
    lng: 19,
    weather: '30C',
    createdAt: '32165465465',
    updatedAt: '65465465465',
}];

export const locationService = {
    getLocations
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
        if (confirm('are you sure?')) gSavedLoc.splice(locIdx, 1);
        saveInLocalStorage(KEY, gSavedLoc);
    }
}

function getLocIdxById(locId) {
    const idx = gLocations.findIndex(function(location) {
        return location.id === locId;
    })
}
// function goToLoc {

// }