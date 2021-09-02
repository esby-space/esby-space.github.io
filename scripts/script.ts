// Original program files written in Typescript, in script.ts

///////////////
// FUNCTIONS //
///////////////

// you can never escape the worse jquery
const $ = (query: string): any => {
    return document.querySelector(query);
};

const $all = (query: string): any[] => {
    return Array.from(document.querySelectorAll(query));
};

const loadHTML = async (path: string, selector: string): Promise<void> => {
    const element = $(selector);
    if (!element) return;
    const file = await fetch(path);
    const html = await file.text();
    element.innerHTML = html;
};

///////////////
// GLOBAL JS //
///////////////

let widescreen = false;
loadHTML('page/header.html', 'header');
loadHTML('page/footer.html', 'footer').then(() => {
    $('#scroll-button').onclick = () => {
        window.scrollTo(0, 0);
    };

    $('#wide-button').onclick = () => {
        if (widescreen) {
            $('header').style.maxWidth = '50rem';
            $('main').style.maxWidth = '50rem';
            $('footer').style.maxWidth = '50rem';
            $('#wide-button').innerHTML = '↔ widescreen';
        } else {
            $('header').style.maxWidth = 'none';
            $('main').style.maxWidth = 'none';
            $('footer').style.maxWidth = 'none';
            $('#wide-button').innerHTML = '⇄ normal';
        }
        widescreen = !widescreen;
    };
});
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
    case '':
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
        const L = (window as any).L;
        let map: any;

        // show map and display the iss
        $('#iss-button').onclick = () => {
            // show things
            $('#iss-map').style.display = 'block';
            $('#position-button').style.display = 'inline-block';

            map = L.map('iss-map').setView([0, 0], 1);
            const tileUrl =
                'https://api.mapbox.com/styles/v1/esby/cksuyzm6z5n0417nx3j3uq7pu/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZXNieSIsImEiOiJja3N1eWh2YTgwNG91MnVueXVkNnc5NXkyIn0.kOLtv84UDQ5eVj2hZWP8GQ';
            const attribution =
                "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>";
            L.tileLayer(tileUrl, { attribution }).addTo(map);

            const issIcon = L.icon({
                iconUrl: './images/space/issIcon.png',
                iconSize: [50, 35],
                iconAnchor: [25, 17.5],
            });
            const issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);

            // get iss position and plot
            let first = true;
            const getISS = async (): Promise<void> => {
                const response = await fetch(
                    'https://api.wheretheiss.at/v1/satellites/25544'
                );
                const data = await response.json();
                const { latitude, longitude } = data;
                $('#iss-coordinates').innerHTML = `Latitude: ${Math.round(latitude * 100) / 100
                    }°<br>Longitude: ${Math.round(longitude * 100) / 100}°`;
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
                    iconUrl: './images/space/circle.svg',
                    iconSize: [12, 12],
                    iconAnchor: [6, 6],
                });
                const userMarker = L.marker([0, 0], { icon: userIcon }).addTo(
                    map
                );
                userMarker.setLatLng([latitude, longitude]).addTo(map);
                map.setView([latitude, longitude], 2);
            });
        };

        // ROCKET LAUNCH //
        $('#launch-list-button').onclick = () => {
            // turn launch api's 2021-08-28Twhatever into something readable
            const toDate = (net: string): string => {
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
            const getLaunches = async (): Promise<void> => {
                const response = await fetch(
                    'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?mode=normal'
                );
                const data = await response.json();
                data['results'].forEach((launch: any) => {
                    const item = document.createElement('li');
                    item.innerHTML = `<p>${toDate(launch.net)}: ${launch.name
                        }<\p>`;
                    $('#launch-list').appendChild(item);
                });
            };
            getLaunches();
            // TODO: display specific times of rocket launches, add images, sort
        };
        break;

    case 'projects.html':

        // ECA //
        interface ECA {
            rule: number;
            rows: number;
            columns: number;
            color: Boolean;
            cells: Element[][];
            ruleArray: number[];

            alive(cell: Element): void;
            kill(cell: Element): void;
            toggle(cell: Element): void;

            makeCells(selector?: string): void;
            cellState(row: number, column: number): number;
            generate(): void;

            [key: string]: any;
        }

        const ECA: ECA = {
            rule: 30,
            rows: 10,
            columns: 15,
            color: false,
            cells: [],

            // me being lazy functions
            alive: function (cell: Element) {
                cell.classList.remove('dead');
                cell.classList.add('alive');
            },

            kill: function (cell: Element) {
                cell.classList.remove('alive');
                cell.classList.add('dead');
            },

            toggle: function (cell: Element) {
                cell.classList.toggle('alive');
                cell.classList.toggle('dead');
            },

            // turn rule into binary, then sums of power of 2
            get ruleArray(): number[] {
                const binary = this.rule.toString(2);
                const binaryArray = Array.from(binary).reverse();
                const ruleList: number[] = [];
                binaryArray.forEach((x, i) => {
                    let digit = parseInt(x);
                    digit == 1 && ruleList.push(2 ** i);
                });
                return ruleList;
            },

            // fill 2D array with cells, rows * (3 * columns)
            makeCells: function (selector?: string): void {
                selector && (this.selector = selector);
                this.cells = [];
                for (let i = 0; i < this.rows; i++) {
                    this.cells[i] = [];
                    for (let j = 0; j < 3 * this.columns; j++) {
                        // need to *3 so that it doesn't colide into the edge
                        const cell = document.createElement('div');
                        cell.classList.add('cell', 'dead');
                        this.cells[i][j] = cell;
                        cell.onmouseenter = cell.onmouseleave = () => {
                            cell.classList.toggle('select');
                        };

                        cell.onclick =
                            i == 0
                                ? () => {
                                    this.toggle(cell);
                                    this.generate();
                                }
                                : () => {
                                    this.toggle(cell);
                                    const ruleChange = this.cellState(i, j);
                                    this.ruleArray.includes(ruleChange)
                                        ? (this.rule -= ruleChange)
                                        : (this.rule += ruleChange);
                                    this.generate();
                                    $('#eca-rule').value = this.rule;
                                    // bad form, i know
                                };
                    }
                }

                // plot cells to the website
                $(this.selector).innerHTML = '';
                this.cells.forEach((layer) => {
                    const row = document.createElement('div');
                    row.classList.add('cell-row');
                    for (let i = layer.length / 3; i < (2 * layer.length) / 3; i++) {
                        row.appendChild(layer[i]);
                    }
                    $(this.selector).appendChild(row);
                });
            },

            // determine the cells above a cell
            cellState: function (row: number, column: number): number {
                let state = '';
                for (let i = -1; i <= 1; i++) {
                    this.cells[row - 1][column + i] &&
                        this.cells[row - 1][column + i].classList.contains('alive')
                        ? (state += '1')
                        : (state += '0');
                }
                return 2 ** parseInt(state, 2);
            },

            // make cells alive or dead, color them
            generate: function (): void {
                this.cells.forEach((layer, i) => {
                    if (i == 0) return;
                    layer.forEach((cell, j) => {
                        const state = this.cellState(i, j);
                        let classes = Array.from(cell.classList);
                        classes.forEach((cellClass) => {
                            cellClass.includes('color') && cell.classList.remove(cellClass);
                            return;
                        });
                        if (this.ruleArray.includes(state)) {
                            this.alive(cell);
                            this.color && cell.classList.add(`color-${state}`);
                        } else {
                            this.kill(cell);
                        }
                    });
                });
            },
        };

        ECA.makeCells('#eca-cells');

        $('#eca-rule').value = ECA.rule;
        $('#eca-row').value = ECA.rows;
        $('#eca-column').value = ECA.columns;

        // user input
        $('#eca-rule').oninput = () => {
            ECA.rule = parseInt($('#eca-rule').value);
            ECA.generate();
        };

        $('#eca-random-rule').onclick = () => {
            ECA.rule = Math.floor(Math.random() * 256);
            $('#eca-rule').value = ECA.rule;
            ECA.generate();
        };

        $('#eca-row').onchange = () => {
            ECA.rows = parseInt($('#eca-row').value);
            ECA.makeCells();
        };

        $('#eca-column').onchange = () => {
            ECA.columns = parseInt($('#eca-column').value);
            ECA.makeCells();
        };

        $('#eca-random-first').onclick = () => {
            const length = ECA.cells[0].length;
            for (let i = length / 3; i < (2 * length) / 3; i++) {
                ECA.kill(ECA.cells[0][i]);
                Math.random() > 0.5 && ECA.toggle(ECA.cells[0][i]);
            }
            ECA.generate();
        };

        $('#eca-clear-first').onclick = () => {
            ECA.cells[0].forEach((cell) => {
                ECA.kill(cell);
            });
            ECA.generate();
        };

        $('#eca-color').onclick = () => {
            ECA.color = !ECA.color;
            $('#eca-color').innerHTML = ECA.color ? 'no color' : 'color mode!';
            ECA.generate();
        };

        $('#eca-button').onclick = () => {
            $all('.cell-row').forEach((element) => {
                element.style.margin = '0px auto';
            });
            $all('.cell-row').forEach((element) => {
                element.style.gap = '0px';
            });
            $all('.cell').forEach((element) => {
                element.style.borderRadius = '0px';
            });
        };

        $('#eca-reset').onclick = () => {
            window.location.reload();
        };

        // i just realized that dave shiffman did a tutorial on this
        // and did it way better than me
        // oh well!
}

// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
