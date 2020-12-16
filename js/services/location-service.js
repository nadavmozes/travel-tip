const KEY = 'locDB'
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
    getLocations,
    createLoc,
    removeLoc,
    getLocationForDisplay
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
        if (confirm('are you sure?')) gLocations.splice(locIdx, 1);
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