import { locationService } from './services/location-service.js'


console.log('locationService', locationService);

var gGoogleMap;
var gMarkers = [];
var gCurrPos = {
    lat: 32.0852999,
    lng: 34.78176759999999,
    name: 'Tel Aviv-Yafo'
}

window.onload = () => {
    renderLocations();
    onSearchInput()
    showWeather()

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
                updateCurrLocation(userLat, userLng, 'My Home');
                renderLocationName('My Home')
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

function showWeather() {
    const lat = gCurrPos.lat;
    const lng = gCurrPos.lng;
    locationService.getWeather(lat, lng)
        .then(data => {
            return new Promise((resolve, reject) => {
                const weatherData = {
                    description: data.weather[0].description,
                    mainTemp: data.main.temp,
                    minTemp: data.main.temp_min,
                    maxTemp: data.main.temp_max,
                    wind: data.wind.speed,
                }
                resolve(weatherData)

            })
        })
        .then(data => renderWeather(data))



}

function renderWeather(data) {
    document.querySelector('.location-name').innerText = gCurrPos.name
    document.querySelector('.weather-text').innerText = data.description;
    document.querySelector('.weather-temp').innerText = Math.floor(data.mainTemp);
    document.querySelector('.min-temp').innerText = Math.floor(data.minTemp);
    document.querySelector('.max-temp').innerText = Math.floor(data.maxTemp) + ' °C,';
    document.querySelector('.wind').innerText = ' wind: ' + data.wind + 'm/s.';
}

function renderLocationName(name) {
    document.querySelector('.info-section span').innerText = ' ' + name
    showWeather()
}

function updateCurrLocation(lat, lng, name) {
    gCurrPos.lat = lat;
    gCurrPos.lng = lng;
    gCurrPos.name = name;
    console.log(gCurrPos)
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
        .then(map => { // Listen to a click and get the lat, lng
            return new Promise((resolve, reject) => {
                map.addListener('click', ((e) => {
                    const saveBtn = document.querySelector('.btn-save')
                    saveBtn.classList.add('animate-btn')
                    setTimeout(() => { saveBtn.classList.remove('animate-btn') }, 1000)
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    const pos = { lat, lng };
                    updateCurrLocation(lat, lng, 'Earth');
                    renderLocationName(gCurrPos.name)
                    addMarker({ lat: pos.lat, lng: pos.lng });
                    console.log(pos);
                    console.log('lat', e.latLng.lat());
                    console.log('lat', e.latLng.lng());
                    resolve(pos); // Will return to .then an object containing lat and lng.
                }))
            })
        })

        .then(pos => {
            return new Promise((resolve, reject) => {

                document.querySelector('.btn-save').addEventListener('click', (() => {
                    console.log(pos);
                    console.log('Prompting user')
                    onSaveLocation(pos); // Prompt user for a location name
                }))
            })
        })


}

function onSearchInput() {
    const elForm = document.querySelector('.user-search')
    elForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const elInput = document.querySelector('input[name="search"]')
        const userSearchTerm = elInput.value;
        elInput.value = '';
        locationService.getGeoPos(userSearchTerm)
            .then(data => {
                console.log(data)
                gCurrPos.name = data.results[0].address_components[0].long_name
                return data
            })
            .then(data => data.results[0].geometry.location)
            .then(location => {
                panTo(location.lat, location.lng)
                updateCurrLocation(location.lat, location.lng, gCurrPos.name)
                renderLocationName(gCurrPos.name)
            })



    })
}

function onUserInput(pos, name) {
    locationService.createLoc(pos.lat, pos.lng, name); // Create the location using the service
    console.log(locationService.gLocations)
}

function renderLocations() {
    locationService.createLocations();
    locationService.getLocations()
        .then(locations => {
            const strHTMLs = locations.map(location => {
                return `
    <li class="flex"><p>${location.name}</p><i class="fas fa-map-marker-alt go-to-btn go-loc-${location.id}"></i><i class="far fa-trash-alt delete-location-btn del-loc-${location.id}"></i></li>
               `
            })
            document.querySelector('.locations-list').innerHTML = strHTMLs.join('');
            return locations;
        })
        .then(locations => {
            locations.forEach(location => {
                document.querySelector(`.go-loc-${location.id}`).addEventListener('click', ((e) => {
                    onListLocationClick(location)
                }))
                document.querySelector(`.del-loc-${location.id}`).addEventListener('click', (e) => {
                    console.log(location.id)
                    locationService.removeLoc(location.id)
                    renderLocations()
                })
            })
        })

}

function onListLocationClick(location) { // Pan to location on map after user click
    const locLat = location.lat;
    const locLng = location.lng;
    updateCurrLocation(locLat, locLng, location.name)
    console.log(location);
    document.querySelector('.info-section span').innerText = ' ' + location.name
    document.querySelector('.location-name').innerText = location.name
    panTo(locLat, locLng)
    addMarker({ lat: locLat, lng: locLng });
}


function addMarker(loc) {
    clearMarkers() // Clear previous markers whenever a new marker is placed.
    var marker = new google.maps.Marker({
        position: loc,
        map: gGoogleMap,
        title: 'Hello World!'
    });
    gMarkers.push(marker)
    return marker;
}

function setMapOnAll(map) { // Related to clearing markers
    for (var i = 0; i < gMarkers.length; i++) {
        gMarkers[i].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
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
    const API_KEY = 'AIzaSyBO-cyL0lQfhN_4EeEYQE0fxkphxpUTals';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}



function onSaveLocation(pos) {
    return Swal.fire({
        title: 'Enter location\'s name',
        input: 'text',
        customClass: {
            validationMessage: 'A name is required.'
        },
        preConfirm: (value) => {
            if (!value) {
                Swal.showValidationMessage(
                    '<i class="fa fa-info-circle"></i> A name is required.'
                )
            }
        }
    })
        .then(isConfirm => {
            if (isConfirm) {
                const name = document.querySelector('.swal2-input').value
                console.log('location name:', name);
                if (!name) return;
                onUserInput(pos, name);
                renderLocations()
            }
        })


}