"use strict";
///////////////
// FUNCTIONS //
///////////////
// you can never escape the bad jquery
const $ = (query) => {
    return document.querySelector(query);
};
const $all = (query) => {
    return Array.from(document.querySelectorAll(query));
};
const loadHTML = async (path, selector) => {
    const element = $(selector);
    if (!element) {
        return;
    }
    const file = await fetch(path);
    const html = await file.text();
    element.innerHTML = html;
};
////////////////////////
// LOAD PAGE ELEMENTS //
////////////////////////
loadHTML('page/header.html', 'header');
loadHTML('page/footer.html', 'footer');
// i have no idea if this is remotely good,
// but i got tired of copy pasting html
//////////////////////
// PAGE SPECIFIC JS //
//////////////////////
// get name of page
const path = window.location.pathname;
const page = path.split('/').pop();
switch (page) {
    // there has to be a better way to do this, right?
    case 'index.html':
        const issArtDiv = $('#iss-art');
        let issSpaceState = false;
        issArtDiv.onclick = () => {
            issArtDiv.style.backgroundColor = issSpaceState ? 'white' : 'black';
            $('#iss-art img').src = issSpaceState
                ? 'images/home/issArt.png'
                : 'images/home/issArt.svg';
            issSpaceState = !issSpaceState;
        };
        break;
    case 'space.html':
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
                iconUrl: '../images/space/issIcon.png',
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
                    iconUrl: '../images/space/circle.svg',
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
                let months = [
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
                let date = net.split('-');
                let year = date[0];
                let month = months[parseInt(date[1]) - 1];
                let day = date[2].slice(0, 2);
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
        break;
    case 'projects.html':
        // ECA //
        const columns = 15;
        const rows = 10;
        const container = [];
        const rule = 30;
        // convert rule to primary rules stored in an array
        const processRule = (rule) => {
            let binary = rule.toString(2);
            let binaryArray = Array.from(binary);
            let ruleList = [];
            for (let i = 0; i < binaryArray.length; i++) {
                let x = parseInt(binaryArray[binaryArray.length - i - 1]);
                if (x == 1) {
                    ruleList.push(2 ** i);
                }
            }
            return ruleList;
        };
        const ruleArray = processRule(rule);
        // check neighbors of previous line
        const cellState = (row, i) => {
            let state = '';
            if (container[row - 1][i - 1] && container[row - 1][i - 1].classList.contains('alive')) {
                state += '1';
            }
            else {
                state += '0';
            }
            if (container[row - 1][i] && container[row - 1][i].classList.contains('alive')) {
                state += '1';
            }
            else {
                state += '0';
            }
            if (container[row - 1][i + 1] && container[row - 1][i + 1].classList.contains('alive')) {
                state += '1';
            }
            else {
                state += '0';
            }
            let rule = 2 ** parseInt(state, 2);
            return rule;
        };
        // generate next layer
        const generateLayer = (rule, container) => {
            for (let i = 0; i < container.length; i++) {
                if (i == 0) {
                    continue;
                }
                for (let j = 0; j < container[0].length; j++) {
                    let item = container[i][j];
                    item.classList.remove('alive');
                    item.classList.add('dead');
                    if (ruleArray.includes(cellState(i, j))) {
                        item.classList.add('alive');
                        item.classList.remove('dead');
                    }
                }
            }
        };
        // make items in 2D array
        for (let i = 0; i < rows; i++) {
            container[i] = [];
            for (let j = 0; j < columns; j++) {
                const item = document.createElement('div');
                item.classList.add('cell', 'dead');
                container[i][j] = item;
                item.onmouseenter = item.onmouseleave = () => {
                    item.classList.toggle('select');
                    if (container[i - 1] && container[i - 1][j - 1]) {
                        container[i - 1][j - 1].classList.toggle('select');
                    }
                    if (container[i - 1] && container[i - 1][j]) {
                        container[i - 1][j].classList.toggle('select');
                    }
                    if (container[i - 1] && container[i - 1][j + 1]) {
                        container[i - 1][j + 1].classList.toggle('select');
                    }
                };
                if (i == 0) {
                    item.onclick = () => {
                        item.classList.toggle('alive');
                        item.classList.toggle('dead');
                        generateLayer(rule, container);
                    };
                }
            }
        }
        // plot
        container.forEach((list) => {
            const row = document.createElement('div');
            row.classList.add('cell-row');
            list.forEach((item) => {
                row.appendChild(item);
            });
            generateLayer(rule, container);
            $('#eca-grid').appendChild(row);
        });
        break;
}
// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
