'use strict'

const gLocations = [{
    id,
    name: 'Puki Home',
    lat: 17,
    lng: 19,
    weather,
    createdAt,
    updatedAt,
}];

export const locationService = {
    getLocations
}


function getLocations() {
    return Promise.resolve(gLocations)
}

function createLoc(lat, lng, name) {
    let loc = {
        id: makeId(),
        lat,
        lng,
        name
    }
    return loc;
}