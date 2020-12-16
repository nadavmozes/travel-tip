'use strict'

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
        name
    }
    return loc;
}