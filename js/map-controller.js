import { locationService } from './services/location-service.js'


console.log('locationService', locationService);

var gGoogleMap;

window.onload = () => {
    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR')); // If map didn't load for some reason
    document.querySelector('.btn-curr-loc').addEventListener('click', () => {
        getUserPosition()
            .then(pos => {
                console.log('User position is:', pos.coords);
                const userLat = pos.coords.latitude;
                const userLng = pos.coords.longitude
                panTo(userLat, userLng); // If user gave permission, move map view to his location and add a marker.
                addMarker({ lat: userLat, lng: userLng });
                return gGoogleMap;
            })
            .catch(err => {
                console.log('err!!!', err);

            })
    })





    document.querySelector('.btn').addEventListener('click', (ev) => {
        console.log('Aha!', ev.target);
        panTo(35.6895, 139.6917);
    })
}


export function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gGoogleMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            return gGoogleMap
        })
        .then(map => {
            map.addListener('click', ((e) => {
                console.log('lat', e.latLng.lat());
                console.log('lat', e.latLng.lng());
            }))
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gGoogleMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gGoogleMap.panTo(laLatLng);
}

function getUserPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyBO-cyL0lQfhN_4EeEYQE0fxkphxpUTals'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}