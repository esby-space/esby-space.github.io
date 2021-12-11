"use strict";
// ISS MAP //
const L = window.L;
let map;
// show map and display the iss
$('#iss-button').onclick = () => {
    // show things
    $('#iss-map').style.display = 'block';
    $('#position-button').style.display = 'inline-block';
    map = L.map('iss-map').setView([0, 0], 1);
    const tileUrl = 'https://api.mapbox.com/styles/v1/esby/cksuyzm6z5n0417nx3j3uq7pu/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZXNieSIsImEiOiJja3N1eWh2YTgwNG91MnVueXVkNnc5NXkyIn0.kOLtv84UDQ5eVj2hZWP8GQ';
    const attribution = "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>";
    L.tileLayer(tileUrl, { attribution }).addTo(map);
    const issIcon = L.icon({
        iconUrl: '/images/iss/issIcon.png',
        iconSize: [50, 35],
        iconAnchor: [25, 17.5],
    });
    const issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);
    // get iss position and plot
    let first = true;
    const getISS = async () => {
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await response.json();
        const { latitude, longitude } = data;
        $('#iss-coordinates').innerHTML = `Latitude: ${Math.round(latitude * 100) / 100}°<br>Longitude: ${Math.round(longitude * 100) / 100}°`;
        issMarker.setLatLng([latitude, longitude]).addTo(map);
        if (first) {
            map.setView([latitude, longitude], 2);
            first = false;
        }
    };
    getISS();
    setInterval(getISS, 1000);
    // TODO: add icons for launch sites, mission control, SAA, etc.
};
// user position
$('#position-button').onclick = () => {
    navigator.geolocation.getCurrentPosition((position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        const userIcon = L.icon({
            iconUrl: '/images/iss/circle.svg',
            iconSize: [12, 12],
            iconAnchor: [6, 6],
        });
        const userMarker = L.marker([0, 0], { icon: userIcon }).addTo(map);
        userMarker.setLatLng([latitude, longitude]).addTo(map);
        map.setView([latitude, longitude], 2);
    });
};
// ROCKET LAUNCH //
$('#launch-list-button').onclick = () => {
    // turn launch api's 2021-08-28Twhatever into something readable
    const toDate = (net) => {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        const date = net.split('-');
        const year = date[0];
        const month = months[parseInt(date[1]) - 1];
        const day = date[2].slice(0, 2);
        return `${month} ${day}, ${year}`;
    };
    // fetch api
    const getLaunches = async () => {
        const response = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?mode=normal');
        const data = await response.json();
        data['results'].forEach((launch) => {
            const item = document.createElement('li');
            item.innerHTML = `<p>${toDate(launch.net)}: ${launch.name}<\p>`;
            $('#launch-list').appendChild(item);
        });
    };
    getLaunches();
    // TODO: display specific times of rocket launches, add images, sort
};
// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
